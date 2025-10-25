import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  QrCodeScanner as QrCodeIcon,
  Help as EnquiryIcon,
  History as HistoryIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const StaffSidebar = ({ 
  open, 
  onClose, 
  activeTab, 
  onTabChange,
  isMobile = false 
}) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    {
      id: 'mark-attendance',
      label: 'Mark Attendance',
      icon: QrCodeIcon,
      description: 'Scan student QR codes'
    },
    {
      id: 'enquiry',
      label: 'Enquiry',
      icon: EnquiryIcon,
      description: 'Manage student enquiries'
    }
  ];

  const handleTabChange = (tabId) => {
    onTabChange(tabId);
    if (isMobile) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            color: '#1f2937',
            fontSize: { xs: '1rem', sm: '1.1rem' }
          }}
        >
          Staff Menu
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ color: '#6b7280', fontSize: '0.75rem' }}
        >
          Choose your action
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flex: 1, pt: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleTabChange(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  backgroundColor: isActive ? '#667eea' : 'transparent',
                  color: isActive ? 'white' : '#374151',
                  '&:hover': {
                    backgroundColor: isActive ? '#5a67d8' : '#f3f4f6',
                    color: isActive ? 'white' : '#1f2937'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: isActive ? 'white' : '#6b7280'
                }}>
                  <Icon sx={{ fontSize: { xs: 20, sm: 22 } }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: isActive ? 600 : 500,
                        fontSize: { xs: '0.875rem', sm: '0.9rem' }
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                  secondary={
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: isActive ? 'rgba(255,255,255,0.8)' : '#9ca3af',
                        fontSize: '0.7rem',
                        display: { xs: 'none', sm: 'block' }
                      }}
                    >
                      {item.description}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          p: 1,
          borderRadius: 2,
          backgroundColor: '#f8fafc'
        }}>
          <PersonIcon sx={{ color: '#667eea', fontSize: 20 }} />
          <Box>
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
              Staff Portal
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem', display: 'block' }}>
              v1.0.0
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: { xs: 280, sm: 300 },
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: { xs: 280, sm: 300 },
          boxSizing: 'border-box',
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#fafbfc'
        }
      }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default StaffSidebar;
