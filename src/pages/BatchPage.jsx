import React, { useState } from 'react';
import { 
  useBatches, 
  useCreateBatch, 
  useUpdateBatch, 
  useDeleteBatch 
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
  Group as GroupIcon,
  Schedule as ScheduleIcon
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

  // API hooks
  const { data: batchesData, isLoading, error } = useBatches();
  const createBatchMutation = useCreateBatch();
  const updateBatchMutation = useUpdateBatch();
  const deleteBatchMutation = useDeleteBatch();

  // Debug: Log the data structure


  const batches = batchesData?.data?.batches || [];

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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="batch table">
              <TableHead>
                <TableRow>
                  <TableCell>Batch Name</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Created At</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow
                    key={batch._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {batch.batchName}
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(batch)}
                            sx={{ color: 'primary.main' }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(batch._id, batch.batchName)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={batch.isActive ? 'Active' : 'Inactive'}
                        color={batch.isActive ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">{new Date(batch.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Typography variant="caption" color="text.secondary">
                        ID: {batch._id.slice(-6)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
