import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Settings as SettingsIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useStudents } from '../hooks/useStudents';
import { useIDCard } from '../hooks/useIDCard';
import IDCard from './IDCard';
import IDCardAdminForm from './IDCardAdminForm';

const IDCardGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(12);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCustomization, setShowCustomization] = useState(false);
  
  // Use global ID card settings
  const { bulkCardSettings } = useIDCard();
  const cardSize = bulkCardSettings.size;
  const globalStyles = bulkCardSettings.customStyles;

  // Fetch students data
  const { data: studentsResponse, isLoading, error } = useStudents({
    page: 1,
    limit: 1000, // Get all students for gallery view
    search: searchTerm
  });

  const students = studentsResponse?.students || studentsResponse?.data?.students || [];

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mobileNumber?.includes(searchTerm);
    
    const matchesClass = !selectedClass || student.className === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // Pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredStudents.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredStudents.length / cardsPerPage);

  // Convert student data to ID card format
  const formatStudentData = (student) => ({
    name: student.studentName || '',
    fatherName: student.fathersName || '',
    studentId: student.registrationNo || '',
    class: student.className || '',
    course: student.courseDetails?.courseId?.name || '',
    address: student.presentAddress?.fullAddress ? 
      `${student.presentAddress.fullAddress}, ${student.presentAddress.district}, ${student.presentAddress.state} - ${student.presentAddress.pincode}` : '',
    contactNo: student.mobileNumber || '',
    photoUrl: student.image || null
  });

  const handleCustomizeCard = (student) => {
    setSelectedStudent(student);
    setShowCustomization(true);
  };

  const handleDownloadCard = async (student) => {
    // Implementation for downloading individual card
    console.log('Download card for:', student.studentName);
  };

  const handlePrintCard = (student) => {
    // Implementation for printing individual card
    console.log('Print card for:', student.studentName);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2 }}>Loading ID cards...</Typography>
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
          ID Card Gallery
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all student ID cards in one place
        </Typography>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <TextField
              fullWidth
              label="Search Students"
              placeholder="Search by name, registration number, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Box>
          
          <Box sx={{ minWidth: 180 }}>
            <FormControl fullWidth>
              <InputLabel>Class Filter</InputLabel>
              <Select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                label="Class Filter"
              >
                <MenuItem value="">All Classes</MenuItem>
                <MenuItem value="9th">9th Standard</MenuItem>
                <MenuItem value="10th">10th Standard</MenuItem>
                <MenuItem value="11th">11th Standard</MenuItem>
                <MenuItem value="12th">12th Standard</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setSelectedClass('');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
            <Chip 
              label={`${filteredStudents.length} Cards`}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      </Paper>

      {/* ID Cards Grid */}
      {currentCards.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No ID cards found
          </Typography>
          <Typography color="text.secondary">
            {searchTerm || selectedClass ? 'Try adjusting your filters' : 'No students available'}
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentCards.map((student) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={student._id}>
                <Card sx={{ 
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ p: 2 }}>
                    {/* Student Info Header */}
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        {student.studentName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {student.registrationNo}
                      </Typography>
                    </Box>

                    {/* ID Card Preview */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mb: 2,
                      transform: cardSize === 'large' ? 'scale(0.8)' : cardSize === 'medium' ? 'scale(0.7)' : 'scale(0.6)',
                      transformOrigin: 'center'
                    }}>
                      <IDCard
                        studentData={formatStudentData(student)}
                        customStyles={globalStyles}
                        size={cardSize}
                      />
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="Customize">
                        <IconButton
                          size="small"
                          onClick={() => handleCustomizeCard(student)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => handleDownloadCard(student)}
                          color="secondary"
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Print">
                        <IconButton
                          size="small"
                          onClick={() => handlePrintCard(student)}
                          color="info"
                        >
                          <PrintIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Student Status */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Chip
                        label={student.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={student.isActive ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Customization Dialog */}
      <Dialog
        open={showCustomization}
        onClose={() => setShowCustomization(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          Customize ID Card - {selectedStudent?.studentName}
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <IDCardAdminForm
              initialStudentData={formatStudentData(selectedStudent)}
              isCustomizing={true}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomization(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IDCardGallery;
