import React, { useState } from 'react';
import { 
  useCourses, 
  useCreateCourse, 
  useUpdateCourse, 
  useDeleteCourse 
} from '../hooks';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  CurrencyRupee as CurrencyRupeeIcon
} from '@mui/icons-material';

const CoursePage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    fee: '',
    emiFee: '',
    serialNumber: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    courseId: null,
    courseName: ''
  });

  // API hooks
  const { data: coursesData, isLoading, error } = useCourses();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  // Handle paginated response structure: { items: [...], page, limit, total, pages }
  const courses = coursesData?.items || coursesData?.data?.items || [];
  


  const handleOpenDialog = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name || '',
        fee: course.fee || '',
        emiFee: course.emiFee || '',
        serialNumber: course.serialNumber || ''
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        fee: '',
        emiFee: '',
        serialNumber: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCourse(null);
    setFormData({
      name: '',
      fee: '',
      emiFee: '',
      serialNumber: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const courseData = {
        name: formData.name,
        fee: parseInt(formData.fee),
        emiFee: parseInt(formData.emiFee),
        serialNumber: parseInt(formData.serialNumber)
      };

      if (editingCourse) {
        await updateCourseMutation.mutateAsync({
          id: editingCourse._id,
          data: courseData
        });
        showSnackbar('Course updated successfully!', 'success');
      } else {
        const result = await createCourseMutation.mutateAsync(courseData);
        showSnackbar('Course created successfully!', 'success');
      }
      
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (courseId, courseName) => {
    setDeleteDialog({
      open: true,
      courseId,
      courseName
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteCourseMutation.mutateAsync(deleteDialog.courseId);
      showSnackbar('Course deleted successfully!', 'success');
      setDeleteDialog({ open: false, courseId: null, courseName: '' });
    } catch (error) {
      showSnackbar(error.message || 'Delete failed', 'error');
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, courseId: null, courseName: '' });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading courses: {error.message}
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Course Management</h1>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: 'white',
              color: '#10b981',
              '&:hover': {
                backgroundColor: '#f0fdf4',
              }
            }}
          >
            Add Course
          </Button>
        </div>
      </div>
      
      <div className="bg-bg-primary rounded-lg p-4 shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Available Courses</h2>
    
        
        {courses.length === 0 ? (
          <Box textAlign="center" py={4}>
            <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No courses available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first course to get started
            </Typography>
         
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="course table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Fee</TableCell>
                  <TableCell align="right">EMI Fee</TableCell>
                  <TableCell align="right">Serial Number</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                                {courses.map((course, index) => {
          
                  return (
                    <TableRow
                      key={course._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {course.name}
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center">
                          <CurrencyRupeeIcon fontSize="small" />
                          {course.fee?.toLocaleString()}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box display="flex" alignItems="center">
                          <CurrencyRupeeIcon fontSize="small" />
                          {course.emiFee?.toLocaleString()}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{course.serialNumber}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label="Active"
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(course)}
                          sx={{ color: 'primary.main' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(course._id, course.name)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {/* Add/Edit Course Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Course Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Fee (₹)"
              type="number"
              value={formData.fee}
              onChange={(e) => handleInputChange('fee', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="EMI Fee (₹)"
              type="number"
              value={formData.emiFee}
              onChange={(e) => handleInputChange('emiFee', e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Serial Number"
              type="number"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange('serialNumber', e.target.value)}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name || !formData.fee || !formData.emiFee || !formData.serialNumber}
          >
            {editingCourse ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the course "{deleteDialog.courseName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CoursePage;
