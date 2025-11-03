import React, { useState, useRef } from 'react';
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
import { useStudents, useCourses } from '../hooks';
import { useDebounce } from '../hooks';
import { studentService } from '../services/apiService';
import { useQueryClient } from '@tanstack/react-query';
import { useIDCard } from '../hooks/useIDCard';
import IDCard from './IDCard';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';

const StudentIDCardTable = ({ onViewCard, onEditCard, onGenerateCard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingStates, setLoadingStates] = useState({});
  const [downloadingId, setDownloadingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const queryClient = useQueryClient();
  const { bulkCardSettings } = useIDCard();

  // Debounced search like StudentsPage
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isSearching = searchTerm !== debouncedSearchTerm;

  // Fetch courses data
  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const courses = coursesData?.items || coursesData?.data?.items || [];

  // Fetch students data (server-side pagination + filters)
  const { data: studentsResponse, isLoading, error } = useStudents({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm,
    courseId: selectedCourse || ''
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

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
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

  const handleDirectDownload = async (student) => {
    if (!student.idCardIssued) {
      setSnackbar({
        open: true,
        message: 'ID Card is not issued for this student.',
        severity: 'warning'
      });
      return;
    }

    setDownloadingId(student._id);
    
    try {
      // Format student data for ID card
      const studentData = {
        name: student.studentName || '',
        fatherName: student.fathersName || '',
        studentId: student.registrationNo || '',
        class: student.className || '',
        course: student.courseDetails?.courseId?.name || '',
        address: student.presentAddress?.fullAddress ? 
          `${student.presentAddress.fullAddress}, ${student.presentAddress.district || ''}, ${student.presentAddress.state || ''} - ${student.presentAddress.pincode || ''}` : '',
        contactNo: student.mobileNumber || '',
        photoUrl: student.image || null
      };

      // Create temporary container for ID card
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '420px';
      tempContainer.style.height = '600px';
      document.body.appendChild(tempContainer);

      // Create root and render ID card
      const root = createRoot(tempContainer);
      root.render(
        <IDCard
          studentData={studentData}
          customStyles={bulkCardSettings.customStyles}
          size={bulkCardSettings.size || 'medium'}
          showDownloadButton={false}
        />
      );

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find the card element - IDCard renders a Box containing a Card
      let cardElement = tempContainer.querySelector('div[class*="MuiCard"]') || 
                       tempContainer.querySelector('div[class*="MuiBox"]') ||
                       tempContainer.firstElementChild;
      
      if (!cardElement) {
        // Wait a bit more and try again
        await new Promise(resolve => setTimeout(resolve, 300));
        cardElement = tempContainer.querySelector('div[class*="MuiCard"]') || 
                     tempContainer.querySelector('div[class*="MuiBox"]') ||
                     tempContainer.firstElementChild;
      }
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Wait a bit more for images and fonts to load
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture with html2canvas - target the entire container
      const canvas = await html2canvas(tempContainer.firstElementChild || tempContainer, {
        backgroundColor: null,
        scale: 4,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 15000,
        removeContainer: false,
        foreignObjectRendering: false,
        letterRendering: true,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Khand:wght@300;400;500;600;700&display=swap');
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `ID_Card_${studentData.studentId || studentData.name}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      root.unmount();
      document.body.removeChild(tempContainer);

      setSnackbar({
        open: true,
        message: 'ID Card downloaded successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error downloading ID card:', error);
      
      // Try fallback with lower scale
      try {
        const tempContainer = document.body.querySelector('[style*="-9999px"]');
        if (tempContainer) {
          const cardElement = tempContainer.querySelector('div') || tempContainer;
          const canvas = await html2canvas(cardElement, {
            backgroundColor: null,
            scale: 3,
            useCORS: true,
            allowTaint: true,
            logging: false,
            imageTimeout: 10000
          });

          const link = document.createElement('a');
          link.download = `ID_Card_${student.studentName || 'student'}.png`;
          link.href = canvas.toDataURL('image/png', 1.0);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Cleanup
          if (tempContainer.parentNode) {
            tempContainer.parentNode.removeChild(tempContainer);
          }
        }
      } catch (fallbackError) {
        console.error('Fallback download failed:', fallbackError);
        setSnackbar({
          open: true,
          message: 'Failed to download ID card. Please try again.',
          severity: 'error'
        });
      }
    } finally {
      setDownloadingId(null);
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
              <InputLabel>Filter by Course</InputLabel>
              <Select
                value={selectedCourse}
                onChange={handleCourseChange}
                label="Filter by Course"
                disabled={coursesLoading}
              >
                <MenuItem value="">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    All Courses
                  </Box>
                </MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course._id || course.id} value={course._id || course.id}>
                    <Box sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '200px'
                    }}>
                      {course.name}
                    </Box>
                  </MenuItem>
                ))}
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
                                onClick={() => handleDirectDownload(student)}
                                disabled={downloadingId === student._id}
                              >
                                {downloadingId === student._id ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <DownloadIcon fontSize="small" />
                                )}
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
