import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InvoiceList = () => {
  // State for filtering and pagination
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 10;
  
  // Dummy data for invoices
  const dummyInvoices = [
    { id: 'INV-2025-045', customer: 'Restaurante Valencia', date: '12/05/2025', amount: '1,240.00', status: 'paid' },
    { id: 'INV-2025-044', customer: 'Clínica Barcelona', date: '10/05/2025', amount: '2,135.50', status: 'paid' },
    { id: 'INV-2025-043', customer: 'Tienda Málaga', date: '09/05/2025', amount: '378.90', status: 'pending' },
    { id: 'INV-2025-042', customer: 'Hotel Madrid', date: '08/05/2025', amount: '1,950.75', status: 'paid' },
    { id: 'INV-2025-041', customer: 'Oficina Sevilla', date: '05/05/2025', amount: '648.20', status: 'pending' },
    { id: 'INV-2025-040', customer: 'Café Bilbao', date: '02/05/2025', amount: '320.25', status: 'overdue' },
    { id: 'INV-2025-039', customer: 'Taller Zaragoza', date: '30/04/2025', amount: '890.00', status: 'paid' },
    { id: 'INV-2025-038', customer: 'Farmacia Toledo', date: '28/04/2025', amount: '540.00', status: 'paid' },
    { id: 'INV-2025-037', customer: 'Gimnasio Vigo', date: '25/04/2025', amount: '750.30', status: 'pending' },
    { id: 'INV-2025-036', customer: 'Librería Granada', date: '22/04/2025', amount: '189.50', status: 'overdue' },
    { id: 'INV-2025-035', customer: 'Supermercado Alicante', date: '20/04/2025', amount: '1,450.75', status: 'paid' },
    { id: 'INV-2025-034', customer: 'Bar Salamanca', date: '18/04/2025', amount: '275.40', status: 'pending' },
    { id: 'INV-2025-033', customer: 'Consultora Murcia', date: '15/04/2025', amount: '3,200.00', status: 'paid' },
    { id: 'INV-2025-032', customer: 'Escuela Valladolid', date: '12/04/2025', amount: '860.25', status: 'paid' },
    { id: 'INV-2025-031', customer: 'Peluquería Pamplona', date: '10/04/2025', amount: '125.75', status: 'overdue' },
  ];
  
  // Filter invoices based on status and search query
  const filteredInvoices = dummyInvoices.filter(invoice => {
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesSearch = invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  // Pagination logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);
  
  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <Link 
          to="/create" 
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          Create New Invoice
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
            <div className="flex space-x-2">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filterStatus === 'all' 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterStatus('paid')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filterStatus === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Paid
              </button>
              <button 
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filterStatus === 'pending' 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilterStatus('overdue')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  filterStatus === 'overdue' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Overdue
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Invoice Table */}
        <div className="overflow-x-auto">
          {currentInvoices.length > 0 ? (
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
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      <Link to={`/invoices/${invoice.id}`}>
                        {invoice.id}
                      </Link>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link to={`/invoices/${invoice.id}`} className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>
                        <button className="text-gray-600 hover:text-gray-900">
                          Download
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {filteredInvoices.length > invoicesPerPage && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <div className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;