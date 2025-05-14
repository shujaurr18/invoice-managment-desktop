import React, { useState } from 'react';

const ExportScreen = () => {
  // State for export options
  const [exportOptions, setExportOptions] = useState({
    dateRange: 'currentMonth',
    customStartDate: '',
    customEndDate: '',
    status: 'all',
    format: 'excel',
    includeItems: true,
    includeTaxData: true,
    includeCustomerDetails: true,
    groupBy: 'none'
  });
  
  // State for showing preview
  const [showPreview, setShowPreview] = useState(false);
  
  // Dummy data for invoices
  const dummyInvoices = [
    { id: 'INV-2025-045', customer: 'Restaurante Valencia', date: '12/05/2025', amount: '1,240.00', status: 'paid' },
    { id: 'INV-2025-044', customer: 'Clínica Barcelona', date: '10/05/2025', amount: '2,135.50', status: 'paid' },
    { id: 'INV-2025-043', customer: 'Tienda Málaga', date: '09/05/2025', amount: '378.90', status: 'pending' },
    { id: 'INV-2025-042', customer: 'Hotel Madrid', date: '08/05/2025', amount: '1,950.75', status: 'paid' },
    { id: 'INV-2025-041', customer: 'Oficina Sevilla', date: '05/05/2025', amount: '648.20', status: 'pending' }
  ];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExportOptions({
      ...exportOptions,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  // Handle export action
  const handleExport = () => {
    alert('Data exported successfully!');
    // In a real app, this would generate and download the Excel file
  };
  
  // Format date ranges for display
  const getDateRangeText = () => {
    switch (exportOptions.dateRange) {
      case 'currentMonth':
        return 'Current Month (May 2025)';
      case 'previousMonth':
        return 'Previous Month (April 2025)';
      case 'currentQuarter':
        return 'Current Quarter (Q2 2025)';
      case 'previousQuarter':
        return 'Previous Quarter (Q1 2025)';
      case 'currentYear':
        return 'Current Year (2025)';
      case 'previousYear':
        return 'Previous Year (2024)';
      case 'custom':
        return `${exportOptions.customStartDate} to ${exportOptions.customEndDate}`;
      default:
        return 'All Time';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Export Data</h1>
        <div className="text-sm text-gray-500">
          Generate reports for tax filing and analysis
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export Options */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Export Options</h2>
            
            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select 
                name="dateRange" 
                value={exportOptions.dateRange} 
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="currentMonth">Current Month</option>
                <option value="previousMonth">Previous Month</option>
                <option value="currentQuarter">Current Quarter</option>
                <option value="previousQuarter">Previous Quarter</option>
                <option value="currentYear">Current Year</option>
                <option value="previousYear">Previous Year</option>
                <option value="custom">Custom Range</option>
                <option value="allTime">All Time</option>
              </select>
              
              {exportOptions.dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input 
                      type="date" 
                      name="customStartDate" 
                      value={exportOptions.customStartDate} 
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input 
                      type="date" 
                      name="customEndDate" 
                      value={exportOptions.customEndDate} 
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Invoice Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Status</label>
              <select 
                name="status" 
                value={exportOptions.status} 
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid Only</option>
                <option value="pending">Pending Only</option>
                <option value="overdue">Overdue Only</option>
              </select>
            </div>
            
            {/* Export Format */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="formatExcel" 
                    name="format" 
                    value="excel" 
                    checked={exportOptions.format === 'excel'} 
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="formatExcel" className="ml-2 block text-sm text-gray-700">
                    Excel (.xlsx)
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="formatCsv" 
                    name="format" 
                    value="csv" 
                    checked={exportOptions.format === 'csv'} 
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="formatCsv" className="ml-2 block text-sm text-gray-700">
                    CSV
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id="formatPdf" 
                    name="format" 
                    value="pdf" 
                    checked={exportOptions.format === 'pdf'} 
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="formatPdf" className="ml-2 block text-sm text-gray-700">
                    PDF
                  </label>
                </div>
              </div>
            </div>
            
            {/* Data to Include */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Data to Include</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="includeItems" 
                    name="includeItems" 
                    checked={exportOptions.includeItems} 
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeItems" className="ml-2 block text-sm text-gray-700">
                    Include invoice line items
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="includeTaxData" 
                    name="includeTaxData" 
                    checked={exportOptions.includeTaxData} 
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeTaxData" className="ml-2 block text-sm text-gray-700">
                    Include detailed tax data (VAT rates and amounts)
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="includeCustomerDetails" 
                    name="includeCustomerDetails" 
                    checked={exportOptions.includeCustomerDetails} 
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeCustomerDetails" className="ml-2 block text-sm text-gray-700">
                    Include customer details (name, address, NIF/CIF)
                  </label>
                </div>
              </div>
            </div>
            
            {/* Grouping Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
              <select 
                name="groupBy" 
                value={exportOptions.groupBy} 
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="none">No Grouping</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="customer">Customer</option>
                <option value="vatRate">VAT Rate</option>
              </select>
            </div>
          </div>
          
          {/* Spanish Tax Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Spanish Tax Compliance</h2>
            <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="mr-4 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Tax Reporting Ready</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Exported data will include all necessary fields for Spanish tax authorities (Agencia Tributaria)
                </p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>The exported data will include:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Properly formatted invoice numbers</li>
                <li>VAT (IVA) breakdown by rate categories</li>
                <li>Customer tax identification numbers (NIF/CIF)</li>
                <li>Quarterly and annual summaries for tax reporting</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Export Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Export Summary</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date Range</h3>
                <p className="mt-1 text-sm text-gray-900">{getDateRangeText()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Invoice Status</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {exportOptions.status === 'all' ? 'All Statuses' : 
                   `${exportOptions.status.charAt(0).toUpperCase() + exportOptions.status.slice(1)} Only`}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Format</h3>
                <p className="mt-1 text-sm text-gray-900">{exportOptions.format.toUpperCase()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Included Data</h3>
                <ul className="mt-1 text-sm text-gray-900 space-y-1">
                  {exportOptions.includeItems && <li>Line Items</li>}
                  {exportOptions.includeTaxData && <li>Tax Data</li>}
                  {exportOptions.includeCustomerDetails && <li>Customer Details</li>}
                </ul>
              </div>
              
              {exportOptions.groupBy !== 'none' && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Grouping</h3>
                  <p className="mt-1 text-sm text-gray-900">Grouped by {exportOptions.groupBy}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <button 
                  type="button"
                  onClick={togglePreview}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-3"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                
                <button 
                  type="button"
                  onClick={handleExport}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Preview */}
      {showPreview && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Data Preview</h2>
            <p className="text-sm text-gray-500 mt-1">
              Preview of the data that will be exported (showing first 5 records)
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 border-t border-gray-200 text-center text-sm text-gray-500">
            Showing 5 of 15 records
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportScreen;