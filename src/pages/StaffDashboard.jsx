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
  DialogActions,
  Grid,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery
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
  Error as ErrorIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Help as EnquiryIcon
} from '@mui/icons-material';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import QRCodeScanner from '../components/QRCodeScanner';
import StaffHeader from '../components/StaffHeader';
import StaffSidebar from '../components/StaffSidebar';
import { useAttendance } from '../hooks/useAttendance';

const StaffDashboard = () => {
  const { currentUser, logout } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [currentView, setCurrentView] = useState('mark-attendance');

  // Attendance hook
  const {
    data: attendanceData,
    totalRecords,
    currentPage,
    totalPages,
    limit,
    search: attendanceSearch,
    startDate,
    endDate,
    sortBy,
    order,
    loading: attendanceLoading,
    error: attendanceError,
    stats,
    setCurrentPage,
    setLimit,
    setSearch: setAttendanceSearch,
    setDateRange,
    setSort,
    fetchAttendance
  } = useAttendance();

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

  // Sound effects
  const playScanSound = (success = true) => {
    try {
      const soundFile = success ? '/src/assets/sounds/scan.mp3' : '/src/assets/sounds/failure.wav';
      const audio = new Audio(soundFile);
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.log('Could not play sound:', error);
      });
    } catch (error) {
      console.log('Sound not available:', error);
    }
  };

  // Save scanned students to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('scannedStudents', JSON.stringify(scannedStudents));
  }, [scannedStudents]);

  // Handle QR code scanning
  const handleScan = () => {
    setShowScanner(true);
  };

  // Handle successful QR code scan
  const handleScanSuccess = (result) => {
    console.log('QR scan success:', result);

    // Handle the new response format from QR scanner
    if (result.success) {
      // API call was successful
      const pendingInfo = result?.apiResponse?.data?.pendingFees;
      const pendingAmount = typeof pendingInfo === 'object' ? Number(pendingInfo?.pendingFees || 0) : Number(pendingInfo || 0);
      const stats = result?.apiResponse?.data?.stats;
      const statsPart = stats
        ? ` • Scanned: ${stats.totalScanned} | Present: ${stats.totalPresent} | Absent: ${stats.totalAbsent}`
        : '';
      const successMsg = pendingAmount > 0
        ? `${result.message} • Pending fees: ₹${pendingAmount}${statsPart}`
        : `${result.message}${statsPart}`;
      showSnackbar(successMsg, pendingAmount > 0 ? 'error' : 'success');

      // Add student to the list if we have student data
      if (result.studentData) {
        const studentData = result.studentData;
        // attach pending fee info from API if available
        const studentWithFees = {
          ...studentData,
          pendingFees: pendingAmount > 0 ? pendingAmount : 0,
          pendingDetails: typeof pendingInfo === 'object' ? pendingInfo : null
        };
        const existingIndex = scannedStudents.findIndex(
          student => student.studentId === studentData.studentId
        );

        if (existingIndex >= 0) {
          // Update existing student
          const updatedStudents = [...scannedStudents];
          updatedStudents[existingIndex] = {
            ...studentWithFees,
            scannedAt: new Date().toISOString(),
            status: 'present'
          };
          setScannedStudents(updatedStudents);
        } else {
          // Add new student
          setScannedStudents(prev => [{
            ...studentWithFees,
            scannedAt: new Date().toISOString(),
            status: 'present'
          }, ...prev]);
        }
      }

      // Refresh attendance data
      fetchAttendance();
    } else {
      // API call failed
      showSnackbar(result.message, 'error');
    }

    // Keep scanner open for continuous scanning; user can close manually
  };

  // Handle QR code scan error
  const handleScanError = (error) => {
    console.error('QR scan error:', error);
    showSnackbar('Failed to scan QR code. Please try again.', 'error');
    // Keep scanner open so user can retry immediately
  };

  // Filter students based on search term
  const filteredStudents = scannedStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show snackbar
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

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle sidebar close
  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Handle view change
  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'enquiry') {
      navigate('/enquiry-staff');
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        maxWidth: '430px', // Mobile width constraint
        margin: '0 auto',
        background: '#f8fafc',
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
        },
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
          label="Staff Portal"
          size="small"
          sx={{
            background: 'rgba(102, 126, 234, 0.9)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.65rem'
          }}
        />
      </Box>

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
            mb: { xs: 2, sm: 3 },
            borderRadius: 3,
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            zIndex: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 'inherit',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              pointerEvents: 'none',
              zIndex: -1
            }
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                <Box
                  sx={{
                    width: { xs: 48, sm: 60 },
                    height: { xs: 48, sm: 60 },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  <QrCodeIcon sx={{ color: 'white', fontSize: { xs: 22, sm: 30 } }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1f2937', mb: 0.5, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                    Staff Scanner
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#6b7280', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
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
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
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
            <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap', mb: { xs: 1.5, sm: 2 } }}>
              <Button
                variant="contained"
                onClick={handleScan}
                startIcon={<QrCodeIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.85rem', sm: '1rem' },
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
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                  }
                }}
              >
                Clear All
              </Button>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 2, sm: 3 } }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab 
                  label="Today's Scans" 
                  icon={<QrCodeIcon />} 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                />
                <Tab 
                  label="Attendance History" 
                  icon={<HistoryIcon />} 
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                />
              </Tabs>
            </Box>

            {/* Mobile Navigation */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              gap: 1, 
              mb: 2,
              justifyContent: 'center'
            }}>
              <Button
                variant={currentView === 'mark-attendance' ? 'contained' : 'outlined'}
                onClick={() => handleViewChange('mark-attendance')}
                startIcon={<QrCodeIcon />}
                size="small"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  px: 2
                }}
              >
                Mark Attendance
              </Button>
              <Button
                variant={currentView === 'enquiry' ? 'contained' : 'outlined'}
                onClick={() => handleViewChange('enquiry')}
                startIcon={<EnquiryIcon />}
                size="small"
                sx={{
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  px: 2
                }}
              >
                Enquiry
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Dashboard Content */}
        <Box sx={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>

            {/* Tab Content */}
            {activeTab === 0 && (
              <>
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
                    ),
                  }}
                  sx={{
                    mb: { xs: 2, sm: 3 },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: 1.5, sm: 2 },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea'
                      }
                    }
                  }}
                />

                {/* Statistics Cards */}
                <Box sx={{ display: 'flex', gap: 1, mb: { xs: 1.5, sm: 2 } }}>
                  <Card
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                        pointerEvents: 'none'
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: { xs: 1, sm: 1.5 } }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#667eea', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                        {typeof stats?.totalScanned === 'number' ? stats.totalScanned : scannedStudents.length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                        Total Scanned
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card
                    sx={{
                      flex: 1,
                      borderRadius: 2,
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(15px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
                        pointerEvents: 'none'
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: { xs: 1, sm: 1.5 } }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                        {typeof stats?.totalPresent === 'number' ? stats.totalPresent : filteredStudents.length}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                        Present Today
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                {/* Students List */}
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(15px)',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      pointerEvents: 'none',
                      zIndex: 0
                    }
                  }}
                >
                  <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                        Scanned Students ({filteredStudents.length})
                      </Typography>
                    </Box>

                    {filteredStudents.length === 0 ? (
                      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <QrCodeIcon sx={{ fontSize: { xs: 40, sm: 48 }, color: '#9ca3af', mb: 2, opacity: 0.6 }} />
                        <Typography variant="body1" sx={{ color: '#6b7280', mb: 1, fontWeight: 600 }}>
                          No students scanned yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          Use the "Scan ID Card" button to start scanning
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: { xs: 0.5, sm: 1 }, maxHeight: { xs: 340, sm: 420 } }}>
                        {filteredStudents.map((student, index) => (
                          <Card
                            key={student.id || index}
                            sx={{
                              mb: { xs: 1, sm: 1.5 },
                              borderRadius: 2,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              border: '1px solid #e5e7eb'
                            }}
                          >
                            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                              {/* Student Info Row */}
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 1.5 }, mb: { xs: 1.25, sm: 1.5 } }}>
                                <Box
                                  sx={{
                                    width: { xs: 34, sm: 40 },
                                    height: { xs: 34, sm: 40 },
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                                  }}
                                >
                                  {student.name?.charAt(0) || 'S'}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                    {student.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                    {student.studentId}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1 }, alignItems: 'center' }}>
                                  <Chip
                                    label="Present"
                                    color="success"
                                    size="small"
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                      height: { xs: 22, sm: 24 },
                                      '& .MuiChip-label': { px: { xs: 0.75, sm: 1 } }
                                    }}
                                  />
                                  {Number(student.pendingFees) > 0 && (
                                    <Chip
                                      label={`Pending ₹${Number(student.pendingFees)}`}
                                      color="error"
                                      size="small"
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: { xs: '0.68rem', sm: '0.72rem' },
                                        height: { xs: 22, sm: 24 },
                                        backgroundColor: 'error.light',
                                        color: 'error.contrastText',
                                        '& .MuiChip-label': { px: { xs: 0.75, sm: 1 } }
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>

                              {/* Course and Time Row */}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" sx={{ color: '#374151', fontSize: { xs: '0.78rem', sm: '0.8rem' }, fontWeight: 500 }}>
                                    {student.course}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.7rem', sm: '0.75rem' }, ml: { xs: 0.5, sm: 1 } }}>
                                  {new Date(student.scannedAt).toLocaleTimeString()}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* Attendance History Tab */}
            {activeTab === 1 && (
              <Box>
                {/* Attendance Filters */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2, 
                  mb: 3 
                }}>
                  {/* Search and Sort Row */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <TextField
                      placeholder="Search attendance..."
                      value={attendanceSearch}
                      onChange={(e) => setAttendanceSearch(e.target.value)}
                      size="small"
                      sx={{ flex: 1, minWidth: 200 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#667eea' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Sort By</InputLabel>
                      <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSort(e.target.value, order)}
                      >
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="studentId">Student ID</MenuItem>
                        <MenuItem value="markedBy">Staff</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <InputLabel>Order</InputLabel>
                      <Select
                        value={order}
                        label="Order"
                        onChange={(e) => setSort(sortBy, e.target.value)}
                      >
                        <MenuItem value="desc">Desc</MenuItem>
                        <MenuItem value="asc">Asc</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Date Range Row */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                    <TextField
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setDateRange(e.target.value, endDate)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{ minWidth: 150 }}
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setDateRange(startDate, e.target.value)}
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{ minWidth: 150 }}
                    />
                    <Button
                      variant="outlined"
                      onClick={() => setDateRange('', '')}
                      size="small"
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#5a67d8',
                          backgroundColor: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      Clear Dates
                    </Button>
                  </Box>
                </Box>

                {/* Attendance List */}
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    {attendanceLoading ? (
                      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" sx={{ mt: 1, color: '#6b7280' }}>
                          Loading attendance records...
                        </Typography>
                      </Box>
                    ) : attendanceError ? (
                      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                        <ErrorIcon sx={{ fontSize: { xs: 40, sm: 48 }, color: '#ef4444', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: '#ef4444', mb: 1 }}>
                          Error loading attendance
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {attendanceError}
                        </Typography>
                      </Box>
                    ) : attendanceData.length === 0 ? (
                      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                        <HistoryIcon sx={{ fontSize: { xs: 40, sm: 48 }, color: '#9ca3af', mb: 2, opacity: 0.6 }} />
                        <Typography variant="body1" sx={{ color: '#6b7280', mb: 1, fontWeight: 600 }}>
                          No attendance records found
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                          Attendance records will appear here after scanning
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: 1, borderColor: 'divider' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', fontSize: { xs: '0.95rem', sm: '1rem' } }}>
                            Attendance Records ({totalRecords})
                          </Typography>
                        </Box>
                        <Box sx={{ maxHeight: { xs: 340, sm: 400 }, overflow: 'auto', p: { xs: 0.5, sm: 1 } }}>
                          {attendanceData.map((record, index) => (
                            <Card
                              key={record._id || index}
                              sx={{
                                mb: { xs: 1, sm: 1.5 },
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid #e5e7eb'
                              }}
                            >
                              <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                                {/* Student Info Row */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 1.5 }, mb: { xs: 1.25, sm: 1.5 } }}>
                                  <Avatar sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, bgcolor: '#667eea' }}>
                                    {record.studentId?.studentName?.charAt(0) || 'S'}
                                  </Avatar>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                      {record.studentId?.studentName || 'Unknown Student'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                      ID: {record.registrationNo || record.studentId?.registrationNo || 'N/A'}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={record.status || 'Present'}
                                    color="success"
                                    size="small"
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                      height: { xs: 22, sm: 24 },
                                      '& .MuiChip-label': {
                                        px: { xs: 0.75, sm: 1 }
                                      }
                                    }}
                                  />
                                </Box>

                                {/* Staff and Time Row */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                    By: {record.markedBy?.staffname || 'Unknown Staff'} ({record.markedBy?.staffcode || 'N/A'})
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#6b7280', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                    {new Date(record.date).toLocaleString()}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Box>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <Card sx={{ mt: 2, borderRadius: 2 }}>
                            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: { xs: 1, sm: 2 }
                              }}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: { xs: 1, sm: 2 },
                                  flexWrap: 'wrap'
                                }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                    Rows per page:
                                  </Typography>
                                  <FormControl size="small" sx={{ minWidth: { xs: 60, sm: 80 } }}>
                                    <Select
                                      value={limit}
                                      onChange={(e) => setLimit(parseInt(e.target.value))}
                                      sx={{ 
                                        borderRadius: 2,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                      }}
                                    >
                                      <MenuItem value={5} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>5</MenuItem>
                                      <MenuItem value={10} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>10</MenuItem>
                                      <MenuItem value={25} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>25</MenuItem>
                                      <MenuItem value={50} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>50</MenuItem>
                                    </Select>
                                  </FormControl>
                                  <Typography variant="body2" color="text.secondary" sx={{ 
                                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                                    display: { xs: 'none', sm: 'block' }
                                  }}>
                                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} entries
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ 
                                    fontSize: '0.7rem',
                                    display: { xs: 'block', sm: 'none' }
                                  }}>
                                    {currentPage} of {totalPages} pages
                                  </Typography>
                                </Box>
                                <Pagination
                                  count={totalPages}
                                  page={currentPage}
                                  onChange={(e, page) => setCurrentPage(page)}
                                  color="primary"
                                  size={isMobile ? "small" : "medium"}
                                  showFirstButton={!isMobile}
                                  showLastButton={!isMobile}
                                  siblingCount={isMobile ? 0 : 1}
                                  boundaryCount={isMobile ? 1 : 1}
                                  sx={{
                                    '& .MuiPaginationItem-root': {
                                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                      minWidth: { xs: 32, sm: 40 },
                                      height: { xs: 32, sm: 40 }
                                    }
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        </Box>

        {/* QR Scanner Component */}
        <QRCodeScanner
          open={showScanner}
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />

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