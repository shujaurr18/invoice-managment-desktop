import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const InvoiceDetails = () => {
  const { id } = useParams();
  
  // State for managing payment status updates
  const [status, setStatus] = useState('pending');
  
  // Dummy invoice data (in a real app, this would be fetched from Firebase based on the id)
  const invoiceData = {
    id: id || 'INV-2025-042',
    number: 'F-2025-1234',
    date: '05/05/2025',
    dueDate: '04/06/2025',
    customer: {
      name: 'Hotel Madrid',
      address: 'Calle Gran Vía 28, 28013 Madrid, España',
      nif: 'B87654321'
    },
    items: [
      { description: 'Web Design Services', quantity: 1, unitPrice: '1,200.00', amount: '1,200.00' },
      { description: 'Hosting Plan (Annual)', quantity: 1, unitPrice: '240.00', amount: '240.00' },
      { description: 'Content Management System', quantity: 1, unitPrice: '300.00', amount: '300.00' },
      { description: 'Technical Support (10 hours)', quantity: 10, unitPrice: '45.00', amount: '450.00' }
    ],
    subtotal: '2,190.00',
    vatRate: '21%',
    vatAmount: '459.90',
    totalAmount: '2,649.90',
    status: 'pending',
    notes: 'Payment due within 30 days. Please include the invoice number with your payment.'
  };
  
  // Handle status change
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    // In a real app, this would update the status in Firebase
  };
  
  // Get badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Invoice #{invoiceData.number}</h1>
          <p className="text-sm text-gray-500">
            Created on {invoiceData.date}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to="/invoices" 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to List
          </Link>
          <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Download PDF
          </button>
        </div>
      </div>
      
      {/* Invoice Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Status Bar */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <div className="flex space-x-2">
            <div className="relative inline-block text-left">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Change Status
              </button>
              <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10 hidden">
                <div className="py-1">
                  <button 
                    onClick={() => handleStatusChange('paid')}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    Mark as Paid
                  </button>
                  <button 
                    onClick={() => handleStatusChange('pending')}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    Mark as Pending
                  </button>
                  <button 
                    onClick={() => handleStatusChange('overdue')}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    Mark as Overdue
                  </button>
                  <button 
                    onClick={() => handleStatusChange('cancelled')}
                    className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    Mark as Cancelled
                  </button>
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Send by Email
            </button>
          </div>
        </div>
        
        {/* Invoice Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Company & Customer Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">From</h2>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Your Company Name</p>
                <p className="text-gray-700">Calle Ejemplo 123</p>
                <p className="text-gray-700">28001 Madrid, España</p>
                <p className="text-gray-700">CIF: A12345678</p>
                <p className="text-gray-700">info@yourcompany.com</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">To</h2>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{invoiceData.customer.name}</p>
                <p className="text-gray-700">{invoiceData.customer.address}</p>
                <p className="text-gray-700">NIF/CIF: {invoiceData.customer.nif}</p>
              </div>
            </div>
            
            {/* Invoice Summary */}
            <div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-500">Invoice Number</p>
                    <p className="text-gray-900">{invoiceData.number}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Invoice Date</p>
                    <p className="text-gray-900">{invoiceData.date}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Due Date</p>
                    <p className="text-gray-900">{invoiceData.dueDate}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Total Amount</p>
                    <p className="text-gray-900 font-bold">€{invoiceData.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Invoice Items</h2>
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
                      Unit Price (€)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount (€)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.unitPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Totals & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Notes</h2>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                {invoiceData.notes}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">€{invoiceData.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">VAT ({invoiceData.vatRate})</span>
                    <span className="text-gray-900">€{invoiceData.vatAmount}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">€{invoiceData.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 text-center text-sm text-gray-500">
          This invoice was created with Invoice Manager. It is valid without a signature.
        </div>
      </div>
      
      {/* Google Drive Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Google Drive Storage</h2>
        <div className="flex items-center">
          <div className="mr-4 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">Invoice PDF saved to Google Drive</h3>
            <p className="text-sm text-gray-500 mt-1">Folder: Invoices/2025/May</p>
          </div>
          <button className="ml-auto bg-indigo-50 text-indigo-700 rounded-md py-2 px-4 text-sm font-medium hover:bg-indigo-100">
            View in Google Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;