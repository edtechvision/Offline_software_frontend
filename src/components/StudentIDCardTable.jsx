import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
  Button,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Badge as BadgeIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useStudents } from '../hooks/useStudents';
import { useDebounce } from '../hooks';
import { studentService } from '../services/apiService';
import { useQueryClient } from '@tanstack/react-query';

const StudentIDCardTable = ({ onViewCard, onEditCard, onGenerateCard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingStates, setLoadingStates] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const queryClient = useQueryClient();

  // Debounced search like StudentsPage
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isSearching = searchTerm !== debouncedSearchTerm;

  // Fetch students data (server-side pagination + filters)
  const { data: studentsResponse, isLoading, error } = useStudents({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm,
    className: selectedClass || ''
  });

  const students = studentsResponse?.students || studentsResponse?.data?.students || [];
  const pagination = studentsResponse?.data?.pagination || studentsResponse?.pagination || {};
  const totalStudents = pagination.total || pagination.totalStudents || studentsResponse?.data?.totalStudents || students.length;
  const totalPages = pagination.totalPages || Math.ceil((totalStudents || 0) / pageSize);
  const serverCurrentPage = pagination.currentPage || currentPage;

  // Server handles filtering; use returned page of students directly
  const filteredStudents = students;

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setCurrentPage(1);
  };

  const handleIdCardToggle = async (studentId, currentStatus) => {
    const newStatus = !currentStatus;
    
    // Set loading state for this specific student
    setLoadingStates(prev => ({ ...prev, [studentId]: true }));
    
    try {
      await studentService.updateIdCardStatus(studentId, newStatus);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `ID Card status updated to ${newStatus ? 'Issued' : 'Not Issued'}`,
        severity: 'success'
      });
      
      // Invalidate and refetch students data
      queryClient.invalidateQueries({ queryKey: ['students'] });
      
    } catch (error) {
      console.error('Error updating ID card status:', error);
      
      // Show error message
      setSnackbar({
        open: true,
        message: 'Failed to update ID card status. Please try again.',
        severity: 'error'
      });
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.district || ''}, ${address.state || ''}`.replace(/^,\s*|,\s*$/g, '') || 'N/A';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Loading students...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading students: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Student ID Card Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and generate ID cards for all students
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Search Students"
              placeholder="Search by name, registration number, or mobile..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel>Filter by Class</InputLabel>
              <Select
                value={selectedClass}
                onChange={handleClassChange}
                label="Filter by Class"
              >
                <MenuItem value="">All Classes</MenuItem>
                <MenuItem value="9th">9th Standard</MenuItem>
                <MenuItem value="10th">10th Standard</MenuItem>
                <MenuItem value="11th">11th Standard</MenuItem>
                <MenuItem value="12th">12th Standard</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              icon={<BadgeIcon />}
              label={`Showing ${students.length} of ${totalStudents} Students`}
              color="primary"
              variant="outlined"
            />
            {isSearching && <CircularProgress size={20} />}
          </Box>
        </Box>
      </Paper>

      {/* Students Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: 'grey.50' }}>
                <TableRow>
                  <TableCell>Photo</TableCell>
                  <TableCell>Student Details</TableCell>
                  <TableCell>Registration Info</TableCell>
                  <TableCell>Course Details</TableCell>
                  <TableCell>Contact Info</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">ID Card Issued</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student._id} hover>
                    <TableCell>
                      <Avatar
                        src={student.image}
                        sx={{ width: 56, height: 56 }}
                      >
                        {student.studentName?.charAt(0) || 'S'}
                      </Avatar>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {student.studentName || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Father: {student.fathersName || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          DOB: {formatDate(student.dateOfBirth)}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Chip
                          label={student.registrationNo || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          <SchoolIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                          Class: {student.className || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.courseDetails?.courseId?.name || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fee: ₹{student.courseDetails?.courseFee || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Session: {student.courseDetails?.session || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          {student.mobileNumber || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          {formatAddress(student.presentAddress)}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={student.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={student.isActive ? 'success' : 'error'}
                        variant="filled"
                      />
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {loadingStates[student._id] ? (
                          <CircularProgress size={20} />
                        ) : (
                          <FormControlLabel
                            control={
                              <Switch
                                checked={student.idCardIssued || false}
                                onChange={() => handleIdCardToggle(student._id, student.idCardIssued || false)}
                                color="primary"
                                size="small"
                              />
                            }
                            label=""
                            sx={{ margin: 0 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {student.idCardIssued ? (
                          <>
                            <Tooltip title="View ID Card">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => onViewCard && onViewCard(student)}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Edit ID Card">
                              <IconButton
                                size="small"
                                color="secondary"
                                onClick={() => onEditCard && onEditCard(student)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Download ID Card">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => onGenerateCard && onGenerateCard(student)}
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            ID Card not issued
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ 
            borderTop: 1, borderColor: 'divider', p: 2,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select value={pageSize} onChange={handleChangeRowsPerPage}>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary">
                Showing {((serverCurrentPage - 1) * pageSize) + 1} to {Math.min(serverCurrentPage * pageSize, totalStudents)} of {totalStudents} entries
              </Typography>
            </Box>
            <Pagination
              count={totalPages}
              page={serverCurrentPage}
              onChange={handleChangePage}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentIDCardTable;
