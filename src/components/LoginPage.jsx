import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Snackbar,
  Slide
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useAuthContext } from '../contexts/AuthContext';

// Tab Panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    admin: { email: '', password: '' },
    staff: { email: '', password: '' },
    center: { centerCode: '', password: '' }
  });
  
  const { login, isLoggingIn, loginError } = useAuth();
  const { login: authLogin } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Show snackbar for React Query errors
  useEffect(() => {
    if (loginError) {
      showSnackbar(loginError.message || 'Login failed', 'error');
    }
  }, [loginError]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let credentials;
    let loginType;
    
    switch (activeTab) {
      case 0: // Admin
        credentials = formData.admin;
        loginType = 'admin';
        if (!credentials.email || !credentials.password) {
          showSnackbar('Please fill in all fields', 'error');
          return;
        }
        break;
      case 1: // Staff
        credentials = formData.staff;
        loginType = 'staff';
        if (!credentials.email || !credentials.password) {
          showSnackbar('Please fill in all fields', 'error');
          return;
        }
        break;
      case 2: // Center
        credentials = formData.center;
        loginType = 'center';
        if (!credentials.centerCode || !credentials.password) {
          showSnackbar('Please enter center code and password', 'error');
          return;
        }
        break;
      default:
        return;
    }

    try {
      let response;
      
      // Call appropriate login function based on type
      switch (loginType) {
        case 'admin':
          response = await login(credentials, {
            onSuccess: (response) => {
              if (response.success) {
                const { token, user } = response.data;
                authLogin(user, token, 'admin');
                showSnackbar('Admin login successful!', 'success');
                
                // Redirect to dashboard
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
              }
            },
            onError: (error) => {
              showSnackbar(error?.message || 'Admin login failed', 'error');
            }
          });
          break;
        case 'staff':
          // Staff login with static credentials
          const staticCredentials = {
            email: 'staff@targetboard.com',
            password: 'staff123'
          };
          
          // Check static credentials
          if (credentials.email === staticCredentials.email && credentials.password === staticCredentials.password) {
            const staffUser = {
              id: 'staff_001',
              name: 'Staff Member',
              email: credentials.email,
              role: 'staff'
            };
            
            // Store in localStorage
            localStorage.setItem('authToken', 'staff_token_static');
            localStorage.setItem('userData', JSON.stringify(staffUser));
            localStorage.setItem('userRole', 'staff');
            
            // Update auth context
            authLogin(staffUser, 'staff_token', 'staff');
            showSnackbar('Staff login successful!', 'success');
            
            // Redirect to staff dashboard
            navigate('/staff-dashboard', { replace: true });
          } else {
            showSnackbar('Invalid staff credentials! Use: staff@targetboard.com / staff123', 'error');
          }
          break;

        case 'center':

          response = await login(credentials, {
            onSuccess: (response) => {

              if (response.success) {
                const { token, user } = response.data;
                authLogin(user, token, 'center');
                showSnackbar('Center login successful!', 'success');
                
                // Redirect to dashboard
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
              }
            },
            onError: (error) => {
              showSnackbar(error?.message || 'Center login failed', 'error');
            }
          });

          break;
      }

      // Check if the response indicates an error
      if (response && !response.success) {
        showSnackbar(response.error?.message || 'Login failed', 'error');
      }
      
    } catch (error) {
      showSnackbar(error.message || 'Login failed. Please try again.', 'error');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getTabIcon = (index) => {
    switch (index) {
      case 0: return <AdminIcon />;
      case 1: return <GroupIcon />;
      case 2: return <BusinessIcon />;
      default: return <PersonIcon />;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <Box sx={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        {/* Logo and Title */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              mx: 'auto',
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              mb: 2,
              border: '3px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <SchoolIcon sx={{ fontSize: 40, color: '#667eea' }} />
          </Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              color: '#ffffff', 
              mb: 1,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.5px'
            }}
          >
            Target Board
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontWeight: 400,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
            }}
          >
            Offline Admission Management Portal
          </Typography>
        </Box>

        {/* Login Form */}
        <Card 
          sx={{ 
            borderRadius: 3, 
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative top border */}
          <Box
            sx={{
              height: 3,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              width: '100%'
            }}
          />
          
          <CardContent sx={{ p: 0 }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 56,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    color: '#6b7280',
                    '&.Mui-selected': {
                      color: '#667eea',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#667eea',
                    height: 3,
                  },
                }}
              >
                <Tab 
                  icon={<AdminIcon />} 
                  label="Admin" 
                  iconPosition="start"
                  sx={{ minHeight: 56 }}
                />
                <Tab 
                  icon={<GroupIcon />} 
                  label="Staff" 
                  iconPosition="start"
                  sx={{ minHeight: 56 }}
                />
                <Tab 
                  icon={<BusinessIcon />} 
                  label="Center" 
                  iconPosition="start"
                  sx={{ minHeight: 56 }}
                />
              </Tabs>
            </Box>

            <Box sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  textAlign: 'center', 
                  mb: 3, 
                  fontWeight: 700, 
                  color: '#1f2937',
                  letterSpacing: '0.5px'
                }}
              >
                Welcome Back
              </Typography>
              
              <form onSubmit={handleSubmit}>
                {/* Admin Login Tab */}
                <TabPanel value={activeTab} index={0}>
                  <Box sx={{ mb: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.admin.email}
                      onChange={(e) => handleInputChange('admin', 'email', e.target.value)}
                      placeholder="Enter admin email"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AdminIcon sx={{ color: '#667eea', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 1.5,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          '&.Mui-focused': {
                            color: '#667eea',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.admin.password}
                      onChange={(e) => handleInputChange('admin', 'password', e.target.value)}
                      placeholder="Enter admin password"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#667eea', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              size="small"
                              sx={{ color: '#667eea' }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 1.5,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          '&.Mui-focused': {
                            color: '#667eea',
                          },
                        },
                      }}
                    />
                  </Box>
                </TabPanel>

                {/* Staff Login Tab */}
                <TabPanel value={activeTab} index={1}>
                  {/* Demo Credentials Info */}
                  <Box sx={{ 
                    mb: 2, 
                    p: 2, 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: 2, 
                    border: '1px solid #0ea5e9' 
                  }}>
                    <Typography variant="body2" sx={{ color: '#0c4a6e', fontWeight: 600, mb: 1 }}>
                      Demo Credentials:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#0c4a6e', fontSize: '0.875rem' }}>
                      Email: <strong>staff@targetboard.com</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#0c4a6e', fontSize: '0.875rem' }}>
                      Password: <strong>staff123</strong>
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.staff.email}
                      onChange={(e) => handleInputChange('staff', 'email', e.target.value)}
                      placeholder="staff@targetboard.com"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <GroupIcon sx={{ color: '#667eea', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 1.5,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          '&.Mui-focused': {
                            color: '#667eea',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.staff.password}
                      onChange={(e) => handleInputChange('staff', 'password', e.target.value)}
                      placeholder="staff123"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#667eea', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              size="small"
                              sx={{ color: '#667eea' }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 1.5,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          '&.Mui-focused': {
                            color: '#667eea',
                          },
                        },
                      }}
                    />
                  </Box>
                </TabPanel>

                {/* Center Login Tab */}
                <TabPanel value={activeTab} index={2}>
                  <Box sx={{ mb: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Center Code"
                      value={formData.center.centerCode}
                      onChange={(e) => handleInputChange('center', 'centerCode', e.target.value)}
                      placeholder="Enter center code"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon sx={{ color: '#667eea', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 1.5,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          '&.Mui-focused': {
                            color: '#667eea',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.center.password}
                      onChange={(e) => handleInputChange('center', 'password', e.target.value)}
                      placeholder="Enter center password"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#667eea', fontSize: 20 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                              size="small"
                              sx={{ color: '#667eea' }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                            borderWidth: 1.5,
                          },
                          '&:hover fieldset': {
                            borderColor: '#667eea',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 1.5,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          '&.Mui-focused': {
                            color: '#667eea',
                          },
                        },
                      }}
                    />
                  </Box>
                </TabPanel>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoggingIn}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      opacity: 0.7,
                      transform: 'none',
                    },
                  }}
                >
                  {isLoggingIn ? 'Signing in...' : 'Sign in to Portal'}
                </Button>
              </form>

              <Divider sx={{ my: 2.5, opacity: 0.3 }} />
              
              <Typography 
                variant="body2" 
                sx={{ 
                  textAlign: 'center', 
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                  lineHeight: 1.6
                }}
              >
                Secure access to your admission management system
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.75rem'
            }}
          >
            © 2024 Target Board. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Material-UI Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        sx={{
          zIndex: 9999,
          '& .MuiSnackbarContent-root': {
            borderRadius: 3,
            fontWeight: 500,
          },
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </Box>
  );
};

export default LoginPage;
