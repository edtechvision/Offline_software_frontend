import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Fab,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  CardActions,
  CardMedia,
  Avatar,
  Tooltip,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  Stack,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Lock as LockIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useCenters, useCreateCenter, useUpdateCenter, useDeleteCenter, useBlockCenter } from '../hooks/useCenters';

const CenterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [openDialog, setOpenDialog] = useState(false);
  const [editingCenter, setEditingCenter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

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

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    centerName: '',
    centerHeadName: '',
    email: '',
    centerHeadMobileNo: '',
    fullAddress: '',
    state: '',
    district: '',
    password: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Alert dialog states
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    centerId: null,
    centerName: ''
  });

  const [blockDialog, setBlockDialog] = useState({
    open: false,
    centerId: null,
    centerName: '',
    isBlocked: false
  });

  const { data: centersData, isLoading, error, refetch } = useCenters({
    page: currentPage,
    limit: pageSize,
    search: searchTerm
  });

  const createCenterMutation = useCreateCenter();
  const updateCenterMutation = useUpdateCenter();
  const deleteCenterMutation = useDeleteCenter();
  const blockCenterMutation = useBlockCenter();

  const centers = centersData?.data || [];
  const totalCenters = centersData?.pagination?.total || 0;
  const totalPages = centersData?.pagination?.totalPages || 1;

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (center = null) => {
    if (center) {
      setEditingCenter(center);
      setFormData({
        centerName: center.centerName || '',
        centerHeadName: center.centerHeadName || '',
        email: center.email || '',
        centerHeadMobileNo: center.centerHeadMobileNo || '',
        fullAddress: center.fullAddress || '',
        state: center.state || '',
        district: center.district || '',
        password: '' // Clear password when editing - user must enter new one if they want to change it
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
    // Clear form errors when closing
    setFormErrors({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      showSnackbar('Please fix the validation errors before submitting', 'error');
      return;
    }
    
    try {
      if (editingCenter) {
        // For editing, create a copy of formData and handle password logic
        const updateData = { ...formData };
        
        // If password is empty during edit, remove it from the update data
        if (!updateData.password || updateData.password.trim() === '') {
          delete updateData.password;
        }
        
        await updateCenterMutation.mutateAsync({
          id: editingCenter._id,
          data: updateData
        });
        showSnackbar('Center updated successfully!', 'success');
      } else {
        await createCenterMutation.mutateAsync(formData);
        showSnackbar('Center created successfully!', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Center operation failed:', error);
      
      // Handle specific validation errors from API
      if (error.message && error.message.includes('validation failed')) {
        if (error.error && error.error.includes('centerHeadMobileNo')) {
          showSnackbar('Invalid mobile number format. Must be 10 digits starting with 6, 7, 8, or 9.', 'error');
        } else if (error.error && error.error.includes('email')) {
          showSnackbar('Invalid email format. Please enter a valid email address.', 'error');
        } else if (error.error && error.error.includes('password')) {
          showSnackbar('Password must be at least 6 characters long.', 'error');
        } else {
          showSnackbar('Validation failed: Please check all required fields', 'error');
        }
      } else if (error.message && error.message.includes('mobile')) {
        showSnackbar('Invalid mobile number format. Must be 10 digits starting with 6, 7, 8, or 9.', 'error');
      } else if (error.message && error.message.includes('email')) {
        showSnackbar('Invalid email format. Please enter a valid email address.', 'error');
      } else {
      showSnackbar(error.message || 'Operation failed', 'error');
      }
    }
  };

  const handleDelete = (id, centerName) => {
    setDeleteDialog({
      open: true,
      centerId: id,
      centerName: centerName
    });
  };

  const confirmDelete = async () => {
    try {
      const { centerId } = deleteDialog;
      await deleteCenterMutation.mutateAsync(centerId);
        showSnackbar('Center deleted successfully!', 'success');
      setDeleteDialog({ open: false, centerId: null, centerName: '' });
      } catch (error) {
        showSnackbar(error.message || 'Delete failed', 'error');
      }
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, centerId: null, centerName: '' });
  };

  const handleBlock = (id, currentBlockStatus, centerName) => {
    setBlockDialog({
      open: true,
      centerId: id,
      centerName: centerName,
      isBlocked: currentBlockStatus
    });
  };

  const confirmBlock = async () => {
    try {
      const { centerId, isBlocked } = blockDialog;
      const action = isBlocked ? 'unblock' : 'block';
      await blockCenterMutation.mutateAsync({ id: centerId, block: !isBlocked });
      showSnackbar(`Center ${action}ed successfully!`, 'success');
      setBlockDialog({ open: false, centerId: null, centerName: '', isBlocked: false });
    } catch (error) {
      console.error('Block operation failed:', error);
      showSnackbar(error.message || 'Operation failed', 'error');
    }
  };

  const closeBlockDialog = () => {
    setBlockDialog({ open: false, centerId: null, centerName: '', isBlocked: false });
  };

  // Validation functions
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

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return '';
  };

  // Validate all fields
  const validateForm = () => {
    const errors = {
      centerName: validateName(formData.centerName),
      centerHeadName: validateName(formData.centerHeadName),
      email: validateEmail(formData.email),
      centerHeadMobileNo: validateMobile(formData.centerHeadMobileNo),
      fullAddress: validateAddress(formData.fullAddress),
      state: validateName(formData.state),
      district: validateName(formData.district),
    };
    
    // Password validation: only required for new centers, optional for editing
    if (!editingCenter) {
      errors.password = validatePassword(formData.password);
    } else if (formData.password && formData.password.trim() !== '') {
      // If editing and password is provided, validate it
      errors.password = validatePassword(formData.password);
    }
    
    setFormErrors(errors);
    
    // Check if there are any errors
    return !Object.values(errors).some(error => error !== '');
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

  // Handle numeric input restrictions
  const handleNumericInput = (field, value) => {
    // Only allow digits
    const numericValue = value.replace(/[^0-9]/g, '');
    handleInputChange(field, numericValue);
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

  const filteredCenters = centers.filter(center => {
    if (!searchTerm) return true;
    return (
      center.centerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.centerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.centerHeadName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.centerHeadMobileNo?.includes(searchTerm)
    );
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ backgroundColor: 'white', color: theme.palette.text.primary }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <BusinessIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                Center Management
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Manage your centers and operations
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ borderRadius: '4px' }}
              >
                Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => refetch()}
                sx={{ borderRadius: '4px' }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  borderRadius: '4px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                }}
              >
                Add Center
              </Button>
            </Box>
          )}

          {isMobile && (
            <IconButton onClick={() => setMobileDrawerOpen(true)}>
              <MoreVertIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Quick Actions</Typography>
            <IconButton onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            <ListItem button onClick={() => { handleOpenDialog(); setMobileDrawerOpen(false); }}>
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary="Add Center" />
            </ListItem>
            <ListItem button onClick={() => { setShowFilters(!showFilters); setMobileDrawerOpen(false); }}>
              <ListItemIcon><FilterIcon /></ListItemIcon>
              <ListItemText primary="Filters" />
            </ListItem>
            <ListItem button onClick={() => { refetch(); setMobileDrawerOpen(false); }}>
              <ListItemIcon><RefreshIcon /></ListItemIcon>
              <ListItemText primary="Refresh" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Stats Cards */}
        {/* <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              borderRadius: '4px'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {totalCenters}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Centers
                    </Typography>
                  </Box>
                  <BusinessIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
              color: 'white',
              borderRadius: '4px'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {filteredCenters.filter(c => !c.isBlocked).length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Centers
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
              color: 'white',
              borderRadius: '4px'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {filteredCenters.filter(c => c.isBlocked).length}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Blocked Centers
                    </Typography>
                  </Box>
                  <BlockIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{
              background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
              color: 'white',
              borderRadius: '4px'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {totalPages}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Pages
                    </Typography>
                  </Box>
                  <ViewListIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid> */}

        {/* Search and Controls */}
        <Card sx={{ mb: 4, borderRadius: '4px', overflow: 'hidden' }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search centers by name, code, head, email, or mobile..."
                  value={searchTerm}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ borderRadius: '4px' }}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
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
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  sx={{ borderRadius: '4px', width: '100%' }}
                >
                  Clear
                </Button>
              </Grid>

              <Grid item xs={12} md={2}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => setViewMode('table')}
                    color={viewMode === 'table' ? 'primary' : 'default'}
                  >
                    <ViewListIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                  >
                    <ViewModuleIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Filters Section */}
        <Collapse in={showFilters}>
          <Card sx={{ mb: 4, borderRadius: '4px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Advanced Filters
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      sx={{ borderRadius: '4px' }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active Only</MenuItem>
                      <MenuItem value="blocked">Blocked Only</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Collapse>

        {/* Content */}
        {isLoading ? (
          <Card sx={{ borderRadius: '4px', p: 4, textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading centers...
            </Typography>
          </Card>
        ) : error ? (
          <Card sx={{ borderRadius: '4px', p: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Error loading centers
              </Typography>
              {error.message}
            </Alert>
            <Button variant="contained" onClick={() => refetch()}>
              Retry
            </Button>
          </Card>
        ) : filteredCenters.length === 0 ? (
          <Card sx={{ borderRadius: '4px', p: 8, textAlign: 'center' }}>
            <BusinessIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 3 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
              No Centers Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              {searchTerm ? 'No centers match your search criteria. Try adjusting your filters.' : 'Get started by adding your first center to the system.'}
            </Typography>
            {!searchTerm && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                size="large"
                sx={{ borderRadius: '4px' }}
              >
                Add First Center
              </Button>
            )}
          </Card>
        ) : (
          <>
            {/* View Toggle and Results Info */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredCenters.length} of {totalCenters} centers
              </Typography>
            </Box>

            {/* Content View */}
            {viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {filteredCenters.map((center) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={center._id}>
                    <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => handleOpenDialog(center)}>
                      <CardMedia
                        component="div"
                        sx={{
                          height: 120,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}
                      >
                        <BusinessIcon sx={{ fontSize: 48, color: 'white' }} />
                        <Chip
                          label={center.isBlocked ? 'Blocked' : 'Active'}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: center.isBlocked ? theme.palette.error.main : theme.palette.success.main,
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      </CardMedia>

                      <CardContent sx={{ flexGrow: 1, p: 2 }}>
                        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                          {center.centerName || 'N/A'}
                        </Typography>

                        <Typography variant="body2" sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          mb: 1
                        }}>
                          {center.centerCode || 'N/A'}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PersonIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {center.centerHeadName || 'N/A'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EmailIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem' }}>
                            {center.email || 'N/A'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LockIcon sx={{ fontSize: 16, color: theme.palette.text.secondary, mr: 1 }} />
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            Password: {center.plainPassword || 'N/A'}
                          </Typography>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(center);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(center._id, center.centerName);
                          }}
                          sx={{ mr: 1 }}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          color={center.isBlocked ? 'success' : 'warning'}
                          startIcon={<BlockIcon />}
                                                      onClick={(e) => {
                              e.stopPropagation();
                              handleBlock(center._id, center.isBlocked, center.centerName);
                            }}
                        >
                          {center.isBlocked ? 'Unblock' : 'Block'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ borderRadius: '4px', overflow: 'hidden' }}>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: theme.palette.grey[50] }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}` }}>
                          Center Name
                        </th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}` }}>
                          Center Code
                        </th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}` }}>
                          Center Head
                        </th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}` }}>
                          Contact Info
                        </th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}` }}>
                          Password
                        </th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}` }}>
                          Status
                        </th>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600, borderBottom: `2px solid ${theme.palette.divider}` }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCenters.map((center) => (
                        <tr key={center._id} style={{
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          '&:hover': { backgroundColor: theme.palette.action.hover }
                        }}>
                          <td style={{ padding: '16px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 32, height: 32 }}>
                                <BusinessIcon fontSize="small" />
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {center.centerName || 'N/A'}
                              </Typography>
                            </Box>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <Chip
                              label={center.centerCode || 'N/A'}
                              size="small"
                              sx={{
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.contrastText,
                                fontWeight: 600
                              }}
                            />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon sx={{ color: theme.palette.text.secondary, fontSize: 16 }} />
                              <Typography variant="body2">
                                {center.centerHeadName || 'N/A'}
                              </Typography>
                            </Box>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon sx={{ color: theme.palette.text.secondary, fontSize: 14 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                  {center.email || 'N/A'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PhoneIcon sx={{ color: theme.palette.text.secondary, fontSize: 14 }} />
                                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                                  {center.centerHeadMobileNo || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LockIcon sx={{ color: theme.palette.text.secondary, fontSize: 16 }} />
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                {center.plainPassword || 'N/A'}
                              </Typography>
                            </Box>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <Chip
                              label={center.isBlocked ? 'Blocked' : 'Active'}
                              size="small"
                              color={center.isBlocked ? 'error' : 'success'}
                              sx={{ fontWeight: 600 }}
                            />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Edit Center" arrow>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleOpenDialog(center)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Center" arrow>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(center._id, center.centerName)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={center.isBlocked ? 'Unblock Center' : 'Block Center'} arrow>
                                <IconButton
                                  size="small"
                                  color={center.isBlocked ? 'success' : 'warning'}
                                  onClick={() => handleBlock(center._id, center.isBlocked, center.centerName)}
                                >
                                  <BlockIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Card>
            )}
          </>
        )}

        {/* Pagination */}
        {totalCenters > 0 && (
          <Card sx={{ mt: 4, borderRadius: '4px' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCenters)} of {totalCenters} entries
                  </Typography>
                </Grid>
                <Grid item>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    showFirstButton
                    showLastButton
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Create/Edit Center Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '4px' }
        }}
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
              <BusinessIcon sx={{ color: theme.palette.primary.main, fontSize: '1.5rem' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
              {editingCenter ? 'Edit Center' : 'Add New Center'}
            </Typography>
              <Typography variant="body2" color="text.secondary">
                {editingCenter ? 'Update the center information' : 'Create a new center for your organization'}
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
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Center Name"
                  value={formData.centerName}
                  onChange={(e) => handleInputChange('centerName', e.target.value)}
                  required
                  placeholder="Enter center name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: '#6b7280' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!formErrors.centerName}
                  helperText={formErrors.centerName}
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Center Head Name"
                  value={formData.centerHeadName}
                  onChange={(e) => setFormData({ ...formData, centerHeadName: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ borderRadius: '4px' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ borderRadius: '4px' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={formData.centerHeadMobileNo}
                  onChange={(e) => handleNumericInput('centerHeadMobileNo', e.target.value)}
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
                  error={!!formErrors.centerHeadMobileNo}
                  helperText={formErrors.centerHeadMobileNo}
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  sx={{ borderRadius: '4px' }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="District"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                  sx={{ borderRadius: '4px' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Address"
                  multiline
                  rows={3}
                  value={formData.fullAddress}
                  onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ borderRadius: '4px' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={editingCenter ? "New Password (leave blank to keep current)" : "Password"}
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingCenter}
                  placeholder={editingCenter ? "Enter new password or leave blank" : "Enter password"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#6b7280' }} />
                      </InputAdornment>
                    ),
                  }}
                  error={!!formErrors.password}
                  helperText={editingCenter ? "Leave blank to keep current password unchanged" : formErrors.password}
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
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
                                sx={{ borderRadius: '4px' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createCenterMutation.isPending || updateCenterMutation.isPending}
              startIcon={createCenterMutation.isPending || updateCenterMutation.isPending ? <CircularProgress size={16} /> : <SaveIcon />}
              sx={{
                borderRadius: '4px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '4px' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: '8px', 
              bgcolor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DeleteIcon sx={{ color: '#ef4444', fontSize: '1.5rem' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                Delete Center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action cannot be undone
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the center{' '}
            <strong>"{deleteDialog.centerName}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will permanently remove the center and all associated data from the system.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={{
              color: '#6b7280',
              borderColor: '#d1d5db',
              borderRadius: '4px',
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
            disabled={deleteCenterMutation.isPending}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              borderRadius: '4px',
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              },
            }}
          >
            {deleteCenterMutation.isPending ? 'Deleting...' : 'Delete Center'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog
        open={blockDialog.open}
        onClose={closeBlockDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '4px' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: '8px', 
              bgcolor: blockDialog.isBlocked ? '#f0fdf4' : '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BlockIcon sx={{ 
                color: blockDialog.isBlocked ? '#10b981' : '#ef4444', 
                fontSize: '1.5rem' 
              }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {blockDialog.isBlocked ? 'Unblock' : 'Block'} Center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {blockDialog.isBlocked ? 'Allow center access' : 'Restrict center access'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to {blockDialog.isBlocked ? 'unblock' : 'block'} the center{' '}
            <strong>"{blockDialog.centerName}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {blockDialog.isBlocked 
              ? 'This will allow the center to access the system again.'
              : 'This will prevent the center from accessing the system.'
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={closeBlockDialog}
            variant="outlined"
            sx={{
              color: '#6b7280',
              borderColor: '#d1d5db',
              borderRadius: '4px',
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
            disabled={blockCenterMutation.isPending}
            sx={{
              background: blockDialog.isBlocked 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              borderRadius: '4px',
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
            {blockCenterMutation.isPending
              ? 'Processing...'
              : blockDialog.isBlocked
              ? 'Unblock Center'
              : 'Block Center'
            }
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>
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

export default CenterPage;
