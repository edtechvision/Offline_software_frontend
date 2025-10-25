import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  QrCodeScanner as QrCodeIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const StaffHeader = ({ onMenuClick, onLogout, userName = 'Staff Member' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        zIndex: theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              backdropFilter: 'blur(10px)'
            }}
          >
            <QrCodeIcon sx={{ color: 'white', fontSize: { xs: 20, sm: 24 } }} />
          </Box>
          <Box>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="div" 
              sx={{ 
                fontWeight: 700,
                color: 'white'
              }}
            >
              Staff Dashboard
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            >
              Welcome, {userName}
            </Typography>
          </Box>
        </Box>

        {/* Logout Button */}
        <Button
          variant="outlined"
          onClick={onLogout}
          startIcon={<LogoutIcon />}
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.5)',
            color: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 1 }
          }}
        >
          {isMobile ? 'Logout' : 'Logout'}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default StaffHeader;
