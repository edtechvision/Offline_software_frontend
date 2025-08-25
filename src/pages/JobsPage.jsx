import React from 'react';
import { FaBriefcase, FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';

const JobsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-green-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Job Postings Management</h1>
            <p className="text-teal-100">Create and manage job postings for recruitment</p>
          </div>
          <FaBriefcase className="text-5xl text-teal-200" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-200 text-center">
        <FaBriefcase className="text-8xl text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Postings</h2>
        <p className="text-gray-600 mb-8">Manage job postings, requirements, and application processes</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="p-6 border border-gray-200 rounded-xl hover:border-teal-300 transition-colors">
            <FaPlus className="text-3xl text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Post New Job</h3>
            <p className="text-sm text-gray-600">Create new job openings</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-teal-300 transition-colors">
            <FaEdit className="text-3xl text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Edit Jobs</h3>
            <p className="text-sm text-gray-600">Modify job descriptions</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-teal-300 transition-colors">
            <FaUsers className="text-3xl text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">View Applications</h3>
            <p className="text-sm text-gray-600">Review job applications</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-teal-300 transition-colors">
            <FaTrash className="text-3xl text-teal-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Close Jobs</h3>
            <p className="text-sm text-gray-600">Close filled positions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
