import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Slide,
  Pagination,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useCenters, useCreateCenter, useUpdateCenter, useDeleteCenter } from '../hooks/useCenters';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CenterPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state
  const [formData, setFormData] = useState({
    centerName: '',
    centerHeadName: '',
    email: '',
    centerHeadMobileNo: '',
    fullAddress: '',
    state: '',
    district: '',
    password: ''
  });

  // Fetch data
  const { data: centersData, isLoading } = useCenters({
    page: currentPage,
    limit: pageSize,
    search: searchTerm
  });

  // Mutations
  const createCenterMutation = useCreateCenter();
  const updateCenterMutation = useUpdateCenter();
  const deleteCenterMutation = useDeleteCenter();

  // Get actual data or empty array
  const centers = centersData?.data || [];

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

  const handleOpenDialog = (center = null) => {
    if (center) {
      setEditingCenter(center);
      setFormData({
        centerName: center.centerName,
        centerHeadName: center.centerHeadName,
        email: center.email,
        centerHeadMobileNo: center.centerHeadMobileNo,
        fullAddress: center.fullAddress,
        state: center.state,
        district: center.district,
        password: center.password
      });
    } else {
      setEditingCenter(null);
      setFormData({
        centerName: '',
        centerHeadName: '',
        email: '',
        centerHeadMobileNo: '',
        fullAddress: '',
        state: '',
        district: '',
        password: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCenter(null);
    setFormData({
      centerName: '',
      centerHeadName: '',
      email: '',
      centerHeadMobileNo: '',
      fullAddress: '',
      state: '',
      district: '',
      password: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCenter) {
        // Update existing center
        await updateCenterMutation.mutateAsync({
          id: editingCenter._id,
          data: formData
        });
        showSnackbar('Center updated successfully!', 'success');
      } else {
        // Create new center
        await createCenterMutation.mutateAsync(formData);
        showSnackbar('Center created successfully!', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      try {
        await deleteCenterMutation.mutateAsync(id);
        showSnackbar('Center deleted successfully!', 'success');
      } catch (error) {
        showSnackbar(error.message || 'Delete failed', 'error');
      }
    }
  };

  const handleBlock = (id) => {
    showSnackbar('Block functionality will be implemented', 'info');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setCurrentPage(1);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>
          Dashboard | Our Center
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px 0 rgba(59, 130, 246, 0.35)',
            },
          }}
        >
          + Add New Center
        </Button>
      </Box>

      {/* Table Controls */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Show
          </Typography>
          <FormControl size="small" sx={{ minWidth: 80 }}>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              sx={{ borderRadius: 1 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            entries
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Search:
          </Typography>
          <TextField
            size="small"
            placeholder="Search centers..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                minWidth: 200,
              },
            }}
          />
        </Box>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: 2, boxShadow: 2, border: '1px solid #e5e7eb' }}>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>S.N</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Center Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Center Code</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Center Head</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Password</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading centers...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : centers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No Centers Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Get started by adding your first center
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
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
                        Add First Center
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                centers.map((center, index) => (
                  <TableRow key={center._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#3b82f6',
                          fontWeight: 500,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => handleOpenDialog(center)}
                      >
                        {center.centerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#3b82f6',
                          fontWeight: 500,
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => handleOpenDialog(center)}
                      >
                        {center.centerCode}
                      </Typography>
                    </TableCell>
                    <TableCell>{center.centerHeadName}</TableCell>
                    <TableCell>{center.centerHeadMobileNo}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          backgroundColor: '#f3f4f6',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}
                      >
                        {center.plainPassword}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          fontWeight: 500,
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Block">
                          <IconButton
                            size="small"
                            onClick={() => handleBlock(center._id)}
                            sx={{ color: '#374151' }}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(center)}
                            sx={{ color: '#3b82f6' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(center._id)}
                            sx={{ color: '#ef4444' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination - Only show if there's data */}
      {centers.length > 0 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing 1 to {centers.length} of {centers.length} entries
          </Typography>
          <Pagination
            count={1}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BusinessIcon sx={{ color: '#3b82f6' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editingCenter ? 'Edit Center' : 'Add New Center'}
            </Typography>
          </Box>
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Center Name"
                  value={formData.centerName}
                  onChange={(e) => handleInputChange('centerName', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Center Head Name"
                  value={formData.centerHeadName}
                  onChange={(e) => handleInputChange('centerHeadName', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={formData.centerHeadMobileNo}
                  onChange={(e) => handleInputChange('centerHeadMobileNo', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="District"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Full Address"
                  multiline
                  rows={3}
                  value={formData.fullAddress}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: '#6b7280',
                borderColor: '#d1d5db',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createCenterMutation.isPending || updateCenterMutation.isPending}
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
              {createCenterMutation.isPending || updateCenterMutation.isPending
                ? 'Saving...'
                : editingCenter
                ? 'Update Center'
                : 'Create Center'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        sx={{
          zIndex: 9999,
          '& .MuiSnackbarContent-root': {
            borderRadius: 2,
            fontWeight: 500,
          },
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CenterPage;
