import React from 'react';
import { FaIdCard, FaUser, FaGraduationCap, FaDownload, FaPrint } from 'react-icons/fa';

const IcardPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Student ID Card Management</h1>
            <p className="text-indigo-100">Generate and manage student identification cards</p>
          </div>
          <FaIdCard className="text-5xl text-indigo-200" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-200 text-center">
        <FaIdCard className="text-8xl text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ID Card Management</h2>
        <p className="text-gray-600 mb-8">Manage student ID cards, generate new ones, and track card status</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="p-6 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
            <FaUser className="text-3xl text-indigo-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Generate New Card</h3>
            <p className="text-sm text-gray-600">Create ID cards for new students</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
            <FaDownload className="text-3xl text-indigo-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Download Cards</h3>
            <p className="text-sm text-gray-600">Download ID cards in various formats</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
            <FaPrint className="text-3xl text-indigo-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Print Cards</h3>
            <p className="text-sm text-gray-600">Print ID cards for distribution</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IcardPage;
