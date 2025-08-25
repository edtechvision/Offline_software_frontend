import React, { useState } from 'react';
import { FaPhone, FaUser, FaEnvelope, FaCalendarAlt, FaClock, FaSearch, FaFilter } from 'react-icons/fa';

const EnquiryPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  
  const enquiriesData = [
    { id: 1, name: 'Rahul Kumar', phone: '+91 98765 43210', email: 'rahul@email.com', course: '12th Physics', status: 'New', date: '2025-08-19', time: '10:30 AM' },
    { id: 2, name: 'Priya Singh', phone: '+91 87654 32109', email: 'priya@email.com', course: '10th Foundation', status: 'Contacted', date: '2025-08-18', time: '2:15 PM' },
    { id: 3, name: 'Amit Patel', phone: '+91 76543 21098', email: 'amit@email.com', course: 'Crash Course 12th', status: 'Converted', date: '2025-08-17', time: '11:45 AM' },
    { id: 4, name: 'Neha Sharma', phone: '+91 65432 10987', email: 'neha@email.com', course: '12th Chemistry', status: 'Follow Up', date: '2025-08-16', time: '4:20 PM' },
    { id: 5, name: 'Vikram Verma', phone: '+91 54321 09876', email: 'vikram@email.com', course: '10th Foundation', status: 'New', date: '2025-08-15', time: '9:00 AM' },
  ];

  const filteredEnquiries = filterStatus === 'all' 
    ? enquiriesData 
    : enquiriesData.filter(enquiry => enquiry.status === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Follow Up': return 'bg-orange-100 text-orange-800';
      case 'Converted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Enquiry Management</h1>
            <p className="text-blue-100">Track and manage student enquiries and leads</p>
          </div>
          <FaPhone className="text-5xl text-blue-200" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Enquiries</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaPhone className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Today</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaUser className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <FaEnvelope className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Follow Up</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FaClock className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
          
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search enquiries..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Enquiries</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-blue-600 text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{enquiry.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaPhone className="text-gray-400 mr-2" />
                        {enquiry.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        {enquiry.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{enquiry.course}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enquiry.status)}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaCalendarAlt className="text-gray-400 mr-2" />
                        {enquiry.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaClock className="text-gray-400 mr-2" />
                        {enquiry.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Call</button>
                    <button className="text-green-600 hover:text-green-900 mr-3">Update</button>
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

export default EnquiryPage;
