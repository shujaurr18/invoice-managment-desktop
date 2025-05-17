import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import { db, storage } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import extractBBVADirectDebitData from './extractBBVADirectDebitData';
import { enhancedImageQualityCheck } from './imageQuality';

const InvoiceScanner = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [imageQuality, setImageQuality] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [missingFields, setMissingFields] = useState([]);
  const [showRawText, setShowRawText] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setError(null);
    setExtractedData(null);
    setImageQuality(null);
    setOcrText('');
    setProgress(0);
    setMissingFields([]);

    if (acceptedFiles.length === 0) {
      setError('Please upload a valid image (JPEG, PNG) or PDF.');
      return;
    }

    const file = acceptedFiles[0];
    setFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: onDrop
  });

  // Check image quality when preview is available
  useEffect(() => {
    if (preview && file && file.type.startsWith('image/')) {
      const img = new Image();
      img.src = preview;
      img.onload = () => {
        const qualityResult = enhancedImageQualityCheck(img);
        setImageQuality(qualityResult);
        
        // Auto-process if image quality is good enough
        if (qualityResult.score >= 60) {
          processFile();
        }
      };
    }
  }, [preview, file]);

  const processFile = async () => {
    if (!file) {
      setError('Please upload a file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setExtractedData(null);
    setProgress(0);
    setMissingFields([]);

    try {
      // Check if it's a PDF
      if (file.type === 'application/pdf') {
        setError('PDF processing is not yet supported. Please upload an image.');
        setIsProcessing(false);
        return;
      }

      // Process with Tesseract - optimized settings for Spanish BBVA receipts
      const result = await Tesseract.recognize(
        preview,
        'spa', // Spanish language
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(m.progress * 100);
            }
          },
          // Optimized Tesseract settings for receipt recognition
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzáéíóúÁÉÍÓÚüÜñÑ0123456789.,:-/€$@()% ',
          tessjs_create_hocr: '0',
          tessjs_create_tsv: '0',
          preserve_interword_spaces: '1',
          tessjs_image_rectangle_left: '0',
          tessjs_image_rectangle_top: '0',
          tessjs_image_rectangle_width: '0',
          tessjs_image_rectangle_height: '0'
        }
      );

      // Store the raw OCR text for debugging
      setOcrText(result.data.text);
      console.log("OCR Text:", result.data.text);

      // Extract data from the OCR result - directly call the function
      const extractionResult = extractBBVADirectDebitData(result.data.text);
      
      console.log("Extraction Result:", extractionResult);
      
      setExtractedData(extractionResult.data);
      setMissingFields(extractionResult.missingFields);
      setProgress(100);

      // Show warning if there are missing fields
      if (extractionResult.missingFields.length > 0) {
        setError(`Warning: Some fields could not be detected: ${extractionResult.missingFields.join(', ')}. Please verify and complete manually.`);
      }

    } catch (err) {
      console.error('Error processing file:', err);
      setError(`Error processing file: ${err.message}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveInvoice = async () => {
    if (!extractedData || !file) {
      setError('No data to save. Please process a receipt first.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `receipts/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save data to Firestore
      const docRef = await addDoc(collection(db, 'receipts'), {
        ...extractedData,
        fileUrl: downloadURL,
        fileName: file.name,
        fileType: file.type,
        createdAt: serverTimestamp(),
        status: 'pending',
        missingFields: missingFields.length > 0 ? missingFields : [],
        rawOcrText: ocrText // Save the raw OCR text for debugging
      });

      // Clear form
      setFile(null);
      setPreview(null);
      setExtractedData(null);
      setProgress(0);
      setImageQuality(null);
      setOcrText('');
      setMissingFields([]);

      alert('Receipt saved successfully!');
    } catch (err) {
      console.error('Error saving receipt:', err);
      setError('Error saving receipt. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to get field hint based on field name
  const getFieldHint = (fieldName) => {
    const hints = {
      acreedor: 'Name of the creditor entity',
      idAcreedor: 'Creditor ID code (Format: ESxxxxx)',
      refMandato: 'Mandate reference number',
      vencimiento: 'Due date (DD-MM-YYYY)',
      refAdeudo: 'Direct debit reference',
      deudor: 'Debtor full name',
      concepto: 'Charge description',
      importeTotal: 'Total amount to pay',
      numAdeudo: 'Debit number',
      titular: 'Account holder name',
      oficina: 'Bank office',
      fecha: 'Transaction date',
      iban: 'Bank account number (IBAN)',
      cargo: 'Charge type',
    };
    return hints[fieldName] || '';
  };

  // Helper function to check if a field is missing
  const isFieldMissing = (fieldName) => {
    // Convert fieldName to match format in missingFields
    const fieldMapping = {
      'acreedor': 'Creditor',
      'idAcreedor': 'Creditor ID',
      'refMandato': 'Mandate Reference',
      'vencimiento': 'Due Date',
      'refAdeudo': 'Debit Reference',
      'deudor': 'Debtor',
      'importeTotal': 'Total Amount',
      'iban': 'IBAN'
    };
    
    return missingFields.includes(fieldMapping[fieldName] || '');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">BBVA Direct Debit Scanner</h1>
      
      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="space-y-4">
            <img src={preview} alt="Preview" className="max-h-64 mx-auto" />
            <p className="text-sm text-gray-600">{file.name}</p>
            {imageQuality && (
              <div className={`text-sm mt-2 ${
                imageQuality.score < 50 ? 'text-red-500' : 
                imageQuality.score < 70 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {imageQuality.message}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-600">
              Drag and drop a receipt image here, or click to select
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: JPEG, PNG
            </p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Processing: {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={`border px-4 py-3 rounded mb-6 ${
          error.startsWith('Warning:') ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          {error}
        </div>
      )}

      {/* OCR Text Toggle */}
      {ocrText && (
        <div className="mb-4">
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {showRawText ? 'Hide OCR text' : 'Show OCR text (for debugging)'}
          </button>
          
          {showRawText && (
            <div className="mt-2 p-4 bg-gray-100 rounded text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
              {ocrText}
            </div>
          )}
        </div>
      )}

      {/* Extracted Data Display */}
      {extractedData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Extracted Data</h2>
          <div className="bg-white shadow rounded-lg p-6">
            {/* Show summary of missing fields */}
            {missingFields.length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="text-sm font-medium text-yellow-800">Missing Fields</h3>
                <ul className="mt-1 text-xs text-yellow-700 list-disc pl-5">
                  {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Show all fields, including those with empty values */}
              {Object.keys({
                cargo: '',
                acreedor: '',
                idAcreedor: '',
                refMandato: '',
                vencimiento: '',
                refAdeudo: '',
                deudor: '',
                concepto: '',
                importeTotal: '',
                numAdeudo: '',
                titular: '',
                oficina: '',
                fecha: '',
                iban: ''
              }).map((key) => {
                const value = extractedData[key] || '';
                const isMissing = isFieldMissing(key);
                
                return (
                  <div key={key} className="space-y-1">
                    <label className={`block text-sm font-medium ${isMissing ? 'text-red-500' : 'text-gray-500'}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                      {isMissing && ' *'}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        setExtractedData({
                          ...extractedData,
                          [key]: e.target.value
                        });
                        
                        // Remove from missing fields if user edits
                        if (e.target.value && isMissing) {
                          const fieldMapping = {
                            'acreedor': 'Creditor',
                            'idAcreedor': 'Creditor ID',
                            'refMandato': 'Mandate Reference',
                            'vencimiento': 'Due Date',
                            'refAdeudo': 'Debit Reference',
                            'deudor': 'Debtor',
                            'importeTotal': 'Total Amount',
                            'iban': 'IBAN'
                          };
                          
                          setMissingFields(missingFields.filter(field => 
                            field !== fieldMapping[key]
                          ));
                        }
                      }}
                      className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                        ${isMissing ? 'border-red-300 bg-red-50' : value ? 'border-gray-300' : 'border-gray-200 bg-gray-50'}`}
                      placeholder={`Enter ${key}`}
                      title={getFieldHint(key)}
                    />
                    {getFieldHint(key) && (
                      <p className="text-xs text-gray-400">{getFieldHint(key)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-x-4 mt-6">
        <button
          onClick={processFile}
          disabled={!file || isProcessing || isSaving}
          className={`px-4 py-2 rounded ${
            !file || isProcessing || isSaving
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Process Receipt'}
        </button>

        <button
          onClick={saveInvoice}
          disabled={!extractedData || isProcessing || isSaving}
          className={`px-4 py-2 rounded ${
            !extractedData || isProcessing || isSaving
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Receipt'}
        </button>
      </div>

      {/* Tips */}
      {!extractedData && !isProcessing && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800">Tips for better results:</h3>
          <ul className="mt-2 text-sm text-blue-700 list-disc pl-5">
            <li>Make sure the image has good lighting and is well-focused</li>
            <li>Avoid shadows or reflections on the document</li>
            <li>Capture the entire receipt in the image, without cutting off edges</li>
            <li>Use a high resolution (at least 1000x1000 pixels)</li>
            <li>Ensure that text is clearly legible</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InvoiceScanner;