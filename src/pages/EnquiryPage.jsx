import React, { useMemo, useState } from 'react';
import { FaPhone, FaUser, FaEnvelope, FaCalendarAlt, FaClock, FaSearch, FaFilter } from 'react-icons/fa';
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
  Menu,
  Pagination,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Call as CallIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Update as UpdateIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import useInquiries from '../hooks/useInquiries';

const EnquiryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [filterStatus, setFilterStatus] = useState('all');
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesValue, setNotesValue] = useState('');
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(null);
  const [followUpDate, setFollowUpDate] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);

  const { data, total, page, pages, limit, search, loading, error, setPage, setLimit, setSearch, createInquiry, updateInquiry, deleteInquiry, updateInquiryStatus } = useInquiries({ page: currentPage, limit: pageSize, search: searchTerm, status: filterStatus !== 'all' ? filterStatus : undefined });

  const enquiries = useMemo(() => data || [], [data]);

  // Calculate stats from enquiries data
  const stats = useMemo(() => {
    const totalEnquiries = enquiries.length;
    const today = new Date().toDateString();
    const newToday = enquiries.filter(enquiry => 
      enquiry.enquiry_date && new Date(enquiry.enquiry_date).toDateString() === today
    ).length;
    
    const converted = enquiries.filter(enquiry => 
      enquiry.status === 'Converted'
    ).length;
    
    const followUp = enquiries.filter(enquiry => 
      enquiry.status === 'Follow Up'
    ).length;

    return {
      total: totalEnquiries,
      newToday,
      converted,
      followUp
    };
  }, [enquiries]);

  const getStatusColor = (status) => {
    const normalized = (status || '').toString().toLowerCase();
    switch (normalized) {
      case 'new': return 'primary';
      case 'contacted': return 'warning';
      case 'follow up':
      case 'follow-up': return 'secondary';
      case 'converted': return 'success';
      default: return 'default';
    }
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

  const handleCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const handleEditNotes = (enquiryId, currentNotes) => {
    setEditingNotes(enquiryId);
    setNotesValue(currentNotes || '');
  };

  const handleSaveNotes = async (enquiryId) => {
    try {
      await updateInquiry(enquiryId, { notes: notesValue });
      setEditingNotes(null);
      setNotesValue('');
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingNotes(null);
    setNotesValue('');
  };

  const handleStatusUpdate = async (enquiryId, status, followUpDateValue = null) => {
    try {
      const statusData = { status };
      if (status === 'follow-up' && followUpDateValue) {
        statusData.followUpDate = followUpDateValue;
      }
      await updateInquiryStatus(enquiryId, statusData);
      setStatusUpdateDialog(null);
      setFollowUpDate('');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openStatusDialog = (enquiryId, status) => {
    handleCloseMenu();
    if (status === 'follow-up') {
      setStatusUpdateDialog({ enquiryId, status });
      setFollowUpDate('');
    } else {
      handleStatusUpdate(enquiryId, status);
    }
  };

  const handleOpenMenu = (event, enquiryId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEnquiryId(enquiryId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedEnquiryId(null);
  };

  // Reset page when status filter changes
  React.useEffect(() => {
    setCurrentPage(1);
    setPage(1);
  }, [filterStatus]);

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
      {/* Header */}
      <Card sx={{ mb: { xs: 2, sm: 3 }, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Enquiry Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                Track and manage student enquiries and leads
              </Typography>
            </Box>
            <PhoneIcon sx={{ fontSize: { xs: 40, sm: 60 }, opacity: 0.8 }} />
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
                  Total Enquiries
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {stats.total}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 } }}>
                <PhoneIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  New Today
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.newToday}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main', width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 } }}>
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
                  Converted
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.converted}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.light', width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 } }}>
                <EmailIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Follow Up
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.followUp}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'warning.main', width: { xs: 44, sm: 56 }, height: { xs: 44, sm: 56 } }}>
                <ScheduleIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Create Inquiry */}
      <Card sx={{ mb: { xs: 2, sm: 3 } }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Create Inquiry
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
            >
              Add New Inquiry
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
              onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); setPage(1); }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="follow-up">Follow Up</MenuItem>
                  <MenuItem value="converted">Converted</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <TextField
              size="small"
              placeholder="Search enquiries..." 
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

      {/* Enquiries Table */}
      <Card sx={{ borderRadius: '4px', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: { xs: 3, sm: 4 } }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
            <Typography color="error">
              Error loading enquiries: {error}
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        ) : enquiries.length === 0 ? (
          <Box sx={{ p: { xs: 4, sm: 8 }, textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: { xs: 56, sm: 80 }, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2, fontWeight: 600, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              No Enquiries Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              {searchTerm ? 'No enquiries match your search criteria. Try adjusting your filters.' : 'No enquiry records found.'}
            </Typography>
          </Box>
        ) : (
          isMobile ? (
            // Mobile Card View
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 1 }}>
              {enquiries.map((enquiry) => (
                <Card 
                  key={enquiry._id} 
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    {/* Header with Avatar and Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                        {enquiry.name?.charAt(0) || 'E'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.85rem' }}>
                          {enquiry.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>
                          {enquiry.center || 'N/A'}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, enquiry._id)}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    {/* Details Row */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.78rem' }}>
                          {enquiry.mobile || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>
                          {enquiry.enquiry_date ? new Date(enquiry.enquiry_date).toLocaleDateString('en-GB') : 'N/A'}
                        </Typography>
                      </Box>
                      {enquiry.class && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>
                            Class: {enquiry.class}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>
                          Status:
                        </Typography>
                        <Chip 
                          label={enquiry.status || 'New'} 
                          color={getStatusColor(enquiry.status || 'New')}
                          size="small"
                          sx={{ fontSize: '0.68rem', height: 20 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mt: 0.5 }}>
                        {editingNotes === enquiry._id ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                            <TextField
                              size="small"
                              multiline
                              rows={2}
                              value={notesValue}
                              onChange={(e) => setNotesValue(e.target.value)}
                              placeholder="Add notes..."
                              sx={{ fontSize: '0.72rem' }}
                            />
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleSaveNotes(enquiry._id)}
                                sx={{ p: 0.5 }}
                              >
                                <SaveIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={handleCancelEdit}
                                sx={{ p: 0.5 }}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
                            <Typography variant="body2" sx={{ 
                              color: '#6b7280', 
                              fontSize: '0.72rem', 
                              fontStyle: enquiry.notes ? 'normal' : 'italic',
                              flex: 1
                            }}>
                              Notes: {enquiry.notes || 'No notes'}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleEditNotes(enquiry._id, enquiry.notes)}
                              sx={{ p: 0.5, ml: 'auto' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedEnquiryId === enquiry._id}
                    onClose={handleCloseMenu}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem 
                      onClick={() => openStatusDialog(enquiry._id, 'contacted')}
                      sx={{ color: 'warning.main' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">Mark as Contacted</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem 
                      onClick={() => openStatusDialog(enquiry._id, 'follow-up')}
                      sx={{ color: 'secondary.main' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">Mark as Follow-Up</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem 
                      onClick={() => openStatusDialog(enquiry._id, 'converted')}
                      sx={{ color: 'success.main' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">Mark as Converted</Typography>
                      </Box>
                    </MenuItem>
                    {enquiry.mobile && (
                      <MenuItem 
                        onClick={() => {
                          handleCloseMenu();
                          handleCall(enquiry.mobile);
                        }}
                        sx={{ color: 'success.main' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CallIcon fontSize="small" />
                          <Typography variant="body2">Call</Typography>
                        </Box>
                      </MenuItem>
                    )}
                    <MenuItem 
                      onClick={async () => {
                        handleCloseMenu();
                        if (window.confirm('Delete this inquiry?')) {
                          await deleteInquiry(enquiry._id);
                        }
                      }}
                      sx={{ color: 'error.main' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DeleteIcon fontSize="small" />
                        <Typography variant="body2">Delete</Typography>
                      </Box>
                    </MenuItem>
                  </Menu>
                </Card>
              ))}
            </Box>
          ) : (
            // Desktop Table View
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Mobile</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Center</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Enquiry Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {enquiries.map((enquiry) => (
                    <TableRow key={enquiry._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {enquiry.name?.charAt(0) || 'E'}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {enquiry.name || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                          <Typography variant="body2">
                            {enquiry.mobile || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{enquiry.center || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{enquiry.class || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={enquiry.status || 'New'} 
                          color={getStatusColor(enquiry.status || 'New')}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {editingNotes === enquiry._id ? (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
                            <TextField
                              size="small"
                              multiline
                              rows={2}
                              value={notesValue}
                              onChange={(e) => setNotesValue(e.target.value)}
                              placeholder="Add notes..."
                              sx={{ fontSize: '0.875rem' }}
                            />
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleSaveNotes(enquiry._id)}
                                sx={{ p: 0.5 }}
                              >
                                <SaveIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={handleCancelEdit}
                                sx={{ p: 0.5 }}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
                            <Typography variant="body2" sx={{ 
                              maxWidth: 180, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              fontStyle: enquiry.notes ? 'normal' : 'italic',
                              color: enquiry.notes ? 'text.primary' : 'text.secondary',
                              flex: 1
                            }}>
                              {enquiry.notes || 'No notes'}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleEditNotes(enquiry._id, enquiry.notes)}
                              sx={{ p: 0.5 }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
                          <Typography variant="body2">
                            {enquiry.enquiry_date ? new Date(enquiry.enquiry_date).toLocaleDateString('en-GB') : 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleOpenMenu(e, enquiry._id)}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedEnquiryId === enquiry._id}
                          onClose={handleCloseMenu}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          <MenuItem 
                            onClick={() => openStatusDialog(enquiry._id, 'contacted')}
                            sx={{ color: 'warning.main' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">Mark as Contacted</Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem 
                            onClick={() => openStatusDialog(enquiry._id, 'follow-up')}
                            sx={{ color: 'secondary.main' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">Mark as Follow-Up</Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem 
                            onClick={() => openStatusDialog(enquiry._id, 'converted')}
                            sx={{ color: 'success.main' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">Mark as Converted</Typography>
                            </Box>
                          </MenuItem>
                          {enquiry.mobile && (
                            <MenuItem 
                              onClick={() => {
                                handleCloseMenu();
                                handleCall(enquiry.mobile);
                              }}
                              sx={{ color: 'success.main' }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CallIcon fontSize="small" />
                                <Typography variant="body2">Call</Typography>
                              </Box>
                            </MenuItem>
                          )}
                          <MenuItem 
                            onClick={async () => {
                              handleCloseMenu();
                              if (window.confirm('Delete this inquiry?')) {
                                await deleteInquiry(enquiry._id);
                              }
                            }}
                            sx={{ color: 'error.main' }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DeleteIcon fontSize="small" />
                              <Typography variant="body2">Delete</Typography>
                            </Box>
                          </MenuItem>
                        </Menu>
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
      {!loading && !error && enquiries.length > 0 && (
        <Card sx={{ mt: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 1.25, sm: 2 } }}>
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
                    value={pageSize}
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
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} entries
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: '0.7rem',
                  display: { xs: 'block', sm: 'none' }
                }}>
                  {currentPage} of {pages} pages
                </Typography>
              </Box>
              <Pagination
                count={pages}
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

      {/* Create Inquiry Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Inquiry</DialogTitle>
        <DialogContent>
          <InquiryCreateForm onCreate={createInquiry} onClose={() => setOpenCreateDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Follow-Up Date Dialog */}
      <Dialog 
        open={!!statusUpdateDialog} 
        onClose={() => {
          setStatusUpdateDialog(null);
          setFollowUpDate('');
        }} 
        maxWidth="xs" 
        fullWidth
      >
        <DialogTitle>Set Follow-Up Date</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              type="date"
              label="Follow-Up Date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setStatusUpdateDialog(null);
              setFollowUpDate('');
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (statusUpdateDialog && followUpDate) {
                handleStatusUpdate(statusUpdateDialog.enquiryId, statusUpdateDialog.status, followUpDate);
              }
            }}
            disabled={!followUpDate}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnquiryPage;

const InquiryCreateForm = ({ onCreate, onClose }) => {
  const [form, setForm] = useState({ name: '', mobile: '', address: '', class: '', center: '', notes: '' });
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
      // Only include optional fields if they have values
      const formData = {
        name: form.name,
        mobile: form.mobile,
        ...(form.class && { class: form.class }),
        ...(form.address && { address: form.address }),
        ...(form.center && { center: form.center }),
        ...(form.notes && { notes: form.notes }),
      };
      await onCreate(formData);
      setForm({ name: '', mobile: '', address: '', class: '', center: '', notes: '' });
      if (onClose) onClose();
    } catch (err) {
      setError(err?.message || 'Failed to create inquiry');
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
          name="name"
          label="Name"
          value={form.name}
          onChange={handleChange}
          required
          disabled={submitting}
        />
        <TextField
          fullWidth
          name="mobile"
          label="Mobile"
          value={form.mobile}
          onChange={handleChange}
          required
          disabled={submitting}
        />
        <TextField
          fullWidth
          name="address"
          label="Address (Optional)"
          value={form.address}
          onChange={handleChange}
          multiline
          rows={2}
          disabled={submitting}
          sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
        />
        <TextField
          fullWidth
          name="class"
          label="Class"
          value={form.class}
          onChange={handleChange}
          disabled={submitting}
        />
        <TextField
          fullWidth
          name="center"
          label="Center (Optional)"
          value={form.center}
          onChange={handleChange}
          disabled={submitting}
        />
        <TextField
          fullWidth
          name="notes"
          label="Notes (Optional)"
          value={form.notes}
          onChange={handleChange}
          multiline
          rows={2}
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
          {submitting ? 'Creating...' : 'Create Inquiry'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
