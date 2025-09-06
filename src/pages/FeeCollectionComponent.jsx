import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentFees, useFeeDiscounts, useCollectPayment, useRevertPayment, useIncharges } from '../hooks';

import { pdf } from '@react-pdf/renderer';
import FeeCollectReceipt from '../components/FeeCollectReceipt';
import IndividualFeeReceipt from '../components/IndividualFeeReceipt';
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
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText
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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useStudent } from '../hooks';
import { useAuthContext } from '../contexts/AuthContext';


const FeeCollectionComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuthContext();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFees, setSelectedFees] = useState([]);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: 'Cash',
    transactionId: '',
    remarks: '',
    discountCode: '',
    discountAmount: 0,
    fine: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    nextPaymentDueDate: null,
    collectedBy: '',
    inchargeCode: ''
  });
  const [calculatedDiscount, setCalculatedDiscount] = useState(0);
  const [discountDetails, setDiscountDetails] = useState(null);
  const [discountFile, setDiscountFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [revertDialog, setRevertDialog] = useState({ open: false, feeId: null, receiptNo: null });
  const [pdfLoading, setPdfLoading] = useState(false);
  const [individualPdfLoading, setIndividualPdfLoading] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null });

  // Fetch student data
  const { data: studentData, isLoading, error: studentError } = useStudent(id);

  // Fetch student fees data
  const { data: feesData, isLoading: feesLoading, error: feesError } = useStudentFees(id);
  
  // Fetch discount codes
  const { data: discountsData } = useFeeDiscounts();
  
  // Fetch incharges for center users
  const { data: inchargesData } = useIncharges({}, { enabled: userRole !== 'admin' });

  console.log("inchargesData:", inchargesData)
  
  // Fee collection mutation
  const collectPaymentMutation = useCollectPayment();
  
  // Revert payment mutation
  const revertPaymentMutation = useRevertPayment();

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

  // Set collectedBy based on user role
  useEffect(() => {
    if (userRole === 'admin') {
      setPaymentData(prev => ({ ...prev, collectedBy: 'Admin' }));
    } else {
      setPaymentData(prev => ({ ...prev, collectedBy: '' }));
    }
  }, [userRole]);


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
        discount: payment.discountAmount || 0,
        fine: payment.fine || 0,
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
        discount: payments.reduce((sum, payment) => sum + (payment.discount || 0), 0),
        fine: payments.reduce((sum, payment) => sum + (payment.fine || 0), 0),
        payments: payments
      };
    });
  }, [feesData]);

  // Clear validation errors when form becomes valid
  useEffect(() => {
    // Check if form is valid and clear errors
    const hasAmount = paymentData.amount && parseFloat(paymentData.amount) > 0;
    const hasValidAmount = hasAmount && (() => {
      const selectedFeeGroups = feeGroups.filter(fee => selectedFees.includes(fee.id));
      const totalPendingAmount = selectedFeeGroups.reduce((sum, fee) => sum + fee.balance, 0);
      const paymentAmount = parseFloat(paymentData.amount);
      return paymentAmount <= totalPendingAmount;
    })();
    const hasIncharge = userRole === 'admin' || paymentData.inchargeCode;
    
    // If all validations pass, clear errors
    if (hasValidAmount && hasIncharge && Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }
  }, [paymentData.amount, paymentData.inchargeCode, selectedFees, userRole, feeGroups, validationErrors]);

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
    // Clear validation errors when opening dialog
    setValidationErrors({});
    setOpenPaymentDialog(true);
  };

  // Calculate discount based on code
  const calculateDiscount = (discountCode, amount) => {
    if (!discountCode || !discountsData?.success || !discountsData?.data) {
      setCalculatedDiscount(0);
      setDiscountDetails(null);
      return 0;
    }

    const discount = discountsData.data.find(d => d.discountCode === discountCode);
    if (!discount) {
      setCalculatedDiscount(0);
      setDiscountDetails(null);
      return 0;
    }

    let discountAmount = 0;
    if (discount.discountType === 'percentage') {
      discountAmount = (amount * discount.percentage) / 100;
    } else if (discount.discountType === 'fixed') {
      discountAmount = discount.amount;
    }

    setCalculatedDiscount(discountAmount);
    setDiscountDetails(discount);
    return discountAmount;
  };

  // Handle discount code change
  const handleDiscountCodeChange = (discountCode) => {
    setPaymentData({ ...paymentData, discountCode });
    if (paymentData.amount) {
      const discountAmount = calculateDiscount(discountCode, parseFloat(paymentData.amount));
      setPaymentData(prev => ({ ...prev, discountAmount }));
    }
  };

  // Handle amount change
  const handleAmountChange = (amount) => {
    // Only allow numeric input and prevent negative values
    const numericValue = amount.replace(/[^0-9.]/g, '');
    const parsedAmount = parseFloat(numericValue);
    
    // Set the amount first, then validate
    setPaymentData({ ...paymentData, amount: numericValue });
    
    // Check if amount exceeds pending amount for validation display
    if (numericValue && selectedFees.length > 0) {
      const selectedFeeGroups = feeGroups.filter(fee => selectedFees.includes(fee.id));
      const totalPendingAmount = selectedFeeGroups.reduce((sum, fee) => sum + fee.balance, 0);
      
      if (parsedAmount > totalPendingAmount) {
        setValidationErrors(prev => ({ 
          ...prev, 
          amount: `Payment amount (₹${parsedAmount}) cannot exceed pending amount (₹${totalPendingAmount})` 
        }));
      } else {
        setValidationErrors(prev => ({ ...prev, amount: '' }));
      }
    } else {
      setValidationErrors(prev => ({ ...prev, amount: '' }));
    }
    
    if (paymentData.discountCode) {
      const discountAmount = calculateDiscount(paymentData.discountCode, parsedAmount);
      setPaymentData(prev => ({ ...prev, discountAmount }));
    }
  };

  // Validate payment form
  const validatePaymentForm = () => {
    const errors = {};
    
    // Amount validation
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      errors.amount = 'Please enter a valid payment amount';
    } else {
      // Check if amount exceeds pending amount for selected fees
      const selectedFeeGroups = feeGroups.filter(fee => selectedFees.includes(fee.id));
      const totalPendingAmount = selectedFeeGroups.reduce((sum, fee) => sum + fee.balance, 0);
      const paymentAmount = parseFloat(paymentData.amount);
      
      if (paymentAmount > totalPendingAmount) {
        errors.amount = `Payment amount (₹${paymentAmount}) cannot exceed pending amount (₹${totalPendingAmount})`;
      }
    }
    
    // Incharge validation for non-admin users
    if (userRole !== 'admin' && !paymentData.inchargeCode) {
      errors.inchargeCode = 'Please select an incharge';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSubmit = async () => {
    // Validate form first
    if (!validatePaymentForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix validation errors before submitting',
        severity: 'error'
      });
      return;
    }

    if (selectedFees.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one fee to collect',
        severity: 'error'
      });
      return;
    }

    // Show confirmation dialog before API call
    setConfirmDialog({ 
      open: true, 
      action: 'submit' 
    });
  };

  const confirmPaymentSubmit = async () => {
    setConfirmDialog({ open: false, action: null });
    
    // Show processing toast
    setSnackbar({
      open: true,
      message: `Processing payment of ₹${paymentData.amount}...`,
      severity: 'info'
    });

    try {
      // For now, collect payment for the first selected fee
      // In a real scenario, you might want to collect for all selected fees
      const feeId = selectedFees[0];
      const feeRecord = feeGroups.find(f => f.id === feeId);
      
      if (!feeRecord) {
        setSnackbar({
          open: true,
          message: 'Selected fee not found',
          severity: 'error'
        });
        return;
      }

      const paymentPayload = {
        feeId: feeRecord.id,
        amount: parseFloat(paymentData.amount),
        paymentMode: paymentData.paymentMode,
        transactionId: paymentData.transactionId,
        remarks: paymentData.remarks,
        paymentDate: paymentData.paymentDate,
        discountCode: paymentData.discountCode,
        discountAmount: paymentData.discountAmount,
        fine: paymentData.fine,
        discountFile: discountFile,
        inchargeCode: paymentData.inchargeCode,
        nextPaymentDueDate: paymentData.nextPaymentDueDate ? paymentData.nextPaymentDueDate.toISOString().split('T')[0] : ''
      };

      // Only include collectedBy field when user role is 'admin'
      if (userRole === 'admin') {
        paymentPayload.collectedBy = paymentData.collectedBy;
      }

      await collectPaymentMutation.mutateAsync(paymentPayload);

    setSnackbar({
      open: true,
      message: `Payment of ₹${paymentData.amount} collected successfully`,
      severity: 'success'
    });
      
      // Reset form and close dialog
    setOpenPaymentDialog(false);
    setSelectedFees([]);
    setValidationErrors({});
      setPaymentData({
        amount: '',
        paymentMode: 'Cash',
        transactionId: '',
        remarks: '',
        discountCode: '',
        discountAmount: 0,
        fine: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        nextPaymentDueDate: null,
        collectedBy: userRole === 'admin' ? 'Admin' : '',
        inchargeCode: ''
      });
      setCalculatedDiscount(0);
      setDiscountDetails(null);
      setDiscountFile(null);
      
      // The data will be automatically refreshed due to React Query cache invalidation
      // in the useCollectPayment hook's onSuccess callback
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to collect payment',
        severity: 'error'
      });
    }
  };

  const handleRevertPayment = (feeId, receiptNo) => {
    if (!receiptNo) {
      setSnackbar({
        open: true,
        message: 'No receipt number found for this payment',
        severity: 'error'
      });
      return;
    }

    setRevertDialog({ open: true, feeId, receiptNo });
  };

  const confirmRevertPayment = async () => {
    try {
      await revertPaymentMutation.mutateAsync({
        feeId: revertDialog.feeId,
        receiptNo: revertDialog.receiptNo
      });

      setSnackbar({
        open: true,
        message: `Payment ${revertDialog.receiptNo} reverted successfully`,
        severity: 'success'
      });
      
      setRevertDialog({ open: false, feeId: null, receiptNo: null });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to revert payment',
        severity: 'error'
      });
    }
  };

  // Generate and download fee receipt PDF
  const handleGenerateFeeReceipt = async () => {
    if (selectedFees.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one fee to generate receipt',
        severity: 'warning'
      });
      return;
    }

    setPdfLoading(true);
    try {
      const feeId = selectedFees[0];
      const feeRecord = feeGroups.find(f => f.id === feeId);
      
      if (!feeRecord) {
        setSnackbar({
          open: true,
          message: 'Selected fee not found',
          severity: 'error'
        });
        return;
      }

      const receiptData = {
        student: student,
        feeGroup: feeRecord,
        paymentData: paymentData
      };

      const blob = await pdf(<FeeCollectReceipt data={receiptData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Fee_Receipt_${student?.studentName}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'Fee receipt generated successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to generate fee receipt',
        severity: 'error'
      });
    } finally {
      setPdfLoading(false);
    }
  };

  // Generate individual payment receipt
  const handleGenerateIndividualReceipt = async (paymentId, feeGroupId) => {
    setIndividualPdfLoading(prev => ({ ...prev, [paymentId]: true }));
    
    try {
      const feeRecord = feeGroups.find(f => f.id === feeGroupId);
      const payment = feeRecord?.payments?.find(p => p.id === paymentId);
      const collectedBy = paymentData.collectedBy;
      console.log("collectedBy:", collectedBy)
      if (!feeRecord || !payment) {
        setSnackbar({
          open: true,
          message: 'Payment record not found',
          severity: 'error'
        });
        return;
      }

      const receiptData = {
        student: student,
        payment: payment,
        feeGroup: feeRecord,
        collectedBy: collectedBy // You can make this dynamic
      };

      const blob = await pdf(<IndividualFeeReceipt data={receiptData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Individual_Receipt_${payment.paymentId}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: 'Individual receipt generated successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to generate individual receipt',
        severity: 'error'
      });
    } finally {
      setIndividualPdfLoading(prev => ({ ...prev, [paymentId]: false }));
    }
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
          startIcon={pdfLoading ? <CircularProgress size={16} /> : <PrintIcon />}
          onClick={handleGenerateFeeReceipt}
          disabled={selectedFees.length === 0 || pdfLoading}
          size="small"
          sx={{ borderRadius: 1, fontSize: '0.75rem', py: 0.5, px: 1 }}
        >
          {pdfLoading ? 'Generating...' : 'Print Receipt'}
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
       {/* <Box sx={{ display: 'flex', gap: 0.5 }}>
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
        </Box> */}
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
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleRevertPayment(feeGroup.id, payment.paymentId)}
                              disabled={revertPaymentMutation.isPending}
                              title="Revert Payment"
                            >
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="info"
                              onClick={() => handleGenerateIndividualReceipt(payment.id, feeGroup.id)}
                              disabled={individualPdfLoading[payment.id]}
                            >
                              {individualPdfLoading[payment.id] ? (
                                <CircularProgress size={16} />
                              ) : (
                              <PrintIcon fontSize="small" />
                              )}
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
        onClose={() => {
          setOpenPaymentDialog(false);
          setValidationErrors({});
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1 } }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
            {selectedFees.length > 0 && feeGroups.find(f => f.id === selectedFees[0]) 
              ? `${feeGroups.find(f => f.id === selectedFees[0]).name} (${feeGroups.find(f => f.id === selectedFees[0]).amount})`
              : 'Collect Fee Payment'
            }
              </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 4, pb: 2,mt:2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Date Field */}
              <TextField
                fullWidth
              label="Date"
              type="date"
              value={paymentData.paymentDate}
              onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
              size="small"
              sx={{ borderRadius: 0.5 }}
              InputLabelProps={{ shrink: true }}
              required
            />
            
            {/* Amount Field */}
            <TextField
              fullWidth
              label="Amount (₹)"
              value={paymentData.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              size="small"
              sx={{ 
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: validationErrors.amount ? '#ffebee' : 'transparent',
                  '& fieldset': {
                    borderColor: validationErrors.amount ? '#d32f2f' : '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: validationErrors.amount ? '#d32f2f' : '#9ca3af',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: validationErrors.amount ? '#d32f2f' : '#1976d2',
                  },
                },
              }}
              type="number"
              required
              error={!!validationErrors.amount}
              helperText={validationErrors.amount || (selectedFees.length > 0 ? `Max: ₹${feeGroups.filter(fee => selectedFees.includes(fee.id)).reduce((sum, fee) => sum + fee.balance, 0).toFixed(2)}` : '')}
            />

            {/* Incharge Selection - Only for non-admin users */}
            {userRole !== 'admin' && (
              <FormControl fullWidth size="small" error={!!validationErrors.inchargeCode}>
                <InputLabel>Select Incharge *</InputLabel>
                <Select
                  value={paymentData.inchargeCode}
                  onChange={(e) => {
                    setPaymentData({ ...paymentData, inchargeCode: e.target.value });
                    if (validationErrors.inchargeCode) {
                      setValidationErrors(prev => ({ ...prev, inchargeCode: '' }));
                    }
                  }}
                  label="Select Incharge *"
                  sx={{ 
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: validationErrors.inchargeCode ? '#ffebee' : 'transparent',
                      '& fieldset': {
                        borderColor: validationErrors.inchargeCode ? '#d32f2f' : '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: validationErrors.inchargeCode ? '#d32f2f' : '#9ca3af',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: validationErrors.inchargeCode ? '#d32f2f' : '#1976d2',
                      },
                    },
                  }}
                >
                  <MenuItem value="">Select Incharge</MenuItem>
                  {inchargesData?.success && inchargesData?.incharges?.map((incharge) => (
                    <MenuItem key={incharge._id} value={incharge.incharge_code}>
                      {incharge.incharge_name} ({incharge.incharge_code})
                    </MenuItem>
                  ))}
                  {inchargesData?.success && inchargesData?.incharges?.length === 0 && (
                    <MenuItem disabled>No incharges available</MenuItem>
                  )}
                  {!inchargesData?.success && (
                    <MenuItem disabled>Loading incharges...</MenuItem>
                  )}
                </Select>
                {validationErrors.inchargeCode && (
                  <FormHelperText error>{validationErrors.inchargeCode}</FormHelperText>
                )}
              </FormControl>
            )}

            {/* Next Payment Due Date */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Next Payment Due Date"
                value={paymentData.nextPaymentDueDate}
                onChange={(newValue) => setPaymentData({ ...paymentData, nextPaymentDueDate: newValue })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    sx: { borderRadius: 1 }
                  },
                }}
              />
            </LocalizationProvider>
            
            {/* Discount Group */}
              <FormControl fullWidth size="small">
              <InputLabel>Discount Group</InputLabel>
                <Select
                value={paymentData.discountCode}
                onChange={(e) => handleDiscountCodeChange(e.target.value)}
                label="Discount Group"
              >
                <MenuItem value="">Select</MenuItem>
                {discountsData?.success && discountsData?.data?.map((discount) => (
                  <MenuItem key={discount._id} value={discount.discountCode}>
                    {discount.discountCode} - {discount.name}
                  </MenuItem>
                ))}
                </Select>
              </FormControl>
            
                        {/* Discount Amount */}
              <TextField
                fullWidth
              label="Discount (₹)"
              value={paymentData.discountAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                setPaymentData({ ...paymentData, discountAmount: parseFloat(value) || 0 });
              }}
                size="small"
              sx={{ 
                borderRadius: 0.5,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9ca3af',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
              type="number"
              required
            />
            
            {/* Discount File Upload */}
            <FormControl fullWidth size="small">
              <input
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="discount-file-upload"
                type="file"
                onChange={(e) => setDiscountFile(e.target.files[0] || null)}
              />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <label htmlFor="discount-file-upload" style={{ flex: 1 }}>
                  <Button
                    variant="outlined"
                    component="span"
                    size="small"
                    fullWidth
                    sx={{ 
                      borderRadius: 1,
                      textTransform: 'none',
                      justifyContent: 'flex-start',
                      color: discountFile ? 'success.main' : 'text.secondary'
                    }}
                  >
                    {discountFile ? `📎 ${discountFile.name}` : '📎 Upload Discount Proof (Optional)'}
                  </Button>
                </label>
                {discountFile && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => setDiscountFile(null)}
                    sx={{ minWidth: 'auto', px: 1 }}
                  >
                    ✕
                  </Button>
                )}
              </Box>
              <FormHelperText>
                Upload proof for discount (Image, PDF, or Document)
              </FormHelperText>
            </FormControl>
            
            {/* Fine Amount */}
              <TextField
                fullWidth
              label="Fine (₹)"
              value={paymentData.fine}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                setPaymentData({ ...paymentData, fine: parseFloat(value) || 0 });
              }}
              size="small"
              sx={{ 
                borderRadius: 0.5,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                  '& fieldset': {
                    borderColor: '#d1d5db',
                  },
                  '&:hover fieldset': {
                    borderColor: '#9ca3af',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
              }}
              type="number"
              required
            />
            
            {/* Payment Mode - Radio Buttons */}
            <FormControl component="fieldset">
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Payment Mode
              </Typography>
              <RadioGroup
                value={paymentData.paymentMode}
                onChange={(e) => setPaymentData({ ...paymentData, paymentMode: e.target.value })}
                row
              >
                <FormControlLabel value="Cash" control={<Radio size="small" />} label="Cash" />
                <FormControlLabel value="UPI" control={<Radio size="small" />} label="UPI" />
              </RadioGroup>
            </FormControl>
            
            {/* Note Field */}
            <TextField
              fullWidth
              label="Note"
                multiline
              rows={3}
                value={paymentData.remarks}
                onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
                size="small"
                sx={{ borderRadius: 1 }}
              />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1, justifyContent: 'space-between' }}>
          <Button
            onClick={() => setOpenPaymentDialog(false)}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={handlePaymentSubmit}
            variant="contained"
              startIcon={collectPaymentMutation.isPending ? <CircularProgress size={16} /> : <MoneyIcon />}
            size="small"
              disabled={collectPaymentMutation.isPending || Object.keys(validationErrors).length > 0}
              sx={{ 
                borderRadius: 1,
                backgroundColor: Object.keys(validationErrors).length > 0 ? '#ccc' : '#4caf50',
                '&:hover': { backgroundColor: Object.keys(validationErrors).length > 0 ? '#ccc' : '#45a049' }
              }}
            >
              {collectPaymentMutation.isPending ? 'Processing...' : '₹ Collect Fees'}
          </Button>
            <Button
              onClick={async () => {
                await handlePaymentSubmit();
                if (collectPaymentMutation.isSuccess) {
                  handleGenerateFeeReceipt();
                }
              }}
              variant="contained"
              startIcon={<PrintIcon />}
              size="small"
              disabled={collectPaymentMutation.isPending || Object.keys(validationErrors).length > 0}
              sx={{ 
                borderRadius: 1,
                backgroundColor: Object.keys(validationErrors).length > 0 ? '#ccc' : '#4caf50',
                '&:hover': { backgroundColor: Object.keys(validationErrors).length > 0 ? '#ccc' : '#45a049' }
              }}
            >
              ₹ Collect & Print
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Revert Payment Confirmation Dialog */}
      <Dialog
        open={revertDialog.open}
        onClose={() => setRevertDialog({ open: false, feeId: null, receiptNo: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1 } }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
            Confirm Payment Revert
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Warning:</strong> This action will permanently revert the payment and cannot be undone.
            </Typography>
          </Alert>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Are you sure you want to revert payment <strong>{revertDialog.receiptNo}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setRevertDialog({ open: false, feeId: null, receiptNo: null })}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRevertPayment}
            variant="contained"
            color="error"
            size="small"
            disabled={revertPaymentMutation.isPending}
            startIcon={revertPaymentMutation.isPending ? <CircularProgress size={16} /> : <RefreshIcon />}
            sx={{ borderRadius: 1 }}
          >
            {revertPaymentMutation.isPending ? 'Reverting...' : 'Revert Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: null })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1 } }}
      >
        <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
            Confirm Payment
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
            Are you sure you want to process payment of <strong>₹{paymentData.amount}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1, justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setConfirmDialog({ open: false, action: null })}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmPaymentSubmit}
            variant="contained"
            size="small"
            sx={{ 
              borderRadius: 1,
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#45a049' }
            }}
          >
            Confirm Payment
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
