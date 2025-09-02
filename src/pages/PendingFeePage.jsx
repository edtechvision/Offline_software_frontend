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
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Pagination
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { usePendingFees } from '../hooks';

const PendingFeePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API parameters
  const apiParams = {
    search: searchTerm,
    status: filterStatus === 'all' ? '' : filterStatus,
    page: currentPage,
    limit: pageSize
  };

  // Fetch pending fees data from API
  const { data: pendingFeesData, isLoading, error, refetch } = usePendingFees(apiParams);

  // Extract data from API response
  const pendingFees = pendingFeesData?.data || [];
  const totalStudents = pendingFeesData?.totalStudents || 0;
  const pagination = pendingFeesData?.pagination || {};
  const totalPages = pagination.totalPages || 1;

  // Pagination handlers
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSendEmail = (student) => {
    // For now, send to dummy email - later will use student's actual email
    const dummyEmail = 'john@email.com';

    // Create email content
    const subject = `Fee Payment Reminder - ${student.studentName}`;
    const body = `Dear ${student.studentName},

This is a friendly reminder regarding your pending fee payment.

Student Details:
- Name: ${student.studentName}
- Registration No: ${student.registrationNo}
- Course: ${student.courseName}
- Total Course Fee: ₹${(student.courseFee || 0).toLocaleString()}
- Amount Paid: ₹${(student.totalReceivedFees || 0).toLocaleString()}
- Pending Amount: ₹${(student.pendingFees || 0).toLocaleString()}
- Due Date: ${student.nextDueDate ? new Date(student.nextDueDate).toLocaleDateString() : 'Not specified'}

Please make the payment at your earliest convenience to avoid any late fees or service interruptions.

If you have already made the payment, please ignore this email.

Thank you for your attention to this matter.

Best regards,
Target Board Team`;

    // Create mailto link
    const mailtoLink = `mailto:${dummyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.open(mailtoLink);

    setSnackbar({
      open: true,
      message: `Email reminder sent to ${dummyEmail} for ${student.studentName}`,
      severity: 'success'
    });
  };

  const getStatusColor = (dueDate) => {
    if (!dueDate) return 'default';
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'error'; // Overdue
    if (diffDays === 0) return 'warning'; // Due today
    return 'info'; // Upcoming
  };

  const getStatusText = (dueDate) => {
    if (!dueDate) return 'No Due Date';
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue (${Math.abs(diffDays)} days)`;
    if (diffDays === 0) return 'Due Today';
    return `Due in ${diffDays} days`;
  };

  const getDaysOverdue = (dueDate) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? Math.abs(diffDays) : 0;
  };

  // Calculate statistics
  const totalPendingAmount = pendingFees.reduce((sum, student) => sum + (student.pendingFees || 0), 0);
  const overdueCount = pendingFees.filter(student => getDaysOverdue(student.nextDueDate) > 0).length;
  const dueTodayCount = pendingFees.filter(student => {
    if (!student.nextDueDate) return false;
    const today = new Date();
    const due = new Date(student.nextDueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0;
  }).length;

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
          Pending Fee
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage pending fee payments
        </Typography>
      </Box>


      {/* Search and Filters */}
      <Card sx={{ mb: 3, borderRadius: '4px' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1.5fr' },
            gap: 3,
            alignItems: 'center'
          }}>
              <TextField
                fullWidth
                placeholder="Search by student name or ID..."
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
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Filter by Status"
                sx={{ borderRadius: '4px' }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="due">Due Today</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                sx={{ borderRadius: '4px' }}
                >
                  Advanced Filter
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
                  startIcon={<DownloadIcon />}
                sx={{ borderRadius: '4px' }}
                >
                  Export Report
                </Button>
              </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Pending Fees Table */}
      <Card sx={{ borderRadius: '4px', overflow: 'hidden' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">
              Error loading pending fees: {error.message}
            </Typography>
            <Button variant="contained" onClick={() => refetch()} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        ) : pendingFees.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 3 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
              No Pending Fees Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              {searchTerm ? 'No students match your search criteria. Try adjusting your filters.' : 'All students have paid their fees or no pending fees exist.'}
            </Typography>
          </Box>
        ) : (
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Fee Details</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {pendingFees.map((student) => (
                  <TableRow key={student.studentId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            getDaysOverdue(student.nextDueDate) > 0 ? (
                            <WarningIcon sx={{ color: 'error.main', fontSize: 16 }} />
                          ) : null
                        }
                      >
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {student.studentName?.charAt(0) || 'S'}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {student.studentName || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {student.registrationNo || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {student.courseName || 'N/A'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Total: ₹{(student.courseFee || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="success.main">
                          Paid: ₹{(student.totalReceivedFees || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="error.main" display="block">
                          Pending: ₹{(student.pendingFees || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                          {student.nextDueDate ? new Date(student.nextDueDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                        {getDaysOverdue(student.nextDueDate) > 0 && (
                          <Typography variant="caption" color="error.main">
                            {getDaysOverdue(student.nextDueDate)} days overdue
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                        label={getStatusText(student.nextDueDate)}
                        color={getStatusColor(student.nextDueDate)}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                      <Box>
                    <Typography variant="body2">
                          {student.contactNumber || 'N/A'}
                    </Typography>
                      </Box>
                  </TableCell>
                  <TableCell>
                      <Tooltip title="Send Email Reminder">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleSendEmail(student)}
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            }
                          }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
                  </TableContainer>
        )}
      </Card>

      {/* Pagination */}
      {!isLoading && !error && pendingFees.length > 0 && (
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
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalStudents)} of {totalStudents} entries
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

export default PendingFeePage;
