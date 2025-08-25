import React from 'react';
import { FaUsers, FaEye, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const JobApplicationsListPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Job Applications List</h1>
            <p className="text-violet-100">Review and manage all job applications</p>
          </div>
          <FaUsers className="text-5xl text-violet-200" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-200 text-center">
        <FaUsers className="text-8xl text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Applications</h2>
        <p className="text-gray-600 mb-8">Review, shortlist, and manage job applications from candidates</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="p-6 border border-gray-200 rounded-xl hover:border-violet-300 transition-colors">
            <FaEye className="text-3xl text-violet-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">View Applications</h3>
            <p className="text-sm text-gray-600">Review all applications</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-violet-300 transition-colors">
            <FaCheck className="text-3xl text-violet-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Shortlist</h3>
            <p className="text-sm text-gray-600">Shortlist candidates</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-violet-300 transition-colors">
            <FaEdit className="text-3xl text-violet-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Update Status</h3>
            <p className="text-sm text-gray-600">Update application status</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-violet-300 transition-colors">
            <FaTimes className="text-3xl text-violet-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Reject</h3>
            <p className="text-sm text-gray-600">Reject applications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsListPage;
