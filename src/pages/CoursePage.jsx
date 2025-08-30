import React, { useState } from 'react';
import { 
  useCourses, 
  useCreateCourse, 
  useUpdateCourse, 
  useDeleteCourse,
  useToggleCourseActive,
  useCreateAdditionalCourse,
  useAdditionalCourses,
  useUpdateAdditionalCourse,
  useDeleteAdditionalCourse,
  useToggleAdditionalCourseActive
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
  Chip,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// Additional Courses Table Component
const AdditionalCoursesTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingToggles, setLoadingToggles] = useState(new Set());
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', serialNumber: '' });
  const [editDialog, setEditDialog] = useState(false);

  // API hooks for additional courses
  const { data: additionalCoursesData, isLoading, error, refetch } = useAdditionalCourses({
    page: currentPage,
    limit: pageSize
  });
  const updateAdditionalCourseMutation = useUpdateAdditionalCourse();
  const deleteAdditionalCourseMutation = useDeleteAdditionalCourse();
  const toggleActiveMutation = useToggleAdditionalCourseActive();

  // Handle paginated response structure
  const additionalCourses = additionalCoursesData?.items || additionalCoursesData?.data?.items || [];
  const pagination = additionalCoursesData?.data?.pagination || additionalCoursesData || {};
  
  // Calculate totals
  const totalCourses = pagination.total || additionalCourses.length;
  const totalPages = pagination.pages || Math.ceil(totalCourses / pageSize);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const handleToggleActive = async (courseId, currentStatus) => {
    try {
      setLoadingToggles(prev => new Set(prev).add(courseId));
      
      const newStatus = !currentStatus;
      await toggleActiveMutation.mutateAsync({ id: courseId, active: newStatus });
      // Show success message (you can add a snackbar here)
    } catch (error) {
      console.error('Failed to update course status:', error);
    } finally {
      setLoadingToggles(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setEditForm({
      name: course.name || '',
      serialNumber: course.serialNumber || ''
    });
    setEditDialog(true);
  };

  const handleCloseEdit = () => {
    setEditDialog(false);
    setEditingCourse(null);
    setEditForm({ name: '', serialNumber: '' });
    refetch();
  };

  const handleEditSubmit = async () => {
    try {
      await updateAdditionalCourseMutation.mutateAsync({
        id: editingCourse._id,
        data: {
          name: editForm.name,
          serialNumber: parseInt(editForm.serialNumber)
        }
      });
      handleCloseEdit();
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this additional course?')) {
      try {
        await deleteAdditionalCourseMutation.mutateAsync(courseId);
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading additional courses: {error.message}
      </Alert>
      );
  }

  return (
    <>
      {additionalCourses.length === 0 ? (
        <Box textAlign="center" py={4}>
          <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No additional courses available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first additional course to get started
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }} aria-label="additional courses table">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Course Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Serial Number</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Created At</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {additionalCourses.map((course) => (
                <TableRow
                  key={course._id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'grey.50' },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <TableCell 
                    component="th" 
                    scope="row"
                    sx={{ 
                      fontWeight: 500, 
                      fontSize: '0.875rem',
                      maxWidth: 300,
                      wordWrap: 'break-word'
                    }}
                  >
                    {course.name}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {course.serialNumber}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={course.isActive ? "Active" : "Inactive"}
                      color={course.isActive ? "success" : "error"}
                      size="small"
                      icon={course.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                      sx={{ 
                        fontWeight: 600,
                        minWidth: 80,
                        '& .MuiChip-icon': { fontSize: '1rem' }
                      }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center" sx={{ width: 200 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexWrap: 'nowrap'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                        <Switch
                          checked={course.isActive}
                          onChange={() => handleToggleActive(course._id, course.isActive)}
                          color="success"
                          size="small"
                          disabled={loadingToggles.has(course._id)}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(course)}
                        sx={{ 
                          color: 'primary.main',
                          '&:hover': { backgroundColor: 'primary.50' },
                          width: 32,
                          height: 32
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(course._id)}
                        sx={{ 
                          color: 'error.main',
                          '&:hover': { backgroundColor: 'error.50' },
                          width: 32,
                          height: 32
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination Controls */}
      {totalCourses > 0 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCourses)} of {totalCourses} additional courses
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                sx={{ height: 40 }}
              >
                <MenuItem value={10}>10 per page</MenuItem>
                <MenuItem value={20}>20 per page</MenuItem>
                <MenuItem value={50}>50 per page</MenuItem>
                <MenuItem value={100}>100 per page</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
            size="large"
          />
        </Box>
      )}

      {/* Edit Additional Course Dialog */}
      <Dialog open={editDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Additional Course
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Course Name"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Serial Number"
              type="number"
              value={editForm.serialNumber}
              onChange={(e) => setEditForm(prev => ({ ...prev, serialNumber: e.target.value }))}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            disabled={!editForm.name || !editForm.serialNumber}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loadingToggles, setLoadingToggles] = useState(new Set());
  const [additionalCourseDialog, setAdditionalCourseDialog] = useState(false);
  const [additionalCourseForm, setAdditionalCourseForm] = useState({
    name: '',
    serialNumber: ''
  });

  // API hooks
  const { data: coursesData, isLoading, error, refetch } = useCourses({
    page: currentPage,
    limit: pageSize
  });
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const toggleActiveMutation = useToggleCourseActive();
  const createAdditionalCourseMutation = useCreateAdditionalCourse();

  // Handle paginated response structure: { items: [...], page, limit, total, pages }
  const courses = coursesData?.items || coursesData?.data?.items || [];
  const pagination = coursesData?.data?.pagination || coursesData || {};
  
  // Calculate totals
  const totalCourses = pagination.total || courses.length;
  const totalPages = pagination.pages || Math.ceil(totalCourses / pageSize);
  


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

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1);
  };

  const handleToggleActive = async (courseId, currentStatus) => {
    try {
      // Set loading state for this specific course
      setLoadingToggles(prev => new Set(prev).add(courseId));
      
      const newStatus = !currentStatus;
      await toggleActiveMutation.mutateAsync({ id: courseId, active: newStatus });
      showSnackbar(`Course ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to update course status', 'error');
    } finally {
      // Remove loading state for this specific course
      setLoadingToggles(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const handleOpenAdditionalCourseDialog = () => {
    setAdditionalCourseForm({ name: '', serialNumber: '' });
    setAdditionalCourseDialog(true);
  };

  const handleCloseAdditionalCourseDialog = () => {
    setAdditionalCourseDialog(false);
    setAdditionalCourseForm({ name: '', serialNumber: '' });
  };

  const handleAdditionalCourseInputChange = (field, value) => {
    setAdditionalCourseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdditionalCourseSubmit = async () => {
    try {
      const courseData = {
        name: additionalCourseForm.name,
        serialNumber: parseInt(additionalCourseForm.serialNumber)
      };

      await createAdditionalCourseMutation.mutateAsync(courseData);
      showSnackbar('Additional course created successfully!', 'success');
      handleCloseAdditionalCourseDialog();
    } catch (error) {
      showSnackbar(error.message || 'Failed to create additional course', 'error');
    }
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
          <div className="flex gap-2">
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
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenAdditionalCourseDialog()}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Add Additional Course
            </Button>
          </div>
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
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }} aria-label="course table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Fee</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>EMI Fee</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Serial Number</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course, index) => (
                  <TableRow
                    key={course._id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: 'grey.50' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        fontWeight: 500, 
                        fontSize: '0.875rem',
                        maxWidth: 300,
                        wordWrap: 'break-word'
                      }}
                    >
                      {course.name}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <CurrencyRupeeIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {course.fee?.toLocaleString()}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.875rem' }}>
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <CurrencyRupeeIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {course.emiFee?.toLocaleString()}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {course.serialNumber}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={course.isActive ? "Active" : "Inactive"}
                        color={course.isActive ? "success" : "error"}
                        size="small"
                        icon={course.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: 80,
                          '& .MuiChip-icon': { fontSize: '1rem' }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ width: 200 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'nowrap'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 60 }}>
                          <Switch
                            checked={course.isActive}
                            onChange={() => handleToggleActive(course._id, course.isActive)}
                            color="success"
                            size="small"
                            disabled={loadingToggles.has(course._id)}
                          />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(course)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { backgroundColor: 'primary.50' },
                            width: 32,
                            height: 32
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(course._id, course.name)}
                          sx={{ 
                            color: 'error.main',
                            '&:hover': { backgroundColor: 'error.50' },
                            width: 32,
                            height: 32
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination Controls */}
        {totalCourses > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCourses)} of {totalCourses} courses
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  sx={{ height: 40 }}
                >
                  <MenuItem value={10}>10 per page</MenuItem>
                  <MenuItem value={20}>20 per page</MenuItem>
                  <MenuItem value={50}>50 per page</MenuItem>
                  <MenuItem value={100}>100 per page</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              size="large"
            />
          </Box>
        )}
      </div>

      {/* Additional Courses Section */}
      <div className="bg-bg-primary rounded-lg p-4 shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Additional Courses</h2>
        
        <AdditionalCoursesTable />
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

      {/* Add Additional Course Dialog */}
      <Dialog open={additionalCourseDialog} onClose={handleCloseAdditionalCourseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Additional Course
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Course Name"
              value={additionalCourseForm.name}
              onChange={(e) => handleAdditionalCourseInputChange('name', e.target.value)}
              margin="normal"
              required
              placeholder="e.g., Additional Course"
            />
            <TextField
              fullWidth
              label="Serial Number"
              type="number"
              value={additionalCourseForm.serialNumber}
              onChange={(e) => handleAdditionalCourseInputChange('serialNumber', e.target.value)}
              margin="normal"
              required
              placeholder="e.g., 1"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdditionalCourseDialog}>Cancel</Button>
          <Button 
            onClick={handleAdditionalCourseSubmit} 
            variant="contained"
            disabled={!additionalCourseForm.name || !additionalCourseForm.serialNumber}
          >
            Create Additional Course
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CoursePage;
