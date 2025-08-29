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
import { useIncharges, useCreateIncharge, useUpdateIncharge, useDeleteIncharge, useBlockIncharge } from '../hooks/useIncharges';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdmissionInchargePage = () => {
  // Add CSS animation for pulse effect
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Debug function to test the block API
  const testBlockAPI = async () => {
    try {
      console.log('Testing block API...');
      const testId = '68a861b5ef002037ffedda2f'; // Use the ID from your example
      const result = await inchargeService.blockIncharge(testId, true);
      console.log('Test result:', result);
      showSnackbar('API test completed - check console', 'info');
    } catch (error) {
      console.error('API test failed:', error);
      showSnackbar('API test failed - check console', 'error');
    }
  };
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

  // Block confirmation dialog state
  const [blockDialog, setBlockDialog] = useState({
    open: false,
    inchargeId: null,
    inchargeName: '',
    isBlocked: false
  });

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    inchargeId: null,
    inchargeName: ''
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

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    incharge_name: '',
    email: '',
    mobile_number: '',
    aadhaar_number: '',
    full_address: '',
    center: ''
  });

  // Fetch data
  const { data: centersData, centers, isLoading: centersLoading } = useCenters();
  const { data: inchargesData, isLoading } = useIncharges({
    page: currentPage,
    limit: pageSize,
    search: searchTerm
  });

  // Mutations
  const createInchargeMutation = useCreateIncharge();
  const updateInchargeMutation = useUpdateIncharge();
  const deleteInchargeMutation = useDeleteIncharge();
  const blockInchargeMutation = useBlockIncharge();

  // Get actual data or empty array - API returns {success, incharges, pagination}
  const incharges = inchargesData?.incharges || [];
  
  // Use centers from hook which already handles the data extraction
  
  // Helper function to get center name by ID
  const getCenterNameById = (centerId) => {
    const center = centers.find(c => c._id === centerId);
    return center ? center.centerName : '';
  };

  // Validation functions
  const validateAadhaar = (aadhaar) => {
    // Aadhaar must be exactly 12 digits
    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaar) return 'Aadhaar number is required';
    if (!aadhaarRegex.test(aadhaar)) return 'Aadhaar number must be exactly 12 digits';
    return '';
  };

  const validateMobile = (mobile) => {
    // Mobile must be exactly 10 digits starting with 6, 7, 8, or 9
    const mobileRegex = /^[6-9][0-9]{9}$/;
    if (!mobile) return 'Mobile number is required';
    if (!mobileRegex.test(mobile)) return 'Mobile number must be 10 digits starting with 6, 7, 8, or 9';
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters long';
    if (name.length > 50) return 'Name must be less than 50 characters';
    return '';
  };

  const validateAddress = (address) => {
    if (!address) return 'Address is required';
    if (address.length < 10) return 'Address must be at least 10 characters long';
    if (address.length > 200) return 'Address must be less than 200 characters';
    return '';
  };

  const validateCenter = (center) => {
    if (!center) return 'Center selection is required';
    return '';
  };

  // Validate all fields
  const validateForm = () => {
    const errors = {
      incharge_name: validateName(formData.incharge_name),
      email: validateEmail(formData.email),
      mobile_number: validateMobile(formData.mobile_number),
      aadhaar_number: validateAadhaar(formData.aadhaar_number),
      full_address: validateAddress(formData.full_address),
      center: validateCenter(formData.center)
    };
    
    setFormErrors(errors);
    
    // Check if there are any errors
    return !Object.values(errors).some(error => error !== '');
  };

  // Handle numeric input restrictions
  const handleNumericInput = (field, value) => {
    // Only allow digits
    const numericValue = value.replace(/[^0-9]/g, '');
    handleInputChange(field, numericValue);
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

  const handleOpenDialog = (incharge = null) => {
    if (incharge) {
      console.log('Editing incharge data:', incharge);
      setEditingIncharge(incharge);
      setFormData({
        incharge_name: incharge.incharge_name,
        email: incharge.email,
        mobile_number: incharge.mobile_number,
        aadhaar_number: incharge.aadhaar_number,
        full_address: incharge.full_address,
        center: incharge.center?._id || incharge.center || ''
      });
      console.log('Form data set for editing:', {
        incharge_name: incharge.incharge_name,
        email: incharge.email,
        mobile_number: incharge.mobile_number,
        aadhaar_number: incharge.aadhaar_number,
        full_address: incharge.full_address,
        center: incharge.center?._id || incharge.center || ''
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
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      showSnackbar('Please fix the validation errors before submitting', 'error');
      return;
    }
    
    // Log the form data being sent for debugging
    console.log('Form data being submitted:', formData);
    console.log('Center ID being sent:', formData.center);
    console.log('Center name for display:', getCenterNameById(formData.center));
    
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
      // Handle specific validation errors from API
      if (error.message && error.message.includes('validation failed')) {
        showSnackbar('Validation failed: Please check all required fields', 'error');
      } else if (error.message && error.message.includes('Aadhaar number')) {
        showSnackbar('Invalid Aadhaar number format. Must be exactly 12 digits.', 'error');
      } else if (error.message && error.message.includes('mobile')) {
        showSnackbar('Invalid mobile number format. Must be 10 digits starting with 6, 7, 8, or 9.', 'error');
      } else {
        showSnackbar(error.message || 'Operation failed', 'error');
      }
    }
  };

  const handleDelete = (id, inchargeName) => {
    setDeleteDialog({
      open: true,
      inchargeId: id,
      inchargeName: inchargeName
    });
  };

  const confirmDelete = async () => {
    try {
      const { inchargeId } = deleteDialog;
      await deleteInchargeMutation.mutateAsync(inchargeId);
      showSnackbar('Admission Incharge deleted successfully!', 'success');
      setDeleteDialog({ open: false, inchargeId: null, inchargeName: '' });
    } catch (error) {
      showSnackbar(error.message || 'Delete failed', 'error');
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, inchargeId: null, inchargeName: '' });
  };

  const handleBlock = (id, currentBlockStatus, inchargeName) => {
    setBlockDialog({
      open: true,
      inchargeId: id,
      inchargeName: inchargeName,
      isBlocked: currentBlockStatus
    });
  };

  const confirmBlock = async () => {
    try {
      const { inchargeId, isBlocked } = blockDialog;
      const action = isBlocked ? 'unblock' : 'block';
      console.log('Attempting to', action, 'incharge:', inchargeId, 'with block value:', !isBlocked);
      
      await blockInchargeMutation.mutateAsync({ id: inchargeId, block: !isBlocked });
      showSnackbar(`Admission Incharge ${action}ed successfully!`, 'success');
      setBlockDialog({ open: false, inchargeId: null, inchargeName: '', isBlocked: false });
    } catch (error) {
      console.error('Block operation failed:', error);
      
      // Handle specific error cases
      if (error.message && error.message.includes('validation failed')) {
        showSnackbar('Validation failed: Please check the request data', 'error');
      } else if (error.message && error.message.includes('not found')) {
        showSnackbar('Admission Incharge not found', 'error');
      } else if (error.message && error.message.includes('unauthorized')) {
        showSnackbar('You are not authorized to perform this action', 'error');
      } else {
        showSnackbar(error.message || 'Block/Unblock operation failed', 'error');
      }
    }
  };

  const closeBlockDialog = () => {
    setBlockDialog({ open: false, inchargeId: null, inchargeName: '', isBlocked: false });
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
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            Add New Admission Incharge
          </Button>
 
        </Box>
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
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Mobile</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Block Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading admission incharges...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : incharges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
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
                    <TableCell>{incharge.email || 'N/A'}</TableCell>
                    <TableCell>{incharge.mobile_number || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={incharge.isBlocked ? 'Blocked' : 'Active'}
                        size="small"
                        sx={{
                          backgroundColor: incharge.isBlocked ? '#fef2f2' : '#dcfce7',
                          color: incharge.isBlocked ? '#dc2626' : '#166534',
                          fontWeight: 500,
                          borderRadius: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={incharge.isBlocked ? 'Unblock' : 'Block'}>
                          <IconButton
                            size="small"
                            onClick={() => handleBlock(incharge._id, incharge.isBlocked, incharge.incharge_name)}
                            sx={{ 
                              color: incharge.isBlocked ? '#10b981' : '#ef4444',
                              '&:hover': {
                                backgroundColor: incharge.isBlocked ? '#d1fae5' : '#fee2e2'
                              }
                            }}
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
                            onClick={() => handleDelete(incharge._id, incharge.incharge_name)}
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
        <DialogTitle sx={{ pb: 2, borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: '8px', 
              bgcolor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PersonIcon sx={{ color: '#3b82f6', fontSize: '1.5rem' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
                {editingIncharge ? 'Edit Admission Incharge' : 'Add New Admission Incharge'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {editingIncharge ? 'Update the admission incharge information' : 'Create a new admission incharge for your center'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
           
            
            {/* Validation Summary */}
            {Object.values(formErrors).some(error => error !== '') && (
              <Box sx={{ 
                mb: 3, 
                p: 2, 
                bgcolor: '#fef2f2', 
                borderRadius: '8px', 
                border: '1px solid #fecaca',
                width: '100%'
              }}>
                <Typography variant="body2" sx={{ 
                  color: '#dc2626', 
                  fontWeight: 500,
                  mb: 1
                }}>
                  Please fix the following errors:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2 }}>
                  {Object.entries(formErrors).map(([field, error]) => 
                    error && (
                      <Typography key={field} component="li" variant="body2" sx={{ 
                        color: '#dc2626',
                        fontSize: '0.875rem'
                      }}>
                        {error}
                      </Typography>
                    )
                  )}
                </Box>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Incharge Name"
                  value={formData.incharge_name}
                  onChange={(e) => handleInputChange('incharge_name', e.target.value)}
                  required
                  placeholder="Enter full name"
                  inputProps={{
                    maxLength: 50
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#6b7280' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!formErrors.incharge_name}
                  helperText={formErrors.incharge_name}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      },
                      '&.Mui-error': {
                        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                      fontWeight: 500,
                    },
                    '& .MuiFormHelperText-root': {
                      marginLeft: 0,
                      fontSize: '0.75rem',
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
                  placeholder="Enter email address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#6b7280' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      },
                      '&.Mui-error': {
                        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                      fontWeight: 500,
                    },
                    '& .MuiFormHelperText-root': {
                      marginLeft: 0,
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={formData.mobile_number}
                  onChange={(e) => handleNumericInput('mobile_number', e.target.value)}
                  required
                  placeholder="Enter 10-digit mobile number"
                  inputProps={{
                    maxLength: 10,
                    pattern: '[0-9]*'
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: '#6b7280' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!formErrors.mobile_number}
                  helperText={formErrors.mobile_number}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      },
                      '&.Mui-error': {
                        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                      fontWeight: 500,
                    },
                    '& .MuiFormHelperText-root': {
                      marginLeft: 0,
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Aadhaar Number"
                  value={formData.aadhaar_number}
                  onChange={(e) => handleNumericInput('aadhaar_number', e.target.value)}
                  required
                  placeholder="Enter 12-digit Aadhaar number"
                  inputProps={{
                    maxLength: 12,
                    pattern: '[0-9]*'
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon sx={{ color: '#6b7280' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!formErrors.aadhaar_number}
                  helperText={formErrors.aadhaar_number}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      },
                      '&.Mui-error': {
                        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                      fontWeight: 500,
                    },
                    '& .MuiFormHelperText-root': {
                      marginLeft: 0,
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 90%', minWidth: '100%' }}>
                <TextField
                  fullWidth
                  label="Full Address"
                  multiline
                  rows={4}
                  value={formData.full_address}
                  onChange={(e) => handleInputChange('full_address', e.target.value)}
                  required
                  placeholder="Enter complete address including street, city, state, and PIN code"
                  inputProps={{
                    maxLength: 200
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon sx={{ color: '#6b7280', mt: 1 }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!formErrors.full_address}
                  helperText={formErrors.full_address}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                      },
                      '&.Mui-error': {
                        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280',
                      fontWeight: 500,
                    },
                    '& .MuiInputBase-inputMultiline': {
                      paddingTop: '16px',
                      paddingBottom: '16px',
                    },
                    '& .MuiFormHelperText-root': {
                      marginLeft: 0,
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '250px' }}>
                <FormControl fullWidth required error={!!formErrors.center}>
                  {/* <InputLabel sx={{ color: '#6b7280', fontWeight: 500 }}>Center</InputLabel> */}
                  <Select
                    value={formData.center}
                    onChange={(e) => handleInputChange('center', e.target.value)}
                    // label="Center"
                    placeholder="Select a center"
                    disabled={centersLoading}
                    displayEmpty
                    renderValue={(value) => {
                      if (!value) return 'Select a center';
                      return getCenterNameById(value);
                    }}
                    sx={{
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(59, 82, 246, 0.1)',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: formErrors.center ? '#ef4444' : '#d1d5db',
                      },
                      '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ef4444',
                      },
                    }}
                  >
                    {centersLoading ? (
                      <MenuItem value="" disabled>
                        Loading centers...
                      </MenuItem>
                    ) : centers.length > 0 ? (
                      centers.map((center) => (
                        <MenuItem key={center._id} value={center._id}>
                          {center.centerName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="" disabled>
                        No centers available
                      </MenuItem>
                    )}
                  </Select>
                  {formErrors.center && (
                    <Typography variant="caption" sx={{ 
                      color: '#ef4444', 
                      mt: 1,
                      display: 'block',
                      fontSize: '0.75rem'
                    }}>
                      {formErrors.center}
                    </Typography>
                  )}
                </FormControl>
                {/* Debug info for center selection */}
                {formData.center && (
                  <Typography variant="caption" sx={{ 
                    color: '#6b7280', 
                    fontFamily: 'monospace',
                    mt: 1,
                    display: 'block'
                  }}>
                    Selected: {getCenterNameById(formData.center)} (ID: {formData.center})
                  </Typography>
                )}
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

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog
        open={blockDialog.open}
        onClose={closeBlockDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BlockIcon sx={{ color: blockDialog.isBlocked ? '#10b981' : '#ef4444' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {blockDialog.isBlocked ? 'Unblock' : 'Block'} Admission Incharge
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to {blockDialog.isBlocked ? 'unblock' : 'block'} the admission incharge{' '}
            <strong>"{blockDialog.inchargeName}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {blockDialog.isBlocked 
              ? 'This will allow the incharge to access the system again.'
              : 'This will prevent the incharge from accessing the system.'
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={closeBlockDialog}
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
            onClick={confirmBlock}
            variant="contained"
            disabled={blockInchargeMutation.isPending}
            sx={{
              background: blockDialog.isBlocked 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: blockDialog.isBlocked 
                  ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                  : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              },
            }}
          >
            {blockInchargeMutation.isPending
              ? 'Processing...'
              : blockDialog.isBlocked
              ? 'Unblock Incharge'
              : 'Block Incharge'
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DeleteIcon sx={{ color: '#ef4444' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Delete Admission Incharge
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the admission incharge{' '}
            <strong>"{deleteDialog.inchargeName}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. All data associated with this incharge will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={closeDeleteDialog}
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
            onClick={confirmDelete}
            variant="contained"
            disabled={deleteInchargeMutation.isPending}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              },
            }}
          >
            {deleteInchargeMutation.isPending ? 'Deleting...' : 'Delete Incharge'}
          </Button>
        </DialogActions>
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
