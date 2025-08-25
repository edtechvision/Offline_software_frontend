import React from 'react';
import { FaUpload, FaMoneyBillWave, FaCalendarAlt, FaBuilding, FaChartLine } from 'react-icons/fa';

const ExpensesPage = () => {
  const expensesData = [
    { id: 1, center: 'Main Center', category: 'Utilities', amount: '₹15,000', date: '2025-08-19', status: 'Approved' },
    { id: 2, center: 'Branch Center', category: 'Maintenance', amount: '₹8,500', date: '2025-08-18', status: 'Pending' },
    { id: 3, center: 'Main Center', category: 'Supplies', amount: '₹12,300', date: '2025-08-17', status: 'Approved' },
    { id: 4, center: 'Branch Center', category: 'Equipment', amount: '₹25,000', date: '2025-08-16', status: 'Rejected' },
    { id: 5, center: 'Main Center', category: 'Marketing', amount: '₹18,700', date: '2025-08-15', status: 'Approved' },
  ];

  const categories = ['Utilities', 'Maintenance', 'Supplies', 'Equipment', 'Marketing', 'Staff', 'Other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Center Expenses Management</h1>
            <p className="text-emerald-100">Upload and manage center expenses across all locations</p>
          </div>
          <FaMoneyBillWave className="text-5xl text-emerald-200" />
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaUpload className="mr-2 text-emerald-600" />
          Upload New Expense
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option>Select Center</option>
              <option>Main Center</option>
              <option>Branch Center</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option>Select Category</option>
              {categories.map(category => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input 
              type="number" 
              placeholder="₹0.00" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea 
            rows="3" 
            placeholder="Enter expense description..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        
        <div className="mt-6 flex space-x-3">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center">
            <FaUpload className="mr-2" />
            Upload Expense
          </button>
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Clear Form
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaChartLine className="mr-2 text-emerald-600" />
            Recent Expenses
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expensesData.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaBuilding className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{expense.center}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{expense.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{expense.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{expense.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      expense.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      expense.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-emerald-600 hover:text-emerald-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
