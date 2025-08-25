import React from 'react';
import { FaBriefcase, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const JobCategoryPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Job Category Management</h1>
            <p className="text-cyan-100">Organize and manage job categories for recruitment</p>
          </div>
          <FaBriefcase className="text-5xl text-cyan-200" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-200 text-center">
        <FaBriefcase className="text-8xl text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Categories</h2>
        <p className="text-gray-600 mb-8">Create and manage job categories for better organization</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="p-6 border border-gray-200 rounded-xl hover:border-cyan-300 transition-colors">
            <FaPlus className="text-3xl text-cyan-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Add Category</h3>
            <p className="text-sm text-gray-600">Create new job categories</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-cyan-300 transition-colors">
            <FaEdit className="text-3xl text-cyan-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Edit Categories</h3>
            <p className="text-sm text-gray-600">Modify existing categories</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-cyan-300 transition-colors">
            <FaTrash className="text-3xl text-cyan-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Delete Categories</h3>
            <p className="text-sm text-gray-600">Remove unused categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCategoryPage;
