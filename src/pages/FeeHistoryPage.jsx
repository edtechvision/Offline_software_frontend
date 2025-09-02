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
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  History as HistoryIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFeeHistory } from '../hooks';

const FeeHistoryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentMode, setFilterPaymentMode] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API parameters
  const apiParams = {
    search: searchTerm,
    paymentMode: filterPaymentMode === 'all' ? '' : filterPaymentMode,
    startDate: startDate ? startDate.toISOString() : '',
    endDate: endDate ? endDate.toISOString() : '',
    page: currentPage,
    limit: pageSize
  };

  // Fetch fee history data from API
  const { data: feeHistoryData, isLoading, error, refetch } = useFeeHistory(apiParams);
  
  // Extract data from API response
  const payments = feeHistoryData?.data || [];
  const totalPayments = feeHistoryData?.totalPayments || 0;
  const pagination = feeHistoryData?.pagination || {};
  const totalPages = pagination.totalPages || 1;

  // Pagination handlers
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setOpenReceiptDialog(true);
  };

  const handlePrintReceipt = (payment) => {
    setSnackbar({
      open: true,
      message: `Printing receipt for ${payment.studentName}`,
      severity: 'success'
    });
  };

  const handleDownloadReceipt = (payment) => {
    setSnackbar({
      open: true,
      message: `Downloading receipt for ${payment.studentName}`,
      severity: 'success'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  // Calculate statistics from API data
  const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  const todayPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.paymentDate);
    const today = new Date();
    return paymentDate.toDateString() === today.toDateString();
  }).length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
            Fee History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage all fee payment records
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
                    ₹{totalAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Collected
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    {totalPayments}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Payments
                  </Typography>
                </Box>
                <HistoryIcon sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    {todayPayments}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Today's Payments
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    {payments.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Current Page
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
                md: '2fr 1fr 1fr 2fr auto' 
              },
              gap: 2, 
              alignItems: 'end'
            }}>
              <TextField
                fullWidth
                placeholder="Search by student, ID, or receipt..."
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
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={filterPaymentMode}
                  onChange={(e) => setFilterPaymentMode(e.target.value)}
                  label="Payment Mode"
                  sx={{ borderRadius: '4px' }}
                >
                  <MenuItem value="all">All Modes</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                </Select>
              </FormControl>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ 
                    textField: { 
                      size: 'small', 
                      fullWidth: true, 
                      sx: { borderRadius: '4px' } 
                    } 
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ 
                    textField: { 
                      size: 'small', 
                      fullWidth: true, 
                      sx: { borderRadius: '4px' } 
                    } 
                  }}
                />
              </Box>
           
            </Box>
          </CardContent>
        </Card>

        {/* Actions Bar */}
        <Card sx={{ mb: 3, borderRadius: '4px' }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                sx={{ borderRadius: '4px' }}
              >
                Export Report
              </Button>
              <Button
                variant="contained"
                startIcon={<PrintIcon />}
                sx={{ borderRadius: '4px' }}
              >
                Print Report
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Fee History Table */}
        <Card sx={{ borderRadius: '4px', overflow: 'hidden' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="error">
                Error loading fee history: {error.message}
              </Typography>
              <Button variant="contained" onClick={() => refetch()} sx={{ mt: 2 }}>
                Retry
              </Button>
            </Box>
          ) : payments.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <HistoryIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 3 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                No Payment History Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                {searchTerm ? 'No payments match your search criteria. Try adjusting your filters.' : 'No payment records found.'}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Payment Details</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Payment Mode</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.studentId + payment.paymentDate} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {payment.studentName?.charAt(0) || 'S'}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {(payment.studentName || 'N/A')} • {(payment.registrationNo || 'N/A')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {payment.receiptNo || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          ₹{(payment.amount || 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.paymentMode || 'N/A'}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Completed"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Receipt">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewReceipt(payment)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Print Receipt">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handlePrintReceipt(payment)}
                            >
                              <PrintIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download Receipt">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleDownloadReceipt(payment)}
                            >
                              <DownloadIcon />
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
        {!isLoading && !error && payments.length > 0 && (
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
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalPayments)} of {totalPayments} entries
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

        {/* Receipt Dialog */}
        <Dialog
          open={openReceiptDialog}
          onClose={() => setOpenReceiptDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: '4px' } }}
        >
          <DialogTitle sx={{ pb: 2, borderBottom: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ReceiptIcon sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Payment Receipt
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedPayment?.receiptNo || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            {selectedPayment && (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3 
              }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Student Information
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedPayment.studentName || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPayment.registrationNo || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedPayment.courseName || 'N/A'}
                  </Typography>
                  {selectedPayment.className && (
                    <Typography variant="body2" color="text.secondary">
                      Class: {selectedPayment.className}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Payment Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Amount:</strong> ₹{(selectedPayment.amount || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mode:</strong> {selectedPayment.paymentMode || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                  {selectedPayment.transactionId && (
                    <Typography variant="body2">
                      <strong>Transaction ID:</strong> {selectedPayment.transactionId}
                    </Typography>
                  )}
                  <Typography variant="body2">
                    <strong>Total Fee:</strong> ₹{(selectedPayment.totalFee || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Pending After Payment:</strong> ₹{(selectedPayment.pendingAmountAfterPayment || 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Remarks
                  </Typography>
                  <Typography variant="body2">
                    {selectedPayment.remarks || 'No remarks'}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setOpenReceiptDialog(false)}
              variant="outlined"
              sx={{ borderRadius: '4px' }}
            >
              Close
            </Button>
            <Button
              onClick={() => handlePrintReceipt(selectedPayment)}
              variant="contained"
              startIcon={<PrintIcon />}
              sx={{ borderRadius: '4px' }}
            >
              Print Receipt
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

export default FeeHistoryPage;

