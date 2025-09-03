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
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Avatar,
  InputAdornment,
  Pagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useCollectFeeStudents, useCourses, useBatches } from '../hooks';

const CollectFeePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // API parameters
  const apiParams = {
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    className: selectedClassName,
    courseId: selectedCourse,
    batchId: selectedBatch
  };

  // Fetch data from APIs
  const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useCollectFeeStudents(apiParams);
  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const { data: batchesData, isLoading: batchesLoading } = useBatches();

  const students = studentsData?.data?.students || [];
  const courses = coursesData?.data?.courses || [];
  const batches = batchesData?.data?.batches || [];
  const pagination = studentsData?.data?.pagination || {};
  
  // Calculate totals
  const totalStudents = pagination.totalStudents || students.length;
  const totalPages = pagination.totalPages || Math.ceil(totalStudents / pageSize);

  // Class options
  const classOptions = ['9th', '10th', '11th', '12th'];

  const handleViewStudent = (student) => {
    navigate(`/fee/collect/${student.studentId}`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedClassName('');
    setSelectedCourse('');
    setSelectedBatch('');
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const calculatePendingAmount = (student) => {
    return student.pendingAmount || 0;
  };

  const calculatePaidAmount = (student) => {
    return student.paidAmount || 0;
  };

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
          Collect Fee
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Collect pending fees from students
        </Typography>
      </Box>

    
      {/* Search and Filters */}
      <Card sx={{ mb: 3, borderRadius: '4px' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' },
            gap: 3, 
            alignItems: 'center' 
          }}>
              <TextField
                fullWidth
                placeholder="Search by student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              sx={{ borderRadius: '4px' }}
              />
            
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClassName}
                  onChange={(e) => setSelectedClassName(e.target.value)}
                  label="Class"
                >
                  <MenuItem value="">All Classes</MenuItem>
                  {classOptions.map((className) => (
                    <MenuItem key={className} value={className}>
                      {className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  label="Course"
                  disabled={coursesLoading}
                >
                  <MenuItem value="">All Courses</MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <FormControl fullWidth>
                <InputLabel>Batch</InputLabel>
                <Select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  label="Batch"
                  disabled={batchesLoading}
                >
                  <MenuItem value="">All Batches</MenuItem>
                  {batches.map((batch) => (
                    <MenuItem key={batch._id} value={batch._id}>
                      {batch.batchName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                sx={{ borderRadius: '4px' }}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                sx={{ borderRadius: '4px' }}
                >
                  Export
                </Button>
              </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card sx={{ borderRadius: '4px', overflow: 'hidden' }}>
        {studentsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : studentsError ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">
              Error loading students: {studentsError.message}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Course & Batch</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Father's Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mobile Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Fee</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Paid Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Pending Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          src={student.image} 
                          sx={{ bgcolor: 'primary.main' }}
                        >
                          {student.studentName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {student.studentName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {student.registrationNo}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.course || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.batch || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.className}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.fathersName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.mobileNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{student.totalFee?.toLocaleString() || '0'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        ₹{calculatePaidAmount(student).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                        ₹{calculatePendingAmount(student).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewStudent(student)}
                        sx={{ borderRadius: '4px' }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Pagination */}
      {totalStudents > 0 && (
        <Card sx={{ mt: 4, borderRadius: '4px' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalStudents)} of {totalStudents} entries
                </Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
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
              </Box>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                showFirstButton
                showLastButton
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CollectFeePage;
