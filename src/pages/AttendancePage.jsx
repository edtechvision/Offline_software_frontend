import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Sort as SortIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useAttendance } from '../hooks/useAttendance';

const AttendancePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Attendance hook
  const {
    data: attendanceData,
    totalRecords,
    currentPage,
    totalPages,
    limit,
    search: attendanceSearch,
    startDate,
    endDate,
    sortBy,
    order,
    loading: attendanceLoading,
    error: attendanceError,
    setCurrentPage,
    setLimit,
    setSearch: setAttendanceSearch,
    setDateRange,
    setSort,
    fetchAttendance
  } = useAttendance();

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setLimit(newPageSize);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Attendance Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Track and manage student attendance records
              </Typography>
            </Box>
            <HistoryIcon sx={{ fontSize: 60, opacity: 0.8 }} />
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3, 
        mb: 3 
      }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Total Records
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {totalRecords}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <HistoryIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Present Today
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {attendanceData?.filter(record => {
                    const today = new Date().toDateString();
                    return new Date(record.date).toDateString() === today;
                  }).length || 0}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                <CheckCircleIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  This Week
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {attendanceData?.filter(record => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(record.date) >= weekAgo;
                  }).length || 0}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                <CalendarIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  This Month
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {attendanceData?.filter(record => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return new Date(record.date) >= monthAgo;
                  }).length || 0}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                <PersonIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2
          }}>
            {/* Search and Sort Row */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <TextField
                placeholder="Search attendance..."
                value={attendanceSearch}
                onChange={(e) => setAttendanceSearch(e.target.value)}
                size="small"
                sx={{ flex: 1, minWidth: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#1976d2' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSort(e.target.value, order)}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="studentId">Student ID</MenuItem>
                  <MenuItem value="markedBy">Staff</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={order}
                  label="Order"
                  onChange={(e) => setSort(sortBy, e.target.value)}
                >
                  <MenuItem value="desc">Desc</MenuItem>
                  <MenuItem value="asc">Asc</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Date Range Row */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setDateRange(e.target.value, endDate)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setDateRange(startDate, e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
              />
              <Button
                variant="outlined"
                onClick={() => setDateRange('', '')}
                size="small"
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)'
                  }
                }}
              >
                Clear Dates
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card sx={{ borderRadius: '4px', overflow: 'hidden' }}>
        {attendanceLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : attendanceError ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">
              Error loading attendance: {attendanceError}
            </Typography>
            <Button variant="contained" onClick={() => fetchAttendance()} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        ) : attendanceData?.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <HistoryIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
              No Attendance Records Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              Attendance records will appear here after students are marked present.
            </Typography>
          </Box>
        ) : (
          isMobile ? (
            // Mobile Card View
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1 }}>
              {attendanceData?.map((record, index) => (
                <Card 
                  key={record._id || index} 
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    {/* Header with Avatar and Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        {record.studentId?.studentName?.charAt(0) || 'S'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                          {record.studentId?.studentName || 'Unknown Student'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                          ID: {record.registrationNo || record.studentId?.registrationNo || 'N/A'}
                        </Typography>
                      </Box>
                      <Chip
                        label={record.status || 'Present'}
                        color="success"
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 24,
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    </Box>
                    
                    {/* Details Row */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.8rem' }}>
                          By: {record.markedBy?.staffname || 'Unknown Staff'} ({record.markedBy?.staffcode || 'N/A'})
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                          {new Date(record.date).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            // Desktop Table View
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Registration No</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Marked By</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData?.map((record, index) => (
                    <TableRow key={record._id || index} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {record.studentId?.studentName?.charAt(0) || 'S'}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {record.studentId?.studentName || 'Unknown Student'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.registrationNo || record.studentId?.registrationNo || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={record.status || 'Present'}
                          color="success"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {record.markedBy?.staffname || 'Unknown Staff'} ({record.markedBy?.staffcode || 'N/A'})
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(record.date).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
      </Card>

      {/* Pagination */}
      {!attendanceLoading && !attendanceError && attendanceData?.length > 0 && (
        <Card sx={{ mt: 2, borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 2 }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, sm: 2 },
                flexWrap: 'wrap'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Rows per page:
                </Typography>
                <FormControl size="small" sx={{ minWidth: { xs: 60, sm: 80 } }}>
                  <Select
                    value={limit}
                    onChange={handlePageSizeChange}
                    sx={{ 
                      borderRadius: 2,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    <MenuItem value={5} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>5</MenuItem>
                    <MenuItem value={10} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>10</MenuItem>
                    <MenuItem value={25} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>25</MenuItem>
                    <MenuItem value={50} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>50</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: { xs: '0.7rem', sm: '0.875rem' },
                  display: { xs: 'none', sm: 'block' }
                }}>
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} entries
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: '0.7rem',
                  display: { xs: 'block', sm: 'none' }
                }}>
                  {currentPage} of {totalPages} pages
                </Typography>
              </Box>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                showFirstButton={!isMobile}
                showLastButton={!isMobile}
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 1}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    minWidth: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 }
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AttendancePage;
