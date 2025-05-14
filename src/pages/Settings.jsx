import React, { useState } from 'react';

const Settings = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    companyName: 'Your Company Name',
    companyAddress: 'Calle Ejemplo 123, 28001 Madrid, España',
    companyCif: 'A12345678',
    companyEmail: 'info@yourcompany.com',
    companyPhone: '+34 91 123 4567',
    invoicePrefix: 'INV-',
    nextInvoiceNumber: '2025-046',
    defaultVatRate: '21',
    defaultPaymentTerms: '30',
    googleDriveConnected: true,
    googleDriveFolder: 'Invoices',
    useSubfolders: true,
    folderOrganization: 'yearMonth'
  });
  
  // State for handling section visibility
  const [activeSections, setActiveSections] = useState({
    company: true,
    invoices: true,
    googleDrive: true,
    export: true
  });
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Toggle section visibility
  const toggleSection = (section) => {
    setActiveSections({
      ...activeSections,
      [section]: !activeSections[section]
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save the settings to Firebase
    alert('Settings saved successfully!');
  };
  
  // Handle Google Drive connection
  const handleConnectGoogleDrive = () => {
    if (formData.googleDriveConnected) {
      // Disconnect logic would go here
      setFormData({
        ...formData,
        googleDriveConnected: false
      });
    } else {
      // In a real app, this would authenticate with Google Drive
      // For now, just simulate a successful connection
      setFormData({
        ...formData,
        googleDriveConnected: true
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button 
          onClick={handleSubmit}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div 
            className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('company')}
          >
            <h2 className="text-lg font-medium text-gray-800">Company Information</h2>
            <svg 
              className={`w-5 h-5 text-gray-500 transform ${activeSections.company ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {activeSections.company && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea 
                  name="companyAddress" 
                  value={formData.companyAddress} 
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">CIF/NIF</label>
                  <input 
                    type="text" 
                    name="companyCif" 
                    value={formData.companyCif} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    name="companyEmail" 
                    value={formData.companyEmail} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input 
                    type="text" 
                    name="companyPhone" 
                    value={formData.companyPhone} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-600">These details will appear on your invoices</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Invoice Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div 
            className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('invoices')}
          >
            <h2 className="text-lg font-medium text-gray-800">Invoice Settings</h2>
            <svg 
              className={`w-5 h-5 text-gray-500 transform ${activeSections.invoices ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {activeSections.invoices && (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice Number Prefix</label>
                  <input 
                    type="text" 
                    name="invoicePrefix" 
                    value={formData.invoicePrefix} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Next Invoice Number</label>
                  <input 
                    type="text" 
                    name="nextInvoiceNumber" 
                    value={formData.nextInvoiceNumber} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default VAT Rate (%)</label>
                  <select 
                    name="defaultVatRate" 
                    value={formData.defaultVatRate} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="21">21%</option>
                    <option value="10">10%</option>
                    <option value="4">4%</option>
                    <option value="0">0%</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Default Payment Terms (days)</label>
                  <input 
                    type="number" 
                    name="defaultPaymentTerms" 
                    value={formData.defaultPaymentTerms} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-2 text-sm text-gray-600">Spanish tax regulations require consecutive invoice numbering</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Google Drive Integration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div 
            className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection('googleDrive')}
          >
            <h2 className="text-lg font-medium text-gray-800">Google Drive Integration</h2>
            <svg 
              className={`w-5 h-5 text-gray-500 transform ${activeSections.googleDrive ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {activeSections.googleDrive && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                      <path fill="white" d="M12 17l5-5h-3V8h-4v4H7l5 5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Google Drive</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.googleDriveConnected 
                        ? 'Your account is connected' 
                        : 'Connect to automatically save invoices'}
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={handleConnectGoogleDrive}
                  className={`px-4 py-2 border rounded-md text-sm font-medium ${
                    formData.googleDriveConnected
                      ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      : 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {formData.googleDriveConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
              
              {formData.googleDriveConnected && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Google Drive Folder</label>
                    <input 
                      type="text" 
                      name="googleDriveFolder" 
                      value={formData.googleDriveFolder} 
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="useSubfolders" 
                        name="useSubfolders" 
                        checked={formData.useSubfolders} 
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="useSubfolders" className="ml-2 block text-sm text-gray-700">
                        Organize invoices in subfolders
                      </label>
                    </div>
                  </div>
                  
                  {formData.useSubfolders && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Folder Organization</label>
                      <select 
                        name="folderOrganization" 
                        value={formData.folderOrganization} 
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="yearMonth">Year/Month (e.g., 2025/05)</option>
                        <option value="yearQuarter">Year/Quarter (e.g., 2025/Q2)</option>
                        <option value="customerName">Customer Name</option>
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Settings;