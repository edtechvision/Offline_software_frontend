import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tooltip,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Percent as PercentIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  LocalOffer as OfferIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  useFeeDiscounts, 
  useCreateFeeDiscount, 
  useUpdateFeeDiscount, 
  useDeleteFeeDiscount 
} from '../hooks';

const FeeDiscountPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [openDiscountDialog, setOpenDiscountDialog] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [discountData, setDiscountData] = useState({
    name: '',
    discountCode: '',
    discountType: 'percentage',
    percentage: '',
    amount: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // API parameters
  const apiParams = {
    search: searchTerm,
    type: filterType === 'all' ? '' : filterType,
    page: currentPage,
    limit: pageSize
  };

  // Fetch discounts data from API
  const { data: discountsData, isLoading, error, refetch } = useFeeDiscounts(apiParams);
  
  // Extract data from API response
  const discounts = discountsData?.data || [];
  const totalDiscounts = discountsData?.totalDiscounts || 0;
  const pagination = discountsData?.pagination || {};
  const totalPages = pagination.totalPages || 1;

  // Mutation hooks
  const createDiscountMutation = useCreateFeeDiscount();
  const updateDiscountMutation = useUpdateFeeDiscount();
  const deleteDiscountMutation = useDeleteFeeDiscount();

  // Pagination handlers
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleAddDiscount = () => {
    setEditingDiscount(null);
    setDiscountData({
      name: '',
      discountCode: '',
      discountType: 'percentage',
      percentage: '',
      amount: '',
      description: ''
    });
    setOpenDiscountDialog(true);
  };

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
    setDiscountData({
      name: discount.name || '',
      discountCode: discount.discountCode || '',
      discountType: discount.discountType || 'percentage',
      percentage: discount.percentage?.toString() || '',
      amount: discount.amount?.toString() || '',
      description: discount.description || ''
    });
    setOpenDiscountDialog(true);
  };

  const handleSaveDiscount = async () => {
    try {
      const payload = {
        name: discountData.name,
        discountCode: discountData.discountCode,
        discountType: discountData.discountType,
        description: discountData.description
      };

      if (discountData.discountType === 'percentage') {
        payload.percentage = parseInt(discountData.percentage);
        payload.amount = 0;
      } else {
        payload.amount = parseInt(discountData.amount);
        payload.percentage = 0;
      }

      if (editingDiscount) {
        await updateDiscountMutation.mutateAsync({
          id: editingDiscount._id,
          discountData: payload
        });
      } else {
        await createDiscountMutation.mutateAsync(payload);
      }

    setSnackbar({
      open: true,
        message: editingDiscount ? 'Discount updated successfully!' : 'Discount added successfully!',
      severity: 'success'
    });
    setOpenDiscountDialog(false);
    setEditingDiscount(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error'
      });
    }
  };

  const handleDeleteDiscount = async (discount) => {
    try {
      await deleteDiscountMutation.mutateAsync(discount._id);
    setSnackbar({
      open: true,
        message: `Discount "${discount.name}" deleted successfully!`,
      severity: 'success'
    });
    } catch (error) {
    setSnackbar({
      open: true,
        message: error.message || 'An error occurred',
        severity: 'error'
      });
    }
  };

  // Calculate statistics from API data
  const activeDiscounts = discounts.filter(d => d.discountType).length; // All discounts are considered active
  const percentageDiscounts = discounts.filter(d => d.discountType === 'percentage').length;
  const fixedDiscounts = discounts.filter(d => d.discountType === 'fixed').length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
            Fee Discount
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage fee discounts and scholarships for students
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3, 
          mb: 4 
        }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              color: 'white',
            borderRadius: '4px'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {totalDiscounts}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Discounts
                    </Typography>
                  </Box>
                  <OfferIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
            borderRadius: '4px'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {activeDiscounts}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Active Discounts
                    </Typography>
                  </Box>
                  <PercentIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
              color: 'white',
            borderRadius: '4px'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {percentageDiscounts}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Percentage Discounts
                    </Typography>
                  </Box>
                  <MoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ 
              background: 'linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%)',
              color: 'white',
            borderRadius: '4px'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {fixedDiscounts}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Fixed Amount Discounts
                    </Typography>
                  </Box>
                  <PersonIcon sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ mb: 3, borderRadius: '4px' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: '1fr 1fr', 
                md: '2fr 1fr 1fr 2fr' 
              },
              gap: 2, 
              alignItems: 'end'
            }}>
                <TextField
                  fullWidth
                placeholder="Search by discount name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                sx={{ borderRadius: '4px' }}
                />
              
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  sx={{ borderRadius: '4px' }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Type"
                  sx={{ borderRadius: '4px' }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                  </Select>
                </FormControl>
              
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                      setFilterType('all');
                    setCurrentPage(1);
                    }}
                  sx={{ borderRadius: '4px' }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddDiscount}
                  sx={{ borderRadius: '4px' }}
                  >
                    Add Discount
                  </Button>
                </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Discounts Table */}
        <Card sx={{ borderRadius: '4px', overflow: 'hidden' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="error">
                Error loading discounts: {error.message}
              </Typography>
              <Button variant="contained" onClick={() => refetch()} sx={{ mt: 2 }}>
                Retry
              </Button>
            </Box>
          ) : discounts.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <OfferIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 3 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                No Discounts Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                {searchTerm ? 'No discounts match your search criteria. Try adjusting your filters.' : 'No discount records found.'}
              </Typography>
            </Box>
          ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Discount Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type & Value</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {discount.name?.charAt(0) || 'D'}
                        </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {discount.name || 'N/A'}
                          </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                        <Chip
                          label={discount.discountCode || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {discount.discountType === 'percentage' 
                              ? `${discount.percentage || 0}%` 
                              : `₹${(discount.amount || 0).toLocaleString()}`
                          }
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {discount.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {discount.description || 'No description'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <Typography variant="body2">
                          {discount.createdAt ? new Date(discount.createdAt).toLocaleDateString() : 'N/A'}
                        </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Discount">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleEditDiscount(discount)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Discount">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteDiscount(discount)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          )}
        </Card>

        {/* Pagination */}
        {!isLoading && !error && discounts.length > 0 && (
          <Card sx={{ mt: 3, borderRadius: '4px' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rows per page:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      sx={{ borderRadius: '4px' }}
                    >
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="body2" color="text.secondary">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalDiscounts)} of {totalDiscounts} entries
                  </Typography>
                </Box>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton
                  showLastButton
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Discount Dialog */}
        <Dialog
          open={openDiscountDialog}
          onClose={() => setOpenDiscountDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '4px' } }}
        >
          <DialogTitle sx={{ pb: 2, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <OfferIcon sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {editingDiscount ? 'Edit Discount' : 'Add New Discount'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editingDiscount ? 'Update discount details' : 'Create a new fee discount'}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3
            }}>
                <TextField
                  fullWidth
                label="Discount Name"
                value={discountData.name}
                onChange={(e) => setDiscountData({ ...discountData, name: e.target.value })}
                sx={{ borderRadius: '4px' }}
                required
              />
                <TextField
                  fullWidth
                label="Discount Code"
                value={discountData.discountCode}
                onChange={(e) => setDiscountData({ ...discountData, discountCode: e.target.value })}
                sx={{ borderRadius: '4px' }}
                required
              />
                <FormControl fullWidth>
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={discountData.discountType}
                    onChange={(e) => setDiscountData({ ...discountData, discountType: e.target.value })}
                    label="Discount Type"
                  sx={{ borderRadius: '4px' }}
                  >
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="fixed">Fixed Amount</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label={discountData.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                value={discountData.discountType === 'percentage' ? discountData.percentage : discountData.amount}
                onChange={(e) => setDiscountData({ 
                  ...discountData, 
                  [discountData.discountType === 'percentage' ? 'percentage' : 'amount']: e.target.value 
                })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {discountData.discountType === 'percentage' ? '%' : '₹'}
                      </InputAdornment>
                    ),
                  }}
                sx={{ borderRadius: '4px' }}
                type="number"
                required
                />
                <TextField
                  fullWidth
                label="Description"
                  multiline
                  rows={3}
                value={discountData.description}
                onChange={(e) => setDiscountData({ ...discountData, description: e.target.value })}
                sx={{ borderRadius: '4px', gridColumn: '1 / -1' }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setOpenDiscountDialog(false)}
              variant="outlined"
              sx={{ borderRadius: '4px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveDiscount}
              variant="contained"
              startIcon={<OfferIcon />}
              sx={{ borderRadius: '4px' }}
              disabled={createDiscountMutation.isPending || updateDiscountMutation.isPending}
            >
              {createDiscountMutation.isPending || updateDiscountMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                editingDiscount ? 'Update Discount' : 'Add Discount'
              )}
            </Button>
          </DialogActions>
        </Dialog>

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
    </LocalizationProvider>
  );
};

export default FeeDiscountPage;
