import React, { useMemo, useState } from 'react';
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
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon
} from '@mui/icons-material';
import useStaff from '../hooks/useStaff';

const StaffPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, total, page, pages, limit, search, loading, error, setPage, setLimit, setSearch, createStaff, updateStaff, deleteStaff, toggleBlockStaff } = useStaff({ page: currentPage, limit: pageSize, search: searchTerm });

  const staff = useMemo(() => data || [], [data]);

  const getStatusColor = (isBlocked) => {
    return isBlocked ? 'error' : 'success';
  };

  const getStatusText = (isBlocked) => {
    return isBlocked ? 'Blocked' : 'Active';
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setLimit(newPageSize);
    setCurrentPage(1);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSearch(value);
  };

  const handleCreateStaff = async (staffData) => {
    try {
      await createStaff(staffData);
      setOpenCreateDialog(false);
    } catch (error) {
      console.error('Error creating staff:', error);
    }
  };

  const handleEditStaff = async (id, staffData) => {
    try {
      await updateStaff(id, staffData);
      setOpenEditDialog(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await deleteStaff(id);
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await toggleBlockStaff(id);
    } catch (error) {
      console.error('Error toggling block status:', error);
    }
  };

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setOpenEditDialog(true);
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
      {/* Header */}
      <Card sx={{ mb: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Staff Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Manage staff accounts and permissions
              </Typography>
            </Box>
            <PersonIcon sx={{ fontSize: { xs: 40, sm: 60 }, opacity: 0.8 }} />
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: { xs: 2, sm: 3 }, 
        mb: { xs: 2, sm: 3 } 
      }}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Total Staff
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {total}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 } }}>
                <PersonIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Active Staff
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {staff.filter(s => !s.isBlocked).length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 } }}>
                <LockOpenIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Blocked Staff
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {staff.filter(s => s.isBlocked).length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'error.main', width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 } }}>
                <LockIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Current Page
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {staff.length}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main', width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 } }}>
                <BadgeIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Create Staff */}
      <Card sx={{ mb: { xs: 2, sm: 3 } }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Staff Management
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
            >
              Add New Staff
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card sx={{ mb: { xs: 2, sm: 3 } }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FilterIcon color="action" />
              <Typography variant="body2" color="textSecondary">
                Filter by:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              size="small"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: { xs: 200, sm: 250 } }}
            />
            
          </Box>
        </CardContent>
      </Card>


      {/* Staff Table */}
      <Card sx={{ borderRadius: '4px', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 3, sm: 4 } }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
            <Typography color="error">
              Error loading staff: {error}
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        ) : staff.length === 0 ? (
          <Box sx={{ p: { xs: 4, sm: 8 }, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: { xs: 56, sm: 80 }, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              No Staff Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              {searchTerm ? 'No staff match your search criteria. Try adjusting your filters.' : 'No staff records found.'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Staff</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Staff Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'warning.main' }}>
                    Plain Password
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 34, sm: 40 }, height: { xs: 34, sm: 40 }, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                          {staffMember.staffname?.charAt(0) || 'S'}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                          {staffMember.staffname || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BadgeIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                          {staffMember.staffcode || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                          {staffMember.mobile_number || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace',
                          color: 'warning.main',
                          fontWeight: 600,
                          backgroundColor: 'warning.light',
                          padding: { xs: '2px 6px', sm: '4px 8px' },
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}
                      >
                        {staffMember.plainPassword || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(staffMember.isBlocked)}
                        color={getStatusColor(staffMember.isBlocked)}
                        size="small"
                        sx={{ fontWeight: 600, height: { xs: 22, sm: 24 }, '& .MuiChip-label': { px: { xs: 0.75, sm: 1 } } }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: { xs: 0.75, sm: 1 } }}>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(staffMember)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color={staffMember.isBlocked ? "success" : "warning"}
                          onClick={() => handleToggleBlock(staffMember._id)}
                        >
                          {staffMember.isBlocked ? <LockOpenIcon /> : <BlockIcon />}
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteStaff(staffMember._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
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
      {!loading && !error && staff.length > 0 && (
        <Card sx={{ mt: { xs: 2, sm: 3 }, borderRadius: '4px' }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: { xs: 1.5, sm: 2 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Rows per page:
                </Typography>
                <FormControl size="small" sx={{ minWidth: { xs: 70, sm: 80 } }}>
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
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} entries
                </Typography>
              </Box>
              <Pagination
                count={pages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
                showFirstButton
                showLastButton
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Create Staff Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Staff Member</DialogTitle>
        <DialogContent>
          <StaffForm onSubmit={handleCreateStaff} onClose={() => setOpenCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Staff Member</DialogTitle>
        <DialogContent>
          <StaffForm 
            onSubmit={(data) => handleEditStaff(selectedStaff._id, data)} 
            onClose={() => setOpenEditDialog(false)}
            initialData={selectedStaff}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Staff Form Component
const StaffForm = ({ onSubmit, onClose, initialData = null }) => {
  const [form, setForm] = useState({
    staffname: initialData?.staffname || '',
    mobile_number: initialData?.mobile_number || '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const submitData = { ...form };
      if (initialData && !submitData.password) {
        delete submitData.password; // Don't update password if empty
      }
      await onSubmit(submitData);
      setForm({ staffname: '', mobile_number: '', password: '' });
    } catch (err) {
      setError(err?.message || 'Failed to save staff member');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2 
      }}>
        <TextField
          fullWidth
          name="staffname"
          label="Staff Name"
          value={form.staffname}
          onChange={handleChange}
          required
          disabled={submitting}
        />
        <TextField
          fullWidth
          name="mobile_number"
          label="Mobile Number"
          value={form.mobile_number}
          onChange={handleChange}
          required
          disabled={submitting}
        />
        <TextField
          fullWidth
          name="password"
          label={initialData ? "New Password (leave empty to keep current)" : "Password"}
          type="password"
          value={form.password}
          onChange={handleChange}
          required={!initialData}
          disabled={submitting}
          sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
        />
        {error && (
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
        <Box sx={{ 
          gridColumn: { xs: '1', sm: '1 / -1' },
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          {onClose && (
            <Button onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? 'Saving...' : (initialData ? 'Update Staff' : 'Create Staff')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StaffPage;
