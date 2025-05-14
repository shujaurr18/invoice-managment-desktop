import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { extractInvoiceData } from '../../helpers/invoiceExtraction';

const Scanner = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });
  
  const processFile = async () => {
    if (!file) return;
    
    setScanning(true);
    setProgress(0);
    
    try {
      // If PDF, we would need to convert to image first
      // For simplicity, handling just images here
      const result = await Tesseract.recognize(
        file,
        'spa', // Spanish language
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(parseInt(m.progress * 100));
            }
          }
        }
      );
      
      // Extract structured data using regex patterns
      const data = extractInvoiceData(result.data.text);
      setExtractedData(data);
      
    } catch (error) {
      console.error("Error processing document:", error);
      alert("Error processing document. Please try again.");
    } finally {
      setScanning(false);
    }
  };
  
  const saveInvoice = async () => {
    if (!extractedData || !file) return;
    
    try {
      // Upload file to storage
      const storageRef = ref(storage, `invoices/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);
      
      // Save to Firestore
      await addDoc(collection(db, "invoices"), {
        ...extractedData,
        fileUrl,
        createdAt: serverTimestamp(),
        status: "pending" // Initial status
      });
      
      alert("Invoice saved successfully!");
      // Reset form
      setFile(null);
      setPreviewUrl('');
      setExtractedData(null);
      
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Error saving invoice. Please try again.");
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Scan Invoice</h2>
      
      {!file ? (
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50">
          <input {...getInputProps()} />
          <p className="text-gray-500">Drag and drop an invoice image or PDF here, or click to select a file</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Preview */}
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Document Preview</h3>
              <div className="border rounded-lg overflow-hidden h-80 bg-gray-100">
                {previewUrl && (
                  <img 
                    src={previewUrl} 
                    alt="Invoice preview" 
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              {!scanning && !extractedData && (
                <button
                  onClick={processFile}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Process Document
                </button>
              )}
              
              {scanning && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2">Processing... {progress}%</p>
                </div>
              )}
            </div>
            
            {/* Extracted Data */}
            {extractedData && (
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Extracted Data</h3>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                      <input 
                        type="text" 
                        value={extractedData.invoiceNumber || ''} 
                        onChange={e => setExtractedData({...extractedData, invoiceNumber: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input 
                        type="text" 
                        value={extractedData.date || ''} 
                        onChange={e => setExtractedData({...extractedData, date: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vendor</label>
                      <input 
                        type="text" 
                        value={extractedData.vendor || ''} 
                        onChange={e => setExtractedData({...extractedData, vendor: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <input 
                        type="text" 
                        value={extractedData.total || ''} 
                        onChange={e => setExtractedData({...extractedData, total: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">VAT Amount</label>
                      <input 
                        type="text" 
                        value={extractedData.vat || ''} 
                        onChange={e => setExtractedData({...extractedData, vat: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={saveInvoice}
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Save Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Reset button */}
          {!scanning && (
            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl('');
                setExtractedData(null);
              }}
              className="text-gray-600 underline"
            >
              Cancel and upload a different file
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Scanner;