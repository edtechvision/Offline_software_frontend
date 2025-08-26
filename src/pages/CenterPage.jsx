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
  Grid,
  Stack,
  CircularProgress,
  Fade,
  Zoom
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
  Lock as LockIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon
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
  const { data: centersData, isLoading, error, refetch } = useCenters({
    page: currentPage,
    limit: pageSize,
    search: searchTerm
  });

  // Check if user is authenticated
  const authToken = localStorage.getItem('authToken');
  console.log('Auth Token:', authToken ? 'Present' : 'Missing');

  // Test API call manually
  useEffect(() => {
    const testApiCall = async () => {
      try {
        const response = await fetch('https://seashell-app-vgu3a.ondigitalocean.app/api/v1/center/get', {
          headers: {
            'Content-Type': 'application/json',
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
        });
        const data = await response.json();
        console.log('Manual API Test Response:', data);
      } catch (error) {
        console.error('Manual API Test Error:', error);
      }
    };
    
    testApiCall();
  }, [authToken]);

  // Mutations
  const createCenterMutation = useCreateCenter();
  const updateCenterMutation = useUpdateCenter();
  const deleteCenterMutation = useDeleteCenter();

  // Get actual data or empty array - Fixed data mapping
  const centers = centersData?.data || [];
  const totalCenters = centersData?.pagination?.total || 0;
  const totalPages = centersData?.pagination?.totalPages || 1;


  // Filter centers based on search term
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
        centerName: center.centerName || '',
        centerHeadName: center.centerHeadName || '',
        email: center.email || '',
        centerHeadMobileNo: center.centerHeadMobileNo || '',
        fullAddress: center.fullAddress || '',
        state: center.state || '',
        district: center.district || '',
        password: center.password || ''
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
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      backgroundColor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {/* Enhanced Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            mb: 1, 
            fontWeight: 700, 
            color: '#0f172a',
            background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Center Management
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#64748b', 
            fontWeight: 400,
            fontSize: { xs: '1rem', md: '1.125rem' }
          }}
        >
          Manage centers, staff, and operational details
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(59, 130, 246, 0.3)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
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
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {filteredCenters.length}
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
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(245, 158, 11, 0.3)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {centers.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Current Page
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {totalPages}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Pages
                  </Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Header with Add Button */}
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
            Center Operations
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Add new centers and manage existing operations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            borderRadius: 3,
            px: 4,
            py: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 12px 35px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          + Add New Center
        </Button>
      </Box>

      {/* Enhanced Search and Controls */}
      <Card sx={{ 
        mb: 4, 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        background: 'white',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FilterIcon sx={{ color: '#3b82f6', mr: 1.5, fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
              Search & Filters
            </Typography>
          </Box>
          
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
                      <SearchIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2.5,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="medium">
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  sx={{ 
                    borderRadius: 2.5,
                    backgroundColor: '#f8fafc',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                    },
                  }}
                >
                  <MenuItem value={10}>10 entries</MenuItem>
                  <MenuItem value={25}>25 entries</MenuItem>
                  <MenuItem value={50}>50 entries</MenuItem>
                  <MenuItem value={100}>100 entries</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }}
                sx={{
                  borderRadius: 2.5,
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f9fafb',
                    borderWidth: 2,
                  },
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Active Search Indicator */}
      {searchTerm && (
        <Fade in={true}>
          <Box sx={{ 
            mb: 3, 
            p: 2.5, 
            backgroundColor: 'rgba(59, 130, 246, 0.05)', 
            borderRadius: 3,
            border: '1px solid rgba(59, 130, 246, 0.1)',
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5
          }}>
            <Typography variant="body2" sx={{ color: '#1e40af', fontWeight: 600 }}>
              Search results for: "{searchTerm}"
            </Typography>
            <Chip
              label={`${filteredCenters.length} centers found`}
              size="small"
              sx={{ 
                backgroundColor: '#dbeafe', 
                color: '#1e40af',
                fontWeight: 500,
              }}
            />
          </Box>
        </Fade>
      )}

      {/* Enhanced Centers Table */}
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
              }}>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  py: 2, 
                  px: 2, 
                  fontSize: '0.875rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  S.N
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  py: 2, 
                  px: 2, 
                  fontSize: '0.875rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  Center Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  py: 2, 
                  px: 2, 
                  fontSize: '0.875rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  Center Code
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  py: 2, 
                  px: 2, 
                  fontSize: '0.875rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  Center Head
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  py: 2, 
                  px: 2, 
                  fontSize: '0.875rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  Contact
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  py: 2, 
                  px: 2, 
                  fontSize: '0.875rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  Password
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  py: 2, 
                  px: 2, 
                  fontSize: '0.875rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  Status
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  py: 2, 
                  px: 2, 
                  fontSize: '0.875rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={48} sx={{ color: '#3b82f6', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Loading centers...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Alert severity="error" sx={{ mb: 2, maxWidth: 500, mx: 'auto' }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Error loading centers
                      </Typography>
                      {error.message}
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : filteredCenters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BusinessIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 3 }} />
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
                          sx={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            color: 'white',
                            borderRadius: 3,
                            px: 4,
                            py: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.35)',
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          Add First Center
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCenters.map((center, index) => (
                  <TableRow 
                    key={center._id} 
                    sx={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafbfc',
                      '&:hover': { 
                        backgroundColor: '#f1f5f9',
                        transform: 'scale(1.001)',
                        transition: 'all 0.2s ease-in-out',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#6b7280' }}>
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Box sx={{ 
                        backgroundColor: '#f0f9ff', 
                        p: 1.5, 
                        borderRadius: 2,
                        border: '1px solid #bae6fd',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#e0f2fe',
                        }
                      }}
                      onClick={() => handleOpenDialog(center)}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#0369a1',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}
                        >
                          {center.centerName || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#3b82f6',
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          backgroundColor: '#f1f5f9',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1.5,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#e2e8f0',
                          }
                        }}
                        onClick={() => handleOpenDialog(center)}
                      >
                        {center.centerCode || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: '#6b7280', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                          {center.centerHeadName || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon sx={{ color: '#6b7280', fontSize: 14 }} />
                          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                            {center.email || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon sx={{ color: '#6b7280', fontSize: 14 }} />
                          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                            {center.centerHeadMobileNo || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'monospace',
                          backgroundColor: '#fef3c7',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          color: '#92400e',
                          fontWeight: 500,
                          border: '1px solid #fde68a'
                        }}
                      >
                        {center.plainPassword || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Chip
                        label="Active"
                        size="small"
                        sx={{
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          fontWeight: 600,
                          borderRadius: 2,
                          fontSize: '0.75rem',
                          height: '24px',
                          border: '1px solid #bbf7d0',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Block Center" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleBlock(center._id)}
                            sx={{ 
                              color: '#f59e0b',
                              backgroundColor: 'rgba(245, 158, 11, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                              }
                            }}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Center" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(center)}
                            sx={{ 
                              color: '#3b82f6',
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Center" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(center._id)}
                            sx={{ 
                              color: '#ef4444',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                              }
                            }}
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

      {/* Enhanced Pagination */}
      {totalCenters > 0 && (
        <Card sx={{ 
          mt: 4, 
          borderRadius: 3, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCenters)} of {totalCenters} entries
                  {searchTerm && ` (filtered from ${totalCenters} total)`}
                </Typography>
              </Grid>
              <Grid item>
                <Stack spacing={1} direction="row" alignItems="center">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                        fontWeight: 500,
                        '&.Mui-selected': {
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#2563eb',
                          },
                        },
                      },
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Create/Edit Dialog */}
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
                      borderRadius: 2.5,
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
                      borderRadius: 2.5,
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
                      borderRadius: 2.5,
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
                      borderRadius: 2.5,
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
                      borderRadius: 2.5,
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
                      borderRadius: 2.5,
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
                      borderRadius: 2.5,
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
                      borderRadius: 2.5,
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
                borderRadius: 2.5,
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

      {/* Enhanced Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Slide}
        sx={{
          zIndex: 9999,
          '& .MuiSnackbarContent-root': {
            borderRadius: 2.5,
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
