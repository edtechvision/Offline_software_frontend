import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaChartBar, 
  FaUsers, 
  FaBook, 
  FaCalendarAlt, 
  FaBuilding, 
  FaUserTie, 
  FaMoneyBillWave, 
  FaIdCard, 
  FaCreditCard, 
  FaQuestionCircle, 
  FaBoxes, 
  FaBriefcase, 
  FaImages, 
  FaFileAlt,
  FaBars,
  FaChevronLeft,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { FaChevronRight } from 'react-icons/fa6';

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar, path: '/dashboard' },
    { id: 'students', label: 'Students', icon: FaUsers, path: '/students', hasSubmenu: true },
    { id: 'course', label: 'Course', icon: FaBook, path: '/course' },
    { id: 'batch', label: 'Batch', icon: FaCalendarAlt, path: '/batch' },
    { id: 'center', label: 'Center', icon: FaBuilding, path: '/center' },
    { id: 'admission-incharge', label: 'Admission Incharge', icon: FaUserTie, path: '/admission-incharge' },
    { id: 'center-expenses', label: 'Center Expenses', icon: FaMoneyBillWave, path: '/center-expenses' },
    // { id: 'all-icard', label: 'All Icard', icon: FaIdCard, path: '/all-icard' },
    { 
      id: 'fee', 
      label: 'Fee', 
      icon: FaCreditCard, 
      path: '/fee', 
      hasSubmenu: true,
      submenu: [
        { label: 'Collect Fee', path: '/fee/collect' },
        { label: 'Pending Fee', path: '/fee/pending' },
        { label: 'Fee History', path: '/fee/history' },
        { label: 'Fee Discount', path: '/fee/discount' }
      ]
    },
    { id: 'enquiry', label: 'Enquiry', icon: FaQuestionCircle, path: '/enquiry' },
    { id: 'stock-management', label: 'Stock Management', icon: FaBoxes, path: '/stock-management' },
    // { id: 'manage-job', label: 'Manage Job', icon: FaBriefcase, path: '/manage-job', hasSubmenu: true },
    // { id: 'slider', label: 'Slider', icon: FaImages, path: '/slider' },
    // { id: 'offline-job-applications', label: 'Offline Job Applications', icon: FaFileAlt, path: '/offline-job-applications' },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handleMenuClick = (item) => {
    if (item.hasSubmenu) {
      setOpenSubmenus(prev => ({
        ...prev,
        [item.id]: !prev[item.id]
      }));
    } else {
      navigate(item.path);
    }
  };

  const handleSubmenuClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-primary-900 text-white flex flex-col flex-shrink-0 h-full transition-all duration-300 ease-in-out`}>
      {/* Logo and Menu Toggle - Fixed at top */}
      <div className="p-3 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-900 font-bold text-sm">TB</span>
            </div>
            {!isCollapsed && (
              <span className="text-lg font-semibold">TB Admin Panel</span>
            )}
          </div>
          <button 
            onClick={onToggle}
            className="text-white hover:text-gray-300 transition-colors duration-200"
          >
            {isCollapsed ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Welcome Message and Date - Fixed below logo */}
      {!isCollapsed && (
        <div className="p-3 border-b border-gray-700 flex-shrink-0">
          <div className="text-xs text-gray-300 mb-1">Welcome: Admin</div>
          <div className="text-xs text-gray-400">{currentDate}</div>
        </div>
      )}

      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isSubmenuOpen = openSubmenus[item.id];
            const hasActiveSubmenu = item.submenu && item.submenu.some(subItem => isActive(subItem.path));
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full text-left flex items-center justify-between p-2 rounded-lg transition-colors duration-200 hover:bg-gray-800 ${
                    isActive(item.path) || hasActiveSubmenu ? 'bg-accent text-white' : 'text-gray-300 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="text-lg" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </div>
                  {!isCollapsed && item.hasSubmenu && (
                    isSubmenuOpen ? <FaChevronUp className="w-3 h-3 text-gray-400" /> : <FaChevronDown className="w-3 h-3 text-gray-400" />
                  )}
                </button>
                
                {/* Submenu */}
                {!isCollapsed && item.hasSubmenu && item.submenu && isSubmenuOpen && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleSubmenuClick(subItem.path)}
                          className={`w-full text-left flex items-center p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${
                            isActive(subItem.path) ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-200'
                          }`}
                        >
                          <span className="text-xs font-medium">{subItem.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
