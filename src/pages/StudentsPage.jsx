import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Pagination,
  CircularProgress,
  Alert,
  InputAdornment,
  Collapse,
  useTheme,
  useMediaQuery,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Slide
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,

  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  FilterList as FilterListIcon,
  Description as DescriptionIcon,
  CloudUpload as UploadIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  CheckCircle as ActivateIcon
} from '@mui/icons-material';
import { useStudents, useDeleteStudent, useCourses, useBatches, useActivateStudent, useDeactivateStudent } from '../hooks';
import { useAuthContext } from '../contexts/AuthContext';
import StudentRegistrationPage from './StudentRegistrationPage';

const StudentsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const [showFilters, setShowFilters] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Get user role from auth context
  const { userRole } = useAuthContext();

  // API hooks
  const { data: studentsData, isLoading, error, refetch } = useStudents({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    courseId: selectedCourse || '',
    batchId: selectedBatch || '',
    className: selectedClassName || ''
  });
  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const { data: batchesData, isLoading: batchesLoading } = useBatches();
  const deleteStudentMutation = useDeleteStudent();
  const activateStudentMutation = useActivateStudent();
  const deactivateStudentMutation = useDeactivateStudent();

  // Extract students from API response
  const students = studentsData?.data?.students || studentsData?.students || [];
  const courses = coursesData?.items || coursesData?.data?.items || [];
  const batches = batchesData?.data?.batches || batchesData?.batches || [];
  const pagination = studentsData?.data?.pagination || studentsData?.pagination || {};
  
  // Calculate totals
  const totalStudents = pagination.total || students.length;
  const totalPages = pagination.totalPages || Math.ceil(totalStudents / pageSize);

  // Filter students based on search term, course, and batch
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.inchargeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mobileNumber?.includes(searchTerm);
    
    const matchesCourse = !selectedCourse || student.courseDetails?.courseId?._id === selectedCourse;
    const matchesBatch = !selectedBatch || student.courseDetails?.batchId?._id === selectedBatch;
    const matchesClass = !selectedClassName || student.className === selectedClassName;
    
    return matchesSearch && matchesCourse && matchesBatch && matchesClass;
  });

  // Role-based permissions
  const isAdmin = userRole === 'admin';
  const isCenter = userRole === 'center';
  const canAddStudent = isCenter;
  const canViewActions = isAdmin;
  const canExport = isAdmin;
  const canSearch = isAdmin;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudentMutation.mutate(studentId, {
        onSuccess: () => {
          showSnackbar('Student deleted successfully', 'success');
        },
        onError: (error) => {
          showSnackbar('Failed to delete student', 'error');
          console.error('Failed to delete student:', error);
        }
      });
    }
  };

  const handleBlock = (studentId) => {
    // Implement block functionality
    console.log('Block student:', studentId);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleActionClick = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleView = () => {
    if (selectedStudent?._id) {
      navigate(`/students/${selectedStudent._id}`);
    }
    handleActionClose();
  };

  const handleEdit = () => {
    if (selectedStudent?._id) {
      navigate(`/students/${selectedStudent._id}/edit`);
    }
    handleActionClose();
  };

  const handleActivate = () => {
    if (selectedStudent?._id) {
      if (selectedStudent.isActive) {
        deactivateStudentMutation.mutate(selectedStudent._id, {
          onSuccess: () => {
            showSnackbar('Student deactivated successfully', 'success');
          },
          onError: (error) => {
            showSnackbar('Failed to deactivate student', 'error');
            console.error('Failed to deactivate student:', error);
          }
        });
      } else {
        activateStudentMutation.mutate(selectedStudent._id, {
          onSuccess: () => {
            showSnackbar('Student activated successfully', 'success');
          },
          onError: (error) => {
            showSnackbar('Failed to activate student', 'error');
            console.error('Failed to activate student:', error);
          }
        });
      }
    }
    handleActionClose();
  };

  const handleModify = () => {
    console.log('Modify student:', selectedStudent);
    handleActionClose();
  };

  // Show registration page if showRegistration is true
  if (showRegistration) {
    return (
      <StudentRegistrationPage 
        onBack={() => setShowRegistration(false)} 
      />
    );
  }

  // Route-based view/edit handled via navigate

  return (
    <Box sx={{  backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Modern Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '4px',
        p: 4,
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700, 
            mb: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🎓 Student Management
          </Typography>
          <Typography variant="h6" sx={{ 
            opacity: 0.9, 
            fontWeight: 400,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            Manage student records, track progress, and maintain academic excellence
          </Typography>
        </Box>
        <Box sx={{
          position: 'absolute',
          right: -20,
          top: -20,
          width: 200,
          height: 200,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          zIndex: 1
        }} />
      </Box>

      {/* Add Student Button for Center Users */}
      {isCenter && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowRegistration(true)}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: '4px',
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
              minHeight: '48px',
            }}
          >
            Add New Student
          </Button>
        </Box>
      )}

 


      {/* Search and Controls */}
      <Card sx={{ mb: 4, borderRadius: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search students by name, code, or mobile..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: '4px' }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  sx={{ borderRadius: '4px' }}
                >
                  <MenuItem value={10}>10 entries</MenuItem>
                  <MenuItem value={25}>25 entries</MenuItem>
                  <MenuItem value={50}>50 entries</MenuItem>
                  <MenuItem value={100}>100 entries</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCourse('');
                  setSelectedBatch('');
                  setSelectedClassName('');
                  setCurrentPage(1);
                }}
                sx={{ borderRadius: '4px', width: '100%' }}
              >
                Clear
              </Button>
            </Grid>
              
            <Grid item xs={12} md={2}>
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  color={showFilters ? 'primary' : 'default'}
                >
                  <FilterListIcon />
                </IconButton>
            </Grid>
          </Grid>
          {/* Advanced Filters */}
          <Collapse in={showFilters}>
            <Box sx={{ 
              mt: 3, 
              p: 3, 
              backgroundColor: theme.palette.grey[50], 
              borderRadius: '4px',
              border: `1px solid ${theme.palette.grey[200]}`
            }}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <FilterListIcon color="primary" />
                Advanced Filters
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      color: theme.palette.text.secondary 
                    }}>
                      Class
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedClassName}
                        onChange={(e) => { setSelectedClassName(e.target.value); setCurrentPage(1); }}
                        displayEmpty
                        sx={{ 
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          '& .MuiSelect-select': {
                            color: selectedClassName ? theme.palette.primary.main : theme.palette.text.secondary
                          }
                        }}
                      >
                        <MenuItem value="">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.7 }}>
                            <SchoolIcon fontSize="small" />
                            All Classes
                          </Box>
                        </MenuItem>
                        <MenuItem value="9th">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon fontSize="small" color="primary" />
                            9th Standard
                          </Box>
                        </MenuItem>
                        <MenuItem value="10th">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon fontSize="small" color="primary" />
                            10th Standard
                          </Box>
                        </MenuItem>
                        <MenuItem value="11th">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon fontSize="small" color="primary" />
                            11th Standard
                          </Box>
                        </MenuItem>
                        <MenuItem value="12th">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon fontSize="small" color="primary" />
                            12th Standard
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      color: theme.palette.text.secondary 
                    }}>
                      Course
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedCourse}
                        onChange={(e) => { setSelectedCourse(e.target.value); setCurrentPage(1); }}
                        displayEmpty
                        sx={{ 
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          '& .MuiSelect-select': {
                            color: selectedCourse ? theme.palette.primary.main : theme.palette.text.secondary
                          }
                        }}
                      >
                        <MenuItem value="">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.7 }}>
                            <BusinessIcon fontSize="small" />
                            All Courses
                          </Box>
                        </MenuItem>
                        {courses.map((course) => (
                          <MenuItem key={course._id || course.id} value={course._id || course.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BusinessIcon fontSize="small" color="primary" />
                              <Typography variant="body2" sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '200px'
                              }}>
                                {course.name}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      color: theme.palette.text.secondary 
                    }}>
                      Batch
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={selectedBatch}
                        onChange={(e) => { setSelectedBatch(e.target.value); setCurrentPage(1); }}
                        displayEmpty
                        sx={{ 
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          '& .MuiSelect-select': {
                            color: selectedBatch ? theme.palette.primary.main : theme.palette.text.secondary
                          }
                        }}
                      >
                        <MenuItem value="">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.7 }}>
                            <PersonIcon fontSize="small" />
                            All Batches
                          </Box>
                        </MenuItem>
                        {batches.map((batch) => (
                          <MenuItem key={batch._id || batch.id} value={batch._id || batch.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon fontSize="small" color="primary" />
                              <Typography variant="body2" sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '200px'
                              }}>
                                {batch.batchName || batch.name}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ 
                      mb: 1, 
                      fontWeight: 600, 
                      color: theme.palette.text.secondary 
                    }}>
                      Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCourse('');
                          setSelectedBatch('');
                          setSelectedClassName('');
                          setCurrentPage(1);
                        }}
                        sx={{ 
                          borderRadius: '4px',
                          flex: 1,
                          borderColor: theme.palette.grey[300],
                          color: theme.palette.text.secondary,
                          '&:hover': {
                            borderColor: theme.palette.error.main,
                            color: theme.palette.error.main,
                            backgroundColor: 'rgba(244, 67, 54, 0.04)'
                          }
                        }}
                      >
                        Clear All
                      </Button>
                <IconButton
                        onClick={() => setShowFilters(false)}
                        size="small"
                        sx={{
                          border: `1px solid ${theme.palette.grey[300]}`,
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: theme.palette.grey[100]
                          }
                        }}
                      >
                        <FilterListIcon fontSize="small" />
                </IconButton>
                    </Box>
              </Box>
            </Grid>
          </Grid>

              {/* Active Filters Display */}
              {(selectedClassName || selectedCourse || selectedBatch) && (
                <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.grey[200]}` }}>
                  <Typography variant="subtitle2" sx={{ 
                    mb: 1, 
                    fontWeight: 600, 
                    color: theme.palette.text.secondary 
                  }}>
                    Active Filters:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedClassName && (
                      <Chip
                        label={`Class: ${selectedClassName}`}
                        size="small"
                        onDelete={() => { setSelectedClassName(''); setCurrentPage(1); }}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: '4px' }}
                      />
                    )}
                    {selectedCourse && (
                      <Chip
                        label={`Course: ${courses.find(c => (c._id || c.id) === selectedCourse)?.name || selectedCourse}`}
                        size="small"
                        onDelete={() => { setSelectedCourse(''); setCurrentPage(1); }}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: '4px' }}
                      />
                    )}
                    {selectedBatch && (
                      <Chip
                        label={`Batch: ${batches.find(b => (b._id || b.id) === selectedBatch)?.batchName || batches.find(b => (b._id || b.id) === selectedBatch)?.name || selectedBatch}`}
                        size="small"
                        onDelete={() => { setSelectedBatch(''); setCurrentPage(1); }}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: '4px' }}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>

   

      {/* Content */}
      {isLoading ? (
        <Card sx={{ borderRadius: '4px', p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading students...
          </Typography>
        </Card>
      ) : error ? (
        <Card sx={{ borderRadius: '4px', p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Error loading students
            </Typography>
            {error.message}
          </Alert>
          <Button variant="contained" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <Card sx={{ borderRadius: '4px', p: 8, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 3 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
            No Students Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            {searchTerm ? 'No students match your search criteria. Try adjusting your filters.' : 'Get started by adding your first student to the system.'}
          </Typography>
          {!searchTerm && canAddStudent && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowRegistration(true)}
              size="large"
                                      sx={{ borderRadius: '4px' }}
            >
              Add First Student
            </Button>
          )}
        </Card>
      ) : (
        <>
                    {/* Results Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredStudents.length} of {totalStudents} students
            </Typography>
          </Box>

          {/* Table View */}
            <Card sx={{ borderRadius: '4px', overflow: 'hidden' }}>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  fontSize: '0.8rem',
                  lineHeight: 1.2
                }}>
                  <thead>
                    <tr style={{ backgroundColor: theme.palette.grey[50] }}>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '60px' }}>
                        Image
                      </th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '140px' }}>
                        Student Name
                      </th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '120px' }}>
                        Registration No.
                      </th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '100px' }}>
                        Mobile No
                      </th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '100px' }}>
                        Admission On
                      </th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '180px' }}>
                        Course
                      </th>
                      <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '120px' }}>
                        Center
                      </th>
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '80px' }}>
                        Status
                      </th>
                        <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '60px' }}>
                          Action
                        </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id} style={{ 
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        '&:hover': { backgroundColor: theme.palette.action.hover }
                      }}>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <Avatar 
                            src={student.image || `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 1000}?w=64&h=64&fit=crop&crop=face`}
                            sx={{ 
                              width: 32, 
                              height: 32,
                              bgcolor: theme.palette.primary.main,
                              mx: 'auto'
                            }}
                          >
                            {student.studentName?.charAt(0) || 'S'}
                          </Avatar>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                            {student.studentName || 'N/A'}
                          </Typography>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <Chip
                            label={student.registrationNo || 'N/A'}
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.grey[700],
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: '20px'
                            }}
                          />
                        </td>
                        <td style={{ padding: '8px' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            {student.mobileNumber || 'N/A'}
                          </Typography>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            {student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                          </Typography>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                            {student.courseDetails?.courseId?.name || 'N/A'}
                          </Typography>
                        </td>
                        <td style={{ padding: '8px' }}>
                          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            {student.inchargeName || student.incharge_code || 'N/A'}
                          </Typography>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <Chip
                            label={student.isActive ? "Active" : "Inactive"}
                            size="small"
                            color={student.isActive ? "success" : "error"}
                            sx={{ fontWeight: 600, fontSize: '0.7rem', height: '20px' }}
                          />
                        </td>
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <IconButton
                              size="small"
                            onClick={(e) => handleActionClick(e, student)}
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                },
                              }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Card>
        </>
      )}

      {/* Pagination */}
      {totalStudents > 0 && (
        <Card sx={{ mt: 4, borderRadius: '4px' }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalStudents)} of {totalStudents} entries
                </Typography>
              </Grid>
              <Grid item>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton
                  showLastButton
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Action Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleActionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List sx={{ minWidth: 150, py: 1 }}>
          <ListItemButton onClick={handleView}>
            <ListItemIcon>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View" />
          </ListItemButton>
          
          {userRole === 'admin' && (
            <>
              <ListItemButton onClick={handleEdit}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Edit" />
              </ListItemButton>
              
              <ListItemButton onClick={handleActivate}>
                <ListItemIcon>
                  <ActivateIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={selectedStudent?.isActive ? "Deactivate" : "Activate"} />
              </ListItemButton>
              
              <ListItemButton onClick={handleModify}>
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Modify" />
              </ListItemButton>
              
              <ListItemButton
                onClick={() => {
                  handleDelete(selectedStudent._id);
                  handleActionClose();
                }}
                sx={{ color: 'error.main' }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Delete" />
              </ListItemButton>
            </>
          )}
        </List>
      </Popover>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        sx={{
          zIndex: 9999,
          '& .MuiSnackbarContent-root': {
            borderRadius: '4px',
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
    </Box>
  );
};

export default StudentsPage;
