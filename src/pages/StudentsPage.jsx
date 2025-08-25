import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Chip,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Pagination,
  Stack,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import StudentRegistrationPage from './StudentRegistrationPage';
import {
  Search as SearchIcon,
  FileDownload as ExportIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ThumbUp as ActivateIcon,
  Person as PersonIcon,
  Description as DocumentIcon,
  CloudUpload as UploadIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { useStudents, useDeleteStudent, useCourses, useBatches } from '../hooks';

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  
  // Role-based access control - this should come from your auth context
  const userRole = 'admission-incharge'; // Change this to test different roles

  // API hooks
  const { data: studentsData, isLoading, error } = useStudents({
    page: currentPage,
    limit: entriesPerPage,
    search: searchTerm
  });
  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useCourses();
  const { data: batchesData, isLoading: batchesLoading, error: batchesError } = useBatches();
  const deleteStudentMutation = useDeleteStudent();

  // Extract students from API response
  const students = studentsData?.data?.students || [];
  
  // Extract courses and batches from API response
  const courses = coursesData?.items || coursesData?.data?.items || [];
  const batches = batchesData?.data?.batches || batchesData?.batches || [];
  


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
  const isAdmin = userRole === 'main-admin';
  const isIncharge = userRole === 'admission-incharge';

  const handleMenuOpen = (event, student) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'error';
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
      {/* Page Title */}
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 600, color: '#1f2937' }}>
        Students
      </Typography>

      {/* Search and Controls */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="medium">
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  displayEmpty
                  disabled={coursesLoading}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>All Courses</em>
                  </MenuItem>
                  {coursesLoading ? (
                    <MenuItem disabled>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        Loading courses...
                      </Box>
                    </MenuItem>
                  ) : courses.length === 0 ? (
                    <MenuItem disabled>
                      No courses available
                    </MenuItem>
                  ) : (
                    courses.map((course) => (
                      <MenuItem key={course._id} value={course._id}>
                        {course.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="medium">
                <Select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  displayEmpty
                  disabled={batchesLoading}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>All Batches</em>
                  </MenuItem>
                  {batchesLoading ? (
                    <MenuItem disabled>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} />
                        Loading batches...
                      </Box>
                    </MenuItem>
                  ) : batches.length === 0 ? (
                    <MenuItem disabled>
                      No batches available
                    </MenuItem>
                  ) : (
                    batches.map((batch) => (
                      <MenuItem key={batch._id} value={batch._id}>
                        {batch.batchName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="medium">
                <Select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value={10}>10 entries</MenuItem>
                  <MenuItem value={25}>25 entries</MenuItem>
                  <MenuItem value={50}>50 entries</MenuItem>
                  <MenuItem value={100}>100 entries</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sx={{ textAlign: 'right' }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedCourse('');
                    setSelectedBatch('');
                    setSearchTerm('');
                  }}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    fontWeight: 500,
                    textTransform: 'none',
                    borderColor: '#d1d5db',
                    color: '#6b7280',
                    '&:hover': {
                      borderColor: '#9ca3af',
                      backgroundColor: '#f9fafb',
                    },
                  }}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ExportIcon />}
                  sx={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontWeight: 500,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#059669',
                    },
                  }}
                >
                  Export to Excel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Active Filters Indicator */}
      {(selectedCourse || selectedBatch || searchTerm) && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
            Active filters:
          </Typography>
          {searchTerm && (
            <Chip
              label={`Search: "${searchTerm}"`}
              size="small"
              onDelete={() => setSearchTerm('')}
              sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
            />
          )}
          {selectedCourse && (
            <Chip
              label={`Course: ${courses.find(c => c._id === selectedCourse)?.name || 'Unknown'}`}
              size="small"
              onDelete={() => setSelectedCourse('')}
              sx={{ backgroundColor: '#fef3c7', color: '#92400e' }}
            />
          )}
          {selectedBatch && (
            <Chip
              label={`Batch: ${batches.find(b => b._id === selectedBatch)?.batchName || 'Unknown'}`}
              size="small"
              onDelete={() => setSelectedBatch('')}
              sx={{ backgroundColor: '#dcfce7', color: '#166534' }}
            />
          )}
        </Box>
      )}

      {/* Add Student Button - Only for Admission Incharge */}
      {userRole === 'admission-incharge' && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#374151', mb: 0.5 }}>
              Student Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Add new students and manage existing records
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonIcon />}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              borderRadius: 2.5,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.875rem',
              boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.35)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
                            onClick={() => setShowRegistration(true)}
          >
            + Add New Student
          </Button>
        </Box>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f3f4f6', borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280' }}>
            <strong>Debug Info:</strong> Courses: {courses.length} | Batches: {batches.length} | Students: {students.length} | Filtered: {filteredStudents.length}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280', mt: 1 }}>
            <strong>Courses API:</strong> {coursesLoading ? 'Loading...' : coursesError ? `Error: ${coursesError.message}` : coursesData ? `Status: ${coursesData.success ? 'Success' : 'Failed'}` : 'No data'}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280', mt: 1 }}>
            <strong>Batches API:</strong> {batchesLoading ? 'Loading...' : batchesError ? `Error: ${batchesError.message}` : batchesData ? `Status: ${batchesData.success ? 'Success' : 'Failed'}` : 'No data'}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280', mt: 1 }}>
            <strong>Auth Token:</strong> {localStorage.getItem('authToken') ? 'Present' : 'Missing'}
          </Typography>
          {coursesData && (
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280', mt: 1 }}>
              <strong>Courses Response:</strong> {JSON.stringify(coursesData, null, 2)}
            </Typography>
          )}
          {batchesData && (
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#6b7280', mt: 1 }}>
              <strong>Batches Response:</strong> {JSON.stringify(batchesData, null, 2)}
            </Typography>
          )}
        </Box>
      )}

      {/* Students Table */}
      <Card sx={{ borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, fontSize: '0.75rem', width: '200px' }}>
                  Student
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, fontSize: '0.75rem', width: '140px' }}>
                  Registration No.
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, fontSize: '0.75rem', width: '120px' }}>
                  Mobile No.
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, fontSize: '0.75rem', width: '120px' }}>
                  Admission Date
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, minWidth: 200, fontSize: '0.75rem', width: '200px' }}>
                  Course
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, minWidth: 180, fontSize: '0.75rem', width: '180px' }}>
                  Center
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, fontSize: '0.75rem', width: '120px' }}>
                  I-Card
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, fontSize: '0.75rem', width: '100px' }}>
                  Photo
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, fontSize: '0.75rem', width: '100px' }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', py: 1.5, px: 1.5, fontSize: '0.75rem', width: '80px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Loading students...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      Error loading students: {error.message}
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PersonIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No Students Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {searchTerm ? 'No students match your search criteria' : 'Get started by adding your first student'}
                      </Typography>
                      {!searchTerm && (
                        <Button
                          variant="contained"
                          startIcon={<PersonIcon />}
                          onClick={() => setShowRegistration(true)}
                          sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            color: 'white',
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                            },
                          }}
                        >
                          Add First Student
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student, index) => (
                  <TableRow 
                    key={student._id} 
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                      '&:hover': { backgroundColor: '#f3f4f6' }
                    }}
                  >
                    <TableCell sx={{ py: 1.5, px: 1.5, width: '200px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={`https://images.unsplash.com/photo-${1500000000000 + index}?w=64&h=64&fit=crop&crop=face`}
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {student.studentName?.charAt(0) || 'S'}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.8rem' }}>
                          {student.studentName || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1.5, width: '140px' }}>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#374151', fontWeight: 500, fontSize: '0.75rem' }}>
                        {student.inchargeCode || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1.5, width: '120px' }}>
                      <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.75rem' }}>
                        {student.mobileNumber || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1.5, width: '120px' }}>
                      <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.75rem' }}>
                        {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1.5, minWidth: 200, width: '200px' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#374151',
                          lineHeight: 1.3,
                          wordWrap: 'break-word',
                          whiteSpace: 'normal',
                          fontSize: '0.75rem'
                        }}
                      >
                        {student.courseDetails?.courseId?.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1.5, minWidth: 180, width: '180px' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#374151',
                          lineHeight: 1.3,
                          wordWrap: 'break-word',
                          whiteSpace: 'normal',
                          fontSize: '0.75rem'
                        }}
                      >
                        {student.inchargeName || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1.5, width: '120px' }}>
                      <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            borderRadius: 1,
                            px: 1.5,
                            py: 0.25,
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: '0.7rem',
                            minHeight: '24px',
                            '&:hover': {
                              backgroundColor: '#d97706',
                            },
                          }}
                        >
                          Issue
                        </Button>
                        <Tooltip title="View I-Card">
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              borderRadius: 1,
                              minWidth: 'auto',
                              px: 0.75,
                              py: 0.25,
                              minHeight: '24px',
                              '&:hover': {
                                backgroundColor: '#2563eb',
                              },
                            }}
                          >
                            <DocumentIcon sx={{ fontSize: 14 }} />
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1.5, width: '100px' }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<UploadIcon />}
                        sx={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          borderRadius: 1,
                          px: 1.5,
                          py: 0.25,
                          fontWeight: 500,
                          textTransform: 'none',
                          fontSize: '0.7rem',
                          minHeight: '24px',
                          '&:hover': {
                            backgroundColor: '#059669',
                          },
                        }}
                      >
                        Upload
                      </Button>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1.5, width: '100px' }}>
                      <Chip
                        label="Active"
                        color="success"
                        size="small"
                        sx={{
                          fontWeight: 500,
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          height: '20px',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, px: 1.5, width: '80px' }}>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, student)}
                        size="small"
                        sx={{
                          color: '#3b82f6',
                          '&:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          },
                        }}
                      >
                        <MoreVertIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination */}
      <Card sx={{ mt: 3, borderRadius: 2, boxShadow: 1 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Showing 1 to {filteredStudents.length} of {students.length} entries
                {filteredStudents.length !== students.length && ` (filtered from ${students.length} total)`}
              </Typography>
            </Grid>
            <Grid item>
              <Stack spacing={1} direction="row" alignItems="center">
                <Pagination
                  count={Math.ceil(filteredStudents.length / entriesPerPage)}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            border: '1px solid #e5e7eb',
          },
        }}
      >
        {isAdmin && (
          <>
            <MenuItem onClick={() => handleAction('activate')} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <ActivateIcon sx={{ color: '#10b981', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary="Activate" />
            </MenuItem>
            <MenuItem onClick={() => handleAction('modify')} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <EditIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary="Modify" />
            </MenuItem>
            <MenuItem onClick={() => handleAction('delete')} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <DeleteIcon sx={{ color: '#ef4444', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </MenuItem>
          </>
        )}
        <MenuItem onClick={() => handleAction('view')} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <ViewIcon sx={{ color: '#6b7280', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="View" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StudentsPage;
