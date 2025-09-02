import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentFees } from '../hooks';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  Avatar,
  InputAdornment,
  Checkbox,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Menu as MenuIcon,
  Print as PrintIcon,
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useStudent } from '../hooks';

const FeeCollectionComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFees, setSelectedFees] = useState([]);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: 'Cash',
    transactionId: '',
    remarks: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch student data
  const { data: studentData, isLoading, error: studentError } = useStudent(id);
  
  // Fetch student fees data
  const { data: feesData, isLoading: feesLoading, error: feesError } = useStudentFees(id);

  useEffect(() => {
    if (studentData?.success && studentData?.data) {
      setStudent(studentData.data);
    }
    
    if (studentError || feesError) {
      setError(studentError?.message || feesError?.message || 'Failed to load data');
    }
    
    if (!isLoading && !feesLoading) {
      setLoading(false);
    }
  }, [studentData, studentError, feesData, feesError, isLoading, feesLoading]);

  // Map API data to fee groups structure
  const feeGroups = React.useMemo(() => {
    if (!feesData?.success || !feesData?.data || feesData.data.length === 0) {
      return [];
    }



    return feesData.data.map((feeRecord, index) => {
      const studentInfo = feeRecord.studentId;
      const courseInfo = feeRecord.courseId;
      const batchInfo = feeRecord.batchId;
      
      // Determine status based on payment
      let status = "Pending";
      if (feeRecord.paidAmount >= feeRecord.totalFee) {
        status = "Paid";
      } else if (feeRecord.paidAmount > 0) {
        status = "Partial";
      }

      // Map payment history to payments array
      const payments = feeRecord.paymentHistory?.map((payment, paymentIndex) => ({
        id: payment._id || paymentIndex + 1,
        paymentId: payment.receiptNo || `PAY${paymentIndex + 1}`,
        mode: payment.paymentMode || "Cash",
        date: payment.paymentDate,
        amount: payment.amount || 0,
        discount: 0, // Not available in API
        fine: 0, // Not available in API
        transactionId: payment.transactionId || "",
        remarks: payment.remarks || ""
      })) || [];

      return {
        id: feeRecord._id || index + 1,
        name: `${studentInfo.className} - ${courseInfo.name} (${batchInfo.batchName})`,
        code: courseInfo.fee?.toString() || "0",
        dueDate: feeRecord.nextPaymentDueDate || new Date().toISOString(),
        status: status,
        amount: feeRecord.totalFee || 0,
        paid: feeRecord.paidAmount || 0,
        balance: feeRecord.pendingAmount || 0,
        discount: 0, // Not available in API
        fine: 0, // Not available in API
        payments: payments
      };
    });
  }, [feesData]);

  const handleBack = () => {
    navigate('/fee/collect');
  };

  const handleSelectFee = (feeId) => {
    setSelectedFees(prev => 
      prev.includes(feeId) 
        ? prev.filter(id => id !== feeId)
        : [...prev, feeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFees.length === feeGroups.length) {
      setSelectedFees([]);
    } else {
      setSelectedFees(feeGroups.map(fee => fee.id));
    }
  };

  const handleCollectSelected = () => {
    if (selectedFees.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one fee to collect',
        severity: 'warning'
      });
      return;
    }
    setOpenPaymentDialog(true);
  };

  const handlePaymentSubmit = () => {
    setSnackbar({
      open: true,
      message: `Payment of ₹${paymentData.amount} collected successfully`,
      severity: 'success'
    });
    setOpenPaymentDialog(false);
    setSelectedFees([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };

  if (loading || isLoading || feesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !student) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error || 'Student not found'}
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (!feesData?.success || !feesData?.data || feesData.data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No fee records found for this student
        </Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', fontSize: '1.2rem' }}>
          Student Fees
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={handleBack}
            size="small"
            sx={{ borderRadius: 1, fontSize: '0.75rem', py: 0.5, px: 1 }}
          >
            Back
          </Button>
          <IconButton size="small">
            <MenuIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          size="small"
          sx={{ borderRadius: 1, fontSize: '0.75rem', py: 0.5, px: 1 }}
        >
          Print Selected
        </Button>
        <Button
          variant="contained"
          startIcon={<PaymentIcon />}
          onClick={handleCollectSelected}
          disabled={selectedFees.length === 0}
          size="small"
          sx={{ borderRadius: 1, fontSize: '0.75rem', py: 0.5, px: 1 }}
        >
          Collect Selected
        </Button>
      </Box>

      {/* Student Profile Section */}
      <Card sx={{ mb: 2, borderRadius: 1, border: '1px solid #e0e0e0' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            {/* Student Photo */}
            <Avatar
              src={student.image}
              sx={{ width: 90, height: 90, flexShrink: 0, border: '2px solid #e0e0e0' }}
            >
              {student.studentName?.charAt(0)}
            </Avatar>
            
            {/* Student Details - Two Column Layout */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {/* Row 1 */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <Box sx={{ minWidth: '120px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#424242' }}>
                      Name:
                    </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.8rem', color: '#424242' }}>
                      {student.studentName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <Box sx={{ minWidth: '120px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#424242' }}>
                        Class (Section):
                    </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.8rem', color: '#424242' }}>
                      {student.className} ({student.courseDetails?.courseId?.name})
                    </Typography>
                  </Box>
                </Box>
                
                {/* Row 2 */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <Box sx={{ minWidth: '120px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#424242' }}>
                        Father Name:
                    </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.8rem', color: '#424242' }}>
                      {student.fathersName}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <Box sx={{ minWidth: '120px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#424242' }}>
                        Admission No:
                    </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.8rem', color: '#424242' }}>
                      {student.registrationNo}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Row 3 */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <Box sx={{ minWidth: '120px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#424242' }}>
                        Mobile Number:
                    </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.8rem', color: '#424242' }}>
                      {student.mobileNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <Box sx={{ minWidth: '120px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#424242' }}>
                        Roll Number:
                    </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.8rem', color: '#424242' }}>
                      {student.registrationNo}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Row 4 */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1.5
                }}>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    <Box sx={{ minWidth: '120px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#424242' }}>
                        Category:
                    </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 400, fontSize: '0.8rem', color: '#424242' }}>
                      {student.category || ''}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                    {/* Empty right side for balance */}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>



      {/* Date and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
          Date: {new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Delete">
            <IconButton size="small" sx={{ p: 0.5 }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add">
            <IconButton size="small" sx={{ p: 0.5 }}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View">
            <IconButton size="small" sx={{ p: 0.5 }}>
              <ReceiptIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" sx={{ p: 0.5 }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton size="small" sx={{ p: 0.5 }}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" sx={{ p: 0.5 }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Fee Details UI Boxes */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Header with Select All */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Checkbox
                      checked={selectedFees.length === feeGroups.length}
                      indeterminate={selectedFees.length > 0 && selectedFees.length < feeGroups.length}
                      onChange={handleSelectAll}
                      size="small"
                    />
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
            Select All Fees
                    </Typography>
                  </Box>

        {/* Fee Group Boxes */}
              {feeGroups.map((feeGroup) => (
          <Card key={feeGroup.id} sx={{ 
            borderRadius: 1, 
            border: '1px solid #e0e0e0',
            backgroundColor: '#ffffff',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 1.5 }}>
              {/* Fee Group Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 1,
                pb: 1,
                borderBottom: '1px solid #f0f0f0'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                        <Checkbox
                          checked={selectedFees.includes(feeGroup.id)}
                          onChange={() => handleSelectFee(feeGroup.id)}
                          size="small"
                        />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 0.5 }}>
                          {feeGroup.name}
                        </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                        Code: {feeGroup.code}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                        Due: {new Date(feeGroup.dueDate).toLocaleDateString()}
                      </Typography>
                      <Chip
                        label={feeGroup.status}
                        color={getStatusColor(feeGroup.status)}
                        size="small"
                        sx={{ fontWeight: 600, height: 18, fontSize: '0.65rem' }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem', mr: 1 }}>
                        ₹{feeGroup.amount.toFixed(2)}
                      </Typography>
                      <IconButton size="small" color="primary">
                        <PrintIcon fontSize="small" />
                      </IconButton>
                </Box>
              </Box>

              {/* Payment Details */}
              {feeGroup.payments.length > 0 && (
                <Box sx={{ ml: 0 }}>
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.7rem', 
                    color: 'text.secondary', 
                    fontWeight: 600,
                    mb: 1,
                    display: 'block'
                  }}>
                    Payment History:
                        </Typography>
                  {feeGroup.payments.map((payment, index) => (
                    <Card key={payment.id} sx={{ 
                      mb: 1, 
                      backgroundColor: '#fafafa',
                      border: '1px solid #e8e8e8',
                      borderRadius: 0.5
                    }}>
                      <CardContent sx={{ p: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, minWidth: '80px' }}>
                          {payment.paymentId}
                        </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', minWidth: '60px' }}>
                          {payment.mode}
                        </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', minWidth: '80px' }}>
                          {new Date(payment.date).toLocaleDateString()}
                        </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', minWidth: '60px' }}>
                              Discount: ₹{payment.discount.toFixed(2)}
                        </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', minWidth: '50px' }}>
                              Fine: ₹{payment.fine.toFixed(2)}
                        </Typography>
                            <Typography variant="caption" sx={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 600, 
                              color: 'success.main',
                              minWidth: '70px'
                            }}>
                              Paid: ₹{payment.amount.toFixed(2)}
                        </Typography>
                          </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" color="primary">
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="info">
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Fee Group Summary */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 1,
                pt: 1,
                borderTop: '1px solid #f0f0f0'
              }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    Discount: ₹{feeGroup.discount.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    Fine: ₹{feeGroup.fine.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: 'success.main'
                  }}>
                    Paid: ₹{feeGroup.paid.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 600, 
                    color: 'error.main'
                  }}>
                    Balance: ₹{feeGroup.balance.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Grand Total Box */}
        <Card sx={{ 
          borderRadius: 1, 
          border: '2px solid #1976d2',
          backgroundColor: '#e3f2fd',
          mt: 1
        }}>
          <CardContent sx={{ p: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Grand Total
                  </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                  Amount: ₹{feeGroups.reduce((sum, fee) => sum + fee.amount, 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                  Discount: ₹{feeGroups.reduce((sum, fee) => sum + fee.discount, 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                  Fine: ₹{feeGroups.reduce((sum, fee) => sum + fee.fine, 0).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.8rem',
                  color: 'success.main'
                }}>
                  Paid: ₹{feeGroups.reduce((sum, fee) => sum + fee.paid, 0).toFixed(2)}
                  </Typography>
                <Typography variant="body2" sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.8rem',
                  color: 'error.main'
                }}>
                  Balance: ₹{feeGroups.reduce((sum, fee) => sum + fee.balance, 0).toFixed(2)}
                  </Typography>
              </Box>
            </Box>
          </CardContent>
      </Card>
      </Box>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1 } }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e5e7eb' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MoneyIcon sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Collect Fee Payment
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {student.studentName} - {student.registrationNo}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Payment Amount"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
                size="small"
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={paymentData.paymentMode}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
                  label="Payment Mode"
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Cheque">Cheque</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Transaction ID (if applicable)"
                value={paymentData.transactionId}
                onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                size="small"
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={2}
                value={paymentData.remarks}
                onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
                size="small"
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setOpenPaymentDialog(false)}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePaymentSubmit}
            variant="contained"
            startIcon={<MoneyIcon />}
            size="small"
            sx={{ borderRadius: 1 }}
          >
            Collect Payment
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
  );
};

export default FeeCollectionComponent;
