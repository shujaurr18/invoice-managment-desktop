import React from 'react';

const Dashboard = () => {
  // Dummy data for dashboard
  const stats = [
    { label: 'Total Invoices', value: 124, change: '+12%', icon: '📄' },
    { label: 'Pending Payment', value: 18, change: '-5%', icon: '⏱️' },
    { label: 'This Month', value: '€4,560', change: '+8%', icon: '📅' },
    { label: 'VAT Collected', value: '€912', change: '+8%', icon: '💰' },
  ];
  
  const recentInvoices = [
    { id: 'INV-2025-042', customer: 'Restaurante Valencia', date: '10/05/2025', amount: '€1,240.00', status: 'Paid' },
    { id: 'INV-2025-041', customer: 'Tienda Barcelona', date: '08/05/2025', amount: '€860.50', status: 'Pending' },
    { id: 'INV-2025-040', customer: 'Hotel Madrid', date: '05/05/2025', amount: '€2,450.75', status: 'Paid' },
    { id: 'INV-2025-039', customer: 'Café Sevilla', date: '01/05/2025', amount: '€320.25', status: 'Overdue' },
    { id: 'INV-2025-038', customer: 'Farmacia Toledo', date: '28/04/2025', amount: '€540.00', status: 'Paid' },
  ];
  
  // Function to determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: Today at 10:45 AM
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className={`mt-2 text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>
      
      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Recent Invoices</h2>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
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
              {recentInvoices.map((invoice, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {invoice.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Export</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Upcoming Taxes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Upcoming Tax Deadlines</h2>
        <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="mr-4 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600">
            📅
          </div>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Quarterly VAT (IVA) Return</h3>
            <p className="text-sm text-yellow-700 mt-1">Due in 15 days (May 20, 2025)</p>
          </div>
          <button className="ml-auto bg-white border border-yellow-300 rounded-md py-1 px-3 text-sm text-yellow-700 hover:bg-yellow-50">
            Prepare Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;