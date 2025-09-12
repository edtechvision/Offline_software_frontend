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
  TablePagination,
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
  CircularProgress
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

const StudentIDCardTable = ({ onViewCard, onEditCard, onGenerateCard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch students data
  const { data: studentsResponse, isLoading, error } = useStudents({
    page: page + 1,
    limit: rowsPerPage,
    search: searchTerm
  });

  const students = studentsResponse?.students || studentsResponse?.data?.students || [];
  const pagination = studentsResponse?.pagination || {};
  const totalStudents = pagination.totalStudents || students.length;

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mobileNumber?.includes(searchTerm);
    
    const matchesClass = !selectedClass || student.className === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setPage(0);
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

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              icon={<BadgeIcon />}
              label={`${filteredStudents.length} Students`}
              color="primary"
              variant="outlined"
            />
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
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
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
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={totalStudents}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{ borderTop: 1, borderColor: 'divider' }}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentIDCardTable;
