import React, { useState } from 'react';
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
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
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
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useStudents, useDeleteStudent, useCourses, useBatches } from '../hooks';
import { useAuthContext } from '../contexts/AuthContext';
import StudentRegistrationPage from './StudentRegistrationPage';

const StudentsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  
  // Get user role from auth context
  const { userRole } = useAuthContext();

  // API hooks
  const { data: studentsData, isLoading, error, refetch } = useStudents({
    page: currentPage,
    limit: pageSize,
    search: searchTerm
  });
  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const { data: batchesData, isLoading: batchesLoading } = useBatches();
  const deleteStudentMutation = useDeleteStudent();

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
    
    return matchesSearch && matchesCourse && matchesBatch;
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
      deleteStudentMutation.mutate(studentId);
    }
  };

  const handleBlock = (studentId) => {
    // Implement block functionality
    console.log('Block student:', studentId);
  };

  // Show registration page if showRegistration is true
  if (showRegistration) {
    return (
      <StudentRegistrationPage 
        onBack={() => setShowRegistration(false)} 
      />
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Modern Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
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
              borderRadius: 3,
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
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
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
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  sx={{ borderRadius: 2 }}
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
                  setCurrentPage(1);
                }}
                sx={{ borderRadius: 2, width: '100%' }}
              >
                Clear
              </Button>
            </Grid>
              
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  color={showFilters ? 'primary' : 'default'}
                >
                  <FilterListIcon />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('table')}
                  color={viewMode === 'table' ? 'primary' : 'default'}
                >
                  <ViewListIcon />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <ViewModuleIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

   

      {/* Content */}
      {isLoading ? (
        <Card sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading students...
          </Typography>
        </Card>
      ) : error ? (
        <Card sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
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
        <Card sx={{ borderRadius: 3, p: 8, textAlign: 'center' }}>
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
              sx={{ borderRadius: 2 }}
            >
              Add First Student
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* View Toggle and Results Info */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredStudents.length} of {totalStudents} students
            </Typography>
          </Box>

          {/* Content View */}
          {viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredStudents.map((student) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={student._id}>
                  <Card sx={{ height: '100%', cursor: 'pointer' }}>
                    <CardContent sx={{ 
                      p: 2, 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      color: 'white',
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                      <Avatar sx={{ 
                        width: 64, 
                        height: 64, 
                        mx: 'auto', 
                        mb: 2,
                        bgcolor: 'rgba(255,255,255,0.2)'
                      }}>
                        {student.studentName?.charAt(0) || 'S'}
                      </Avatar>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                        {student.studentName || 'N/A'}
                      </Typography>
                      <Chip
                        label={student.inchargeCode || 'N/A'}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 600,
                          mb: 1
                        }}
                      />
                    </CardContent>
                    
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <SchoolIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 1 }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {student.courseDetails?.courseId?.name || 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BusinessIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 1 }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                          {student.inchargeName || student.incharge_code || 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 1 }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                          {student.mobileNumber || 'N/A'}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    {canViewActions && (
                      <CardContent sx={{ p: 2, pt: 0 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(student._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
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
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '120px' }}>
                        Icard
                      </th>
                   
                      <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '80px' }}>
                        Status
                      </th>
                      {canViewActions && (
                        <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}`, width: '60px' }}>
                          Action
                        </th>
                      )}
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
                            src={`https://images.unsplash.com/photo-${1500000000000 + Math.random() * 1000}?w=64&h=64&fit=crop&crop=face`}
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
                            label={student.inchargeCode || 'N/A'}
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
                            {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-GB') : 'N/A'}
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
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                borderRadius: 1,
                                px: 1,
                                py: 0.25,
                                fontWeight: 500,
                                textTransform: 'none',
                                fontSize: '0.65rem',
                                minHeight: '20px',
                                '&:hover': {
                                  backgroundColor: '#d97706',
                                },
                              }}
                            >
                              Issue
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                borderRadius: 1,
                                minWidth: 'auto',
                                px: 0.5,
                                py: 0.25,
                                minHeight: '20px',
                                '&:hover': {
                                  backgroundColor: '#2563eb',
                                },
                              }}
                            >
                              <DescriptionIcon sx={{ fontSize: 12 }} />
                            </Button>
                          </Box>
                        </td>
                       
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <Chip
                            label="Active"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 600, fontSize: '0.7rem', height: '20px' }}
                          />
                        </td>
                        {canViewActions && (
                          <td style={{ padding: '8px', textAlign: 'center' }}>
                            <IconButton
                              size="small"
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
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Card>
          )}
        </>
      )}

      {/* Pagination */}
      {totalStudents > 0 && (
        <Card sx={{ mt: 4, borderRadius: 3 }}>
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
    </Box>
  );
};

export default StudentsPage;
