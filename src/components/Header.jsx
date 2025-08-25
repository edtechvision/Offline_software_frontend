import React from 'react';
import { FaUser, FaCog, FaBars } from 'react-icons/fa';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="bg-bg-primary border-b border-gray-200 px-6 py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Left side - Menu Icon, Logo and Title */}
        <div className="flex items-center space-x-4">
          {/* Menu Icon */}
          <button 
            onClick={onToggleSidebar}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors duration-200"
          >
            <FaBars className="w-5 h-5" />
          </button>
          
          <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">TB</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">TB Admin Panel</h1>
        </div>
        
        {/* Right side - User Profile and Settings */}
        <div className="flex items-center space-x-4">
          {/* User Profile Icon */}
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors duration-200">
            <FaUser className="w-6 h-6" />
          </button>
          
          {/* Settings Icon */}
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors duration-200">
            <FaCog className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
