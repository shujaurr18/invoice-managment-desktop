import React, { useState } from 'react';

const InvoiceScanner = () => {
  // State for tracking the upload and processing
  const [uploadState, setUploadState] = useState('initial'); // initial, uploading, processing, completed
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  
  // Extracted invoice data (dummy data)
  const [extractedData, setExtractedData] = useState({
    invoiceNumber: '',
    date: '',
    vendor: '',
    nifCif: '',
    items: [],
    subtotal: '',
    vat: '',
    vatRate: '',
    total: ''
  });
  
  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Simulate upload progress
      setUploadState('uploading');
      simulateUploadProgress();
    }
  };
  
  // Simulate upload progress
  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploadState('processing');
        setTimeout(() => {
          setUploadState('completed');
          // Set dummy extracted data
          setExtractedData({
            invoiceNumber: 'F-2025-1234',
            date: '05/05/2025',
            vendor: 'Suministros Madrid S.L.',
            nifCif: 'B12345678',
            items: [
              { description: 'Office Supplies', quantity: 10, unitPrice: '12.50', amount: '125.00' },
              { description: 'Software License', quantity: 1, unitPrice: '299.00', amount: '299.00' }
            ],
            subtotal: '424.00',
            vatRate: '21%',
            vat: '89.04',
            total: '513.04'
          });
        }, 2000);
      }
    }, 100);
  };
  
  // Handle saving the extracted data
  const handleSaveInvoice = () => {
    alert('Invoice data saved successfully!');
    resetForm();
  };
  
  // Reset the form
  const resetForm = () => {
    setFile(null);
    setUploadState('initial');
    setProgress(0);
    setExtractedData({
      invoiceNumber: '',
      date: '',
      vendor: '',
      nifCif: '',
      items: [],
      subtotal: '',
      vat: '',
      vatRate: '',
      total: ''
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Scan Invoice</h1>
        <div className="text-sm text-gray-500">
          Extract data automatically from PDFs and images
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Step 1: File Upload Section (shown when in initial state) */}
        {uploadState === 'initial' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-800">Upload Invoice</h2>
            <p className="text-gray-600">Select a PDF or image file containing the invoice.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <input
                type="file"
                id="invoice-file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
              <div className="space-y-4">
                <div className="flex justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <p className="text-sm text-gray-500">Drag and drop your invoice here, or</p>
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                  onClick={() => document.getElementById('invoice-file').click()}
                >
                  Browse Files
                </button>
                <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Progress Indicators */}
        {(uploadState === 'uploading' || uploadState === 'processing') && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-800">
              {uploadState === 'uploading' ? 'Uploading File...' : 'Processing Invoice...'}
            </h2>
            
            {file && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {uploadState === 'uploading' ? 'Uploading...' : 'Extracting data...'}
                </span>
                <span className="text-gray-700 font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {uploadState === 'processing' && (
                <p className="text-sm text-gray-500 italic">
                  Using AI to identify invoice elements. This may take a moment...
                </p>
              )}
            </div>
            
            <button 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        )}
        
        {/* Step 3: Extracted Data (shown when completed) */}
        {uploadState === 'completed' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">Extracted Invoice Data</h2>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                Data extracted successfully
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                  <input 
                    type="text" 
                    value={extractedData.invoiceNumber} 
                    onChange={(e) => setExtractedData({...extractedData, invoiceNumber: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input 
                    type="text" 
                    value={extractedData.date} 
                    onChange={(e) => setExtractedData({...extractedData, date: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vendor/Supplier</label>
                  <input 
                    type="text" 
                    value={extractedData.vendor} 
                    onChange={(e) => setExtractedData({...extractedData, vendor: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">NIF/CIF</label>
                  <input 
                    type="text" 
                    value={extractedData.nifCif} 
                    onChange={(e) => setExtractedData({...extractedData, nifCif: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-800">Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {extractedData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          €{item.unitPrice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          €{item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subtotal</label>
                  <input 
                    type="text" 
                    value={extractedData.subtotal} 
                    onChange={(e) => setExtractedData({...extractedData, subtotal: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">VAT Rate</label>
                  <input 
                    type="text" 
                    value={extractedData.vatRate} 
                    onChange={(e) => setExtractedData({...extractedData, vatRate: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">VAT Amount</label>
                  <input 
                    type="text" 
                    value={extractedData.vat} 
                    onChange={(e) => setExtractedData({...extractedData, vat: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <input 
                    type="text" 
                    value={extractedData.total} 
                    onChange={(e) => setExtractedData({...extractedData, total: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
                onClick={handleSaveInvoice}
              >
                Save Invoice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceScanner;