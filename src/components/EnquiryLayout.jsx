import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StaffHeader from './StaffHeader';
import StaffSidebar from './StaffSidebar';

const EnquiryLayout = ({ children }) => {
  const { currentUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [currentView, setCurrentView] = useState('enquiry');

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle sidebar close
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle view change
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'mark-attendance') {
      navigate('/staff-dashboard');
    }
    // enquiry view is already active, no need to navigate
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Header */}
      <StaffHeader
        onMenuClick={handleSidebarToggle}
        onLogout={handleLogout}
        userName={currentUser?.name || 'Staff Member'}
      />

      {/* Sidebar */}
      <StaffSidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        activeTab={currentView}
        onTabChange={handleViewChange}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          marginLeft: { xs: 0, md: sidebarOpen ? '300px' : 0 },
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 1, sm: 2 },
            pt: { xs: 8, sm: 9 } // Account for header height
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default EnquiryLayout;
