import React, { useState } from 'react';

const InvoiceCreator = () => {
  // Helper function to format date as YYYY-MM-DD for input[type="date"]
  function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // State for form data
  const [formData, setFormData] = useState({
    invoiceNumber: 'INV-2025-001',
    date: formatDate(new Date()),
    dueDate: formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
    customerName: '',
    customerAddress: '',
    customerNif: '',
    items: [{ description: '', quantity: 1, unitPrice: '', amount: '' }],
    notes: '',
    subtotal: '0.00',
    vatRate: '21',
    vatAmount: '0.00',
    totalAmount: '0.00'
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Recalculate totals if necessary
    if (name === 'vatRate') {
      recalculateTotals({ ...formData, vatRate: value });
    }
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    // Calculate amount if quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? Number(value) : Number(updatedItems[index].quantity);
      const unitPrice = field === 'unitPrice' ? Number(value) : Number(updatedItems[index].unitPrice);
      updatedItems[index].amount = (quantity * unitPrice).toFixed(2);
    }
    
    const updatedFormData = { ...formData, items: updatedItems };
    setFormData(updatedFormData);
    recalculateTotals(updatedFormData);
  };

  // Add new item row
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: '', amount: '' }]
    });
  };

  // Remove item row
  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const updatedFormData = { ...formData, items: updatedItems };
    setFormData(updatedFormData);
    recalculateTotals(updatedFormData);
  };

  // Recalculate totals
  const recalculateTotals = (data) => {
    const subtotal = data.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toFixed(2);
    const vatAmount = ((Number(subtotal) * Number(data.vatRate)) / 100).toFixed(2);
    const totalAmount = (Number(subtotal) + Number(vatAmount)).toFixed(2);
    
    setFormData({
      ...data,
      subtotal,
      vatAmount,
      totalAmount
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Invoice created successfully!');
    // In a real app, you would save the invoice data to Firebase here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Create Invoice</h1>
        <div className="text-sm text-gray-500">
          Spanish tax regulation compliant
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Info Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800">Invoice Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Invoice #</label>
                  <input 
                    type="text" 
                    name="invoiceNumber" 
                    value={formData.invoiceNumber} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input 
                  type="date" 
                  name="dueDate" 
                  value={formData.dueDate} 
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div className="pt-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-gray-600">Spanish tax compliant invoice</p>
                </div>
              </div>
            </div>
            
            {/* Customer Info Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-800">Customer Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer/Company Name</label>
                <input 
                  type="text" 
                  name="customerName" 
                  value={formData.customerName} 
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea 
                  name="customerAddress" 
                  value={formData.customerAddress} 
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">NIF/CIF</label>
                <input 
                  type="text" 
                  name="customerNif" 
                  value={formData.customerNif} 
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., B12345678"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Invoice Items Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="text" 
                        value={item.description} 
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="block w-full border-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Item description"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="number" 
                        value={item.quantity} 
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="block w-20 border-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        min="1"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="number" 
                        value={item.unitPrice} 
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className="block w-28 border-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="text" 
                        value={item.amount} 
                        readOnly
                        className="block w-28 border-none bg-gray-50 text-gray-500 sm:text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button 
            type="button" 
            onClick={addItem}
            className="mt-4 inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
          >
            + Add Item
          </button>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Payment terms, delivery information, etc."
              ></textarea>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">€{formData.subtotal}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-2">VAT (IVA)</span>
                  <select 
                    name="vatRate"
                    value={formData.vatRate}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="21">21%</option>
                    <option value="10">10%</option>
                    <option value="4">4%</option>
                    <option value="0">0%</option>
                  </select>
                </div>
                <span className="text-sm font-medium text-gray-900">€{formData.vatAmount}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-base font-bold text-gray-900">€{formData.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceCreator;