import React, { useState } from 'react';
import { 
  useBatches, 
  useCreateBatch, 
  useUpdateBatch, 
  useDeleteBatch,
  useToggleBatchStatus
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
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const BatchPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({
    batchName: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    batchId: null,
    batchName: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loadingToggles, setLoadingToggles] = useState(new Set());

  // API hooks
  const { data: batchesData, isLoading, error, refetch } = useBatches({
    page: currentPage,
    limit: pageSize
  });
  const createBatchMutation = useCreateBatch();
  const updateBatchMutation = useUpdateBatch();
  const deleteBatchMutation = useDeleteBatch();
  const toggleStatusMutation = useToggleBatchStatus();

  // Handle paginated response structure
  const batches = batchesData?.data?.batches || batchesData?.batches || [];
  const pagination = batchesData?.data?.pagination || batchesData?.pagination || {};
  
  // Calculate totals
  const totalBatches = pagination.totalBatches || pagination.total || batches.length;
  const totalPages = pagination.totalPages || pagination.pages || Math.ceil(totalBatches / pageSize);

  const handleOpenDialog = (batch = null) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        batchName: batch.batchName || ''
      });
    } else {
      setEditingBatch(null);
      setFormData({
        batchName: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBatch(null);
    setFormData({
      batchName: ''
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
      const batchData = {
        batchName: formData.batchName
      };

      if (editingBatch) {
        await updateBatchMutation.mutateAsync({
          id: editingBatch._id,
          data: batchData
        });
        showSnackbar('Batch updated successfully!', 'success');
      } else {
        await createBatchMutation.mutateAsync(batchData);
        showSnackbar('Batch created successfully!', 'success');
      }
      
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (batchId, batchName) => {
    setDeleteDialog({
      open: true,
      batchId,
      batchName
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteBatchMutation.mutateAsync(deleteDialog.batchId);
      showSnackbar('Batch deleted successfully!', 'success');
      setDeleteDialog({ open: false, batchId: null, batchName: '' });
    } catch (error) {
      showSnackbar(error.message || 'Delete failed', 'error');
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, batchId: null, batchName: '' });
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

  const handleToggleActive = async (batchId, currentStatus) => {
    try {
      // Set loading state for this specific batch
      setLoadingToggles(prev => new Set(prev).add(batchId));
      
      const newStatus = !currentStatus;
      await toggleStatusMutation.mutateAsync({ id: batchId, isActive: newStatus });
      showSnackbar(`Batch ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to update batch status', 'error');
    } finally {
      // Remove loading state for this specific batch
      setLoadingToggles(prev => {
        const newSet = new Set(prev);
        newSet.delete(batchId);
        return newSet;
      });
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
        Error loading batches: {error.message}
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Batch Management</h1>
          <div className="flex gap-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: 'white',
                color: '#8b5cf6',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                }
              }}
            >
              Add Batch
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-bg-primary rounded-lg p-4 shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Active Batches</h2>
        
        {batches.length === 0 ? (
          <Box textAlign="center" py={4}>
            <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No batches available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first batch to get started
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }} aria-label="batch table">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Batch Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Created At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.875rem', py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow
                    key={batch._id}
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
                        maxWidth: 400,
                        wordWrap: 'break-word'
                      }}
                    >
                      {batch.batchName}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={batch.isActive ? "Active" : "Inactive"}
                        color={batch.isActive ? "success" : "error"}
                        size="small"
                        icon={batch.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                        sx={{ 
                          fontWeight: 600,
                          minWidth: 80,
                          '& .MuiChip-icon': { fontSize: '1rem' }
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: '0.875rem' }}>
                      {new Date(batch.createdAt).toLocaleDateString()}
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
                            checked={batch.isActive}
                            onChange={() => handleToggleActive(batch._id, batch.isActive)}
                            color="success"
                            size="small"
                            disabled={loadingToggles.has(batch._id)}
                          />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(batch)}
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
                          onClick={() => handleDelete(batch._id, batch.batchName)}
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
        {totalBatches > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalBatches)} of {totalBatches} batches
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

      {/* Add/Edit Batch Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBatch ? 'Edit Batch' : 'Add New Batch'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Batch Name"
              value={formData.batchName}
              onChange={(e) => handleInputChange('batchName', e.target.value)}
              margin="normal"
              required
              placeholder="e.g., 10TH BATCH 1 ( 11:30 - 04:30 )"
              helperText="Enter a descriptive batch name with timing if applicable"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.batchName.trim()}
          >
            {editingBatch ? 'Update' : 'Create'}
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
            Are you sure you want to delete the batch "{deleteDialog.batchName}"? This action cannot be undone.
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

export default BatchPage;
