import React from 'react';
import { FaImages, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const SliderPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Website Slider Management</h1>
            <p className="text-pink-100">Manage homepage sliders and promotional banners</p>
          </div>
          <FaImages className="text-5xl text-pink-200" />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-200 text-center">
        <FaImages className="text-8xl text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Slider Management</h2>
        <p className="text-gray-600 mb-8">Upload, edit, and manage website sliders and promotional content</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="p-6 border border-gray-200 rounded-xl hover:border-pink-300 transition-colors">
            <FaPlus className="text-3xl text-pink-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Add New Slider</h3>
            <p className="text-sm text-gray-600">Upload new slider images</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-pink-300 transition-colors">
            <FaEdit className="text-3xl text-pink-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Edit Sliders</h3>
            <p className="text-sm text-gray-600">Modify existing slider content</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl hover:border-pink-300 transition-colors">
            <FaTrash className="text-3xl text-pink-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Delete Sliders</h3>
            <p className="text-sm text-gray-600">Remove outdated sliders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderPage;
