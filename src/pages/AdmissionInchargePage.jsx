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
  InputAdornment,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import { useCenters } from '../hooks/useCenters';
import { useIncharges, useCreateIncharge, useUpdateIncharge, useDeleteIncharge } from '../hooks/useIncharges';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdmissionInchargePage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingIncharge, setEditingIncharge] = useState(null);
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
    incharge_name: '',
    email: '',
    mobile_number: '',
    aadhaar_number: '',
    full_address: '',
    center: ''
  });

  // Fetch data
  const { data: centersData, isLoading: centersLoading } = useCenters();
  const { data: inchargesData, isLoading } = useIncharges({
    page: currentPage,
    limit: pageSize,
    search: searchTerm
  });

  // Mutations
  const createInchargeMutation = useCreateIncharge();
  const updateInchargeMutation = useUpdateIncharge();
  const deleteInchargeMutation = useDeleteIncharge();

  // Get actual data or empty array - API returns {success, incharges, pagination}
  const incharges = inchargesData?.incharges || [];
  
  // Extract centers from API response - API returns {success, data, pagination}
  const centers = centersData || [];
  


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

  const handleOpenDialog = (incharge = null) => {
    if (incharge) {
      setEditingIncharge(incharge);
      setFormData({
        incharge_name: incharge.incharge_name,
        email: incharge.email,
        mobile_number: incharge.contact,
        aadhaar_number: incharge.aadhaar_number,
        full_address: incharge.full_address,
        center: incharge.center?.centerName || incharge.center || ''
      });
    } else {
      setEditingIncharge(null);
      setFormData({
        incharge_name: '',
        email: '',
        mobile_number: '',
        aadhaar_number: '',
        full_address: '',
        center: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingIncharge(null);
    setFormData({
      incharge_name: '',
      email: '',
      mobile_number: '',
      aadhaar_number: '',
      full_address: '',
      center: ''
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
      if (editingIncharge) {
        // Update existing incharge
        await updateInchargeMutation.mutateAsync({
          id: editingIncharge._id,
          data: formData
        });
        showSnackbar('Admission Incharge updated successfully!', 'success');
      } else {
        // Create new incharge
        await createInchargeMutation.mutateAsync(formData);
        showSnackbar('Admission Incharge created successfully!', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showSnackbar(error.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admission incharge?')) {
      try {
        await deleteInchargeMutation.mutateAsync(id);
        showSnackbar('Admission Incharge deleted successfully!', 'success');
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
          Dashboard | Admission Incharge
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
          + Add New Admission Incharge
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
            placeholder="Search incharges..."
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
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Incharge Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Incharge Code</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Center</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading admission incharges...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : incharges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PersonIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No Admission Incharges Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Get started by adding your first admission incharge
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        Debug: incharges.length = {incharges.length}, isLoading = {isLoading.toString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        Raw inchargesData: {JSON.stringify(inchargesData)}
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
                        Add First Incharge
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                incharges.map((incharge, index) => (
                  <TableRow key={incharge._id} hover>
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
                        onClick={() => handleOpenDialog(incharge)}
                      >
                        {incharge.incharge_name || 'N/A'}
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
                        onClick={() => handleOpenDialog(incharge)}
                      >
                        {incharge.incharge_code || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>{incharge.center?.centerName || incharge.center || 'N/A'}</TableCell>
                    <TableCell>{incharge.contact || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={incharge.status || 'Unknown'}
                        size="small"
                        sx={{
                          backgroundColor: (incharge.status === 'Active') ? '#dcfce7' : '#fef2f2',
                          color: (incharge.status === 'Active') ? '#166534' : '#dc2626',
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
                            onClick={() => handleBlock(incharge._id)}
                            sx={{ color: '#374151' }}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(incharge)}
                            sx={{ color: '#3b82f6' }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(incharge._id)}
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
      {incharges.length > 0 && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing 1 to {incharges.length} of {incharges.length} entries
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
            <PersonIcon sx={{ color: '#3b82f6' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editingIncharge ? 'Edit Admission Incharge' : 'Add New Admission Incharge'}
            </Typography>
          </Box>
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            {/* Debug Information */}
            <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.875rem' }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                <strong>Debug Info:</strong><br/>
                Centers loaded: {centers.length}<br/>
                Centers loading: {centersLoading ? 'Yes' : 'No'}<br/>
                Available centers: {centers.map(c => c.centerName).join(', ')}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Incharge Name"
                  value={formData.incharge_name}
                  onChange={(e) => handleInputChange('incharge_name', e.target.value)}
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
                  value={formData.mobile_number}
                  onChange={(e) => handleInputChange('mobile_number', e.target.value)}
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
                  label="Aadhaar Number"
                  value={formData.aadhaar_number}
                  onChange={(e) => handleInputChange('aadhaar_number', e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: 'text.secondary' }} />
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
                  label="Full Address"
                  multiline
                  rows={3}
                  value={formData.full_address}
                  onChange={(e) => handleInputChange('full_address', e.target.value)}
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
                <FormControl fullWidth required>
                  <InputLabel>Center</InputLabel>
                  <Select
                    value={formData.center}
                    onChange={(e) => handleInputChange('center', e.target.value)}
                    label="Center"
                    sx={{ borderRadius: 2 }}
                    disabled={centersLoading}
                  >
                    {centersLoading ? (
                      <MenuItem value="" disabled>
                        Loading centers...
                      </MenuItem>
                    ) : centers.length > 0 ? (
                      centers.map((center) => (
                        <MenuItem key={center._id} value={center.centerName}>
                          {center.centerName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        No centers available
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
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
              disabled={createInchargeMutation.isPending || updateInchargeMutation.isPending}
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
              {createInchargeMutation.isPending || updateInchargeMutation.isPending
                ? 'Saving...'
                : editingIncharge
                ? 'Update Incharge'
                : 'Create Incharge'}
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

export default AdmissionInchargePage;
