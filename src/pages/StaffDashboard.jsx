import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Alert,
  Snackbar,
  Fade,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  QrCodeScanner as QrCodeIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import QRCodeScanner from '../components/QRCodeScanner';

const StaffDashboard = () => {
  const { currentUser, logout } = useAuthContext();
  const navigate = useNavigate();

  // State management
  const [scannedStudents, setScannedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState('');

  // Load scanned students from localStorage on component mount
  useEffect(() => {
    const savedScans = localStorage.getItem('scannedStudents');
    if (savedScans) {
      try {
        setScannedStudents(JSON.parse(savedScans));
      } catch (error) {
        console.error('Error loading scanned students:', error);
      }
    }
  }, []);

  // Save scanned students to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('scannedStudents', JSON.stringify(scannedStudents));
  }, [scannedStudents]);

  // Handle QR code scanning
  const handleScan = () => {
    setShowScanner(true);
  };

  // Handle successful QR code scan
  const handleScanSuccess = (qrData) => {
    setScannedData(qrData);
    setShowScanner(false);
  };

  // Handle QR code scan error
  const handleScanError = (error) => {
    console.error('QR scan error:', error);
    showSnackbar('Failed to scan QR code. Please try again.', 'error');
    setShowScanner(false);
  };

  // Process scanned data
  const processScannedData = () => {
    try {
      const studentData = JSON.parse(scannedData);
      
      // Check if student already exists
      const existingIndex = scannedStudents.findIndex(
        student => student.studentId === studentData.studentId
      );
      
      if (existingIndex >= 0) {
        // Update existing student
        const updatedStudents = [...scannedStudents];
        updatedStudents[existingIndex] = {
          ...studentData,
          scannedAt: new Date().toISOString(),
          status: 'present'
        };
        setScannedStudents(updatedStudents);
        showSnackbar('Student attendance updated!', 'success');
      } else {
        // Add new student
        setScannedStudents(prev => [studentData, ...prev]);
        showSnackbar('Student scanned successfully!', 'success');
      }
      
      setShowScanner(false);
      setScannedData('');
    } catch (error) {
      showSnackbar('Invalid QR code data!', 'error');
      setShowScanner(false);
      setScannedData('');
    }
  };

  // Filter students based on search term
  const filteredStudents = scannedStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Clear all scanned students
  const clearAllScans = () => {
    setScannedStudents([]);
    showSnackbar('All scans cleared!', 'info');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        maxWidth: '430px', // Mobile width constraint
        margin: '0 auto',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 1,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // Force mobile view on all screen sizes
        '@media (min-width: 431px)': {
          border: '2px solid #667eea',
          borderRadius: '20px',
          boxShadow: '0 0 30px rgba(102, 126, 234, 0.3)',
          margin: '20px auto',
          height: 'calc(100vh - 40px)'
        }
      }}
    >
      {/* Mobile-only indicator for desktop */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          display: { xs: 'none', sm: 'block' },
          zIndex: 1000
        }}
      >
        <Chip
          label="Mobile View"
          size="small"
          sx={{
            background: 'rgba(102, 126, 234, 0.9)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.65rem'
          }}
        />
      </Box>

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

      <Box sx={{ 
        position: 'relative', 
        zIndex: 1, 
        flex: 1, 
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <QrCodeIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 0.5 }}>
                    Staff Scanner
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6b7280' }}>
                    Welcome, {currentUser?.name || 'Staff Member'}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  '&:hover': {
                    borderColor: '#5a67d8',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)'
                  }
                }}
              >
                Logout
              </Button>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Button
                variant="contained"
                onClick={handleScan}
                startIcon={<QrCodeIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Scan ID Card
              </Button>

              <Button
                variant="outlined"
                onClick={clearAllScans}
                disabled={scannedStudents.length === 0}
                startIcon={<RefreshIcon />}
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                  }
                }}
              >
                Clear All
              </Button>
            </Box>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search students by name, ID, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#667eea' }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: '#e5e7eb'
                  },
                  '&:hover fieldset': {
                    borderColor: '#667eea'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea'
                  }
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Card
            sx={{
              flex: 1,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#667eea', mb: 0.5 }}>
                {scannedStudents.length}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                Total Scanned
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              flex: 1,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <CardContent sx={{ textAlign: 'center', p: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', mb: 0.5 }}>
                {scannedStudents.filter(s => s.status === 'present').length}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                Present Today
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Students Table */}
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', fontSize: '1rem' }}>
                Scanned Students ({filteredStudents.length})
              </Typography>
            </Box>

            {filteredStudents.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <QrCodeIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2, opacity: 0.6 }} />
                <Typography variant="body1" sx={{ color: '#6b7280', mb: 1, fontWeight: 600 }}>
                  No students scanned yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                  Use the "Scan ID Card" button to start scanning
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.75rem', py: 1 }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.75rem', py: 1 }}>Course</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.75rem', py: 1 }}>Time</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.75rem', py: 1 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredStudents.map((student, index) => (
                        <TableRow key={student.id || index} hover>
                          <TableCell sx={{ py: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 600,
                                  fontSize: '0.75rem'
                                }}
                              >
                                {student.name?.charAt(0) || 'S'}
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.75rem', lineHeight: 1.2 }}>
                                  {student.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.65rem' }}>
                                  {student.studentId}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.75rem' }}>
                              {student.course}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.65rem' }}>
                              {student.class}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.75rem' }}>
                              {new Date(student.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.65rem' }}>
                              {new Date(student.scannedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 1 }}>
                            <Chip
                              icon={<CheckCircleIcon sx={{ fontSize: 12 }} />}
                              label="Present"
                              color="success"
                              size="small"
                              sx={{ 
                                fontWeight: 600, 
                                fontSize: '0.65rem',
                                height: 20,
                                '& .MuiChip-label': {
                                  px: 0.5
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* QR Scanner Component */}
      <QRCodeScanner
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onScanSuccess={handleScanSuccess}
        onScanError={handleScanError}
      />

      {/* Process Scanned Data Dialog */}
      <Dialog
        open={!!scannedData && !showScanner}
        onClose={() => setScannedData('')}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Process Student Data
          </Typography>
          <IconButton onClick={() => setScannedData('')}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#374151', mb: 1 }}>
              QR Code Detected!
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
              Student data has been successfully scanned. Click "Process" to add to the list.
            </Typography>
            <Button
              variant="contained"
              onClick={processScannedData}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              Process Student Data
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* CSS animations */}
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

export default StaffDashboard;
