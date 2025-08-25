import React from 'react';
import { FaBriefcase, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

const JobApplicationsPage = () => {
  const applicationsData = [
    { id: 1, name: 'Rahul Kumar', position: 'Physics Teacher', email: 'rahul@email.com', phone: '+91 98765 43210', date: '2025-08-19', status: 'New' },
    { id: 2, name: 'Priya Singh', position: 'Chemistry Teacher', email: 'priya@email.com', phone: '+91 87654 32109', date: '2025-08-18', status: 'Shortlisted' },
    { id: 3, name: 'Amit Patel', position: 'Mathematics Teacher', email: 'amit@email.com', phone: '+91 76543 21098', date: '2025-08-17', status: 'Interviewed' },
    { id: 4, name: 'Neha Sharma', position: 'Biology Teacher', email: 'neha@email.com', phone: '+91 65432 10987', date: '2025-08-16', status: 'Rejected' },
    { id: 5, name: 'Vikram Verma', position: 'English Teacher', email: 'vikram@email.com', phone: '+91 54321 09876', date: '2025-08-15', status: 'Hired' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Shortlisted': return 'bg-yellow-100 text-yellow-800';
      case 'Interviewed': return 'bg-purple-100 text-purple-800';
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Job Applications</h1>
            <p className="text-orange-100">Manage offline job applications and recruitment process</p>
          </div>
          <FaBriefcase className="text-5xl text-orange-200" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <FaFileAlt className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Applications</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FaUser className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hired</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaUser className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicationsData.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        <FaUser className="text-orange-600 text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{application.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{application.position}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        {application.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaPhone className="text-gray-400 mr-2" />
                        {application.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FaCalendarAlt className="text-gray-400 mr-2" />
                      {application.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
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

export default JobApplicationsPage;
