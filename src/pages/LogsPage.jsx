import React, { useState, useEffect } from 'react';
import { FaHistory, FaFilter, FaSearch, FaCalendarAlt, FaUser, FaCode, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useLogs } from '../hooks';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  Collapse,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const LogsPage = () => {
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    status: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  });
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const { logs, loading, error, pagination, refetch } = useLogs(filters);

  // Action types based on the API response
  const actionTypes = [
    'FEE_CREATED',
    'CREATE_STUDENT',
    'PAYMENT_ADDED',
    'STUDENT_UPDATED',
    'FEE_UPDATED',
    'EXPENSE_CREATED',
    'EXPENSE_UPDATED',
    'EXPENSE_DELETED',
    'LOGIN',
    'LOGOUT'
  ];

  const userTypes = ['Admin', 'Incharge', 'Center', 'Student'];
  const statusTypes = ['SUCCESS', 'ERROR', 'PENDING'];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (event, newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage + 1
    }));
  };

  const handleRowsPerPageChange = (event) => {
    setFilters(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1
    }));
  };

  const toggleRowExpansion = (logId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedRows(newExpanded);
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      user: '',
      status: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 20
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <FaCheckCircle className="text-green-500" />;
      case 'ERROR':
        return <FaTimesCircle className="text-red-500" />;
      case 'PENDING':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'ERROR':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatActionName = (action) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Logs</h1>
            <p className="text-indigo-100">Monitor system activities and track user actions</p>
          </div>
          <FaHistory className="text-5xl text-indigo-200" />
        </div>
      </div>

      {/* Filters Section */}
      <Card className="shadow-xl">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaFilter className="mr-2 text-indigo-600" />
              Filters & Search
            </h2>
            <Button
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          <Collapse in={showFilters}>
            <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Action Type</InputLabel>
                  <Select
                    value={filters.action}
                    onChange={(e) => handleFilterChange('action', e.target.value)}
                    label="Action Type"
                  >
                    <MenuItem value="">All Actions</MenuItem>
                    {actionTypes.map((action) => (
                      <MenuItem key={action} value={action}>
                        {formatActionName(action)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel>User Type</InputLabel>
                  <Select
                    value={filters.user}
                    onChange={(e) => handleFilterChange('user', e.target.value)}
                    label="User Type"
                  >
                    <MenuItem value="">All Users</MenuItem>
                    {userTypes.map((user) => (
                      <MenuItem key={user} value={user}>
                        {user}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All Status</MenuItem>
                    {statusTypes.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel>Items Per Page</InputLabel>
                  <Select
                    value={filters.limit}
                    onChange={(e) => handleFilterChange('limit', e.target.value)}
                    label="Items Per Page"
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box className="flex items-end">
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="shadow-xl">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaHistory className="mr-2 text-indigo-600" />
              Activity Logs
            </h2>
            <div className="text-sm text-gray-600">
              Total: {pagination.total} logs | Page {pagination.page} of {pagination.totalPages}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <CircularProgress />
              <span className="ml-2">Loading logs...</span>
            </div>
          ) : error ? (
            <Alert severity="error" className="mb-4">
              Error: {error}
            </Alert>
          ) : (
            <TableContainer component={Paper} className="shadow-sm">
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-semibold">Action</TableCell>
                    <TableCell className="font-semibold">User</TableCell>
                    <TableCell className="font-semibold">Status</TableCell>
                    <TableCell className="font-semibold">Date</TableCell>
                    <TableCell className="font-semibold">Details</TableCell>
                    <TableCell className="font-semibold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <React.Fragment key={log._id}>
                        <TableRow className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{formatActionName(log.action)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <FaUser className="text-gray-400" />
                              <span>{log.user}</span>
                              {log.inchargeCode && (
                                <Chip
                                  label={log.inchargeCode}
                                  size="small"
                                  variant="outlined"
                                  className="text-xs"
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(log.status)}
                              label={log.status}
                              color={getStatusColor(log.status)}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <FaCalendarAlt className="text-gray-400" />
                              <span className="text-sm">{formatDate(log.createdAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {log.details ? (
                                <span className="text-sm text-gray-600">
                                  {Object.keys(log.details).length} field(s)
                                </span>
                              ) : (
                                <span className="text-gray-400">No details</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton
                                size="small"
                                onClick={() => toggleRowExpansion(log._id)}
                              >
                                {expandedRows.has(log._id) ? <ExpandLess /> : <ExpandMore />}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded Row Details */}
                        <TableRow>
                          <TableCell colSpan={6} className="p-0">
                            <Collapse in={expandedRows.has(log._id)} timeout="auto" unmountOnExit>
                              <Box className="p-4 bg-gray-50">
                                <Typography variant="h6" className="mb-3">
                                  Log Details
                                </Typography>
                                
                                <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <Box>
                                    <Typography variant="subtitle2" className="font-semibold mb-1">
                                      Action Details:
                                    </Typography>
                                    <pre className="bg-white p-3 rounded border text-xs overflow-auto">
                                      {JSON.stringify(log.details, null, 2)}
                                    </pre>
                                  </Box>
                                  
                                  <Box>
                                    <Typography variant="subtitle2" className="font-semibold mb-1">
                                      Additional Information:
                                    </Typography>
                                    <div className="space-y-2">
                                      <div>
                                        <span className="font-medium">Log ID:</span>
                                        <span className="ml-2 text-sm text-gray-600">{log._id}</span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Error:</span>
                                        <span className="ml-2 text-sm text-gray-600">
                                          {log.error || 'None'}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium">Created At:</span>
                                        <span className="ml-2 text-sm text-gray-600">
                                          {formatDate(log.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </Box>
                                </Box>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {logs.length > 0 && (
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page - 1}
              onPageChange={handlePageChange}
              rowsPerPage={pagination.limit}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[10, 20, 50, 100]}
              className="border-t"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;
