import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourses, useBatches, useAdditionalCourses, useFeeDiscounts } from '../hooks';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  CloudUpload as UploadIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const StudentEditPage = ({ studentId: propStudentId, onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentId = propStudentId || id;
  const [formData, setFormData] = useState({
    // Basic Information
    inchargeCode: '',
    inchargeName: '',
    studentName: '',
    fathersName: '',
    mothersName: '',
    dateOfBirth: null,
    category: 'General',
    nationality: 'Indian',
    gender: 'Male',
    
    // Contact Information
    email: '',
    mobileNumber: '',
    alternativeMobileNumber: '',
    adharNumber: '',
    
    // Address Information
    presentAddress: {
      fullAddress: '',
      state: 'Bihar',
      district: 'Araria',
      country: 'India',
      pincode: ''
    },
    isPermanentSameAsPresent: false,
    permanentAddress: {
      fullAddress: '',
      state: 'Bihar',
      district: 'Araria',
      country: 'India',
      pincode: ''
    },
    
    // Academic Information
    collegeName: '',
    className: '',
    
    // Course Information
    courseId: '',
    additionalCourseId: '',
    paymentType: 'EMI',
    courseFee: '0',
    batchId: '',
    session: '',
    downPayment: '',
    nextPaymentDueDate: null,
    paymentMode: '',
    transactionId: '',
    referenceNumber: '',
    
    // Discount Information
    discountCode: '',
    discountAmount: '',
    discountFile: null,
    
    // File Upload
    imageFile: null
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isValidatingIncharge, setIsValidatingIncharge] = useState(false);
  const [inchargeValidationResult, setInchargeValidationResult] = useState(null);

  // API hooks for courses, batches, additional courses, and fee discounts
  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const { data: batchesData, isLoading: batchesLoading } = useBatches();
  const { data: additionalCoursesData, isLoading: additionalCoursesLoading } = useAdditionalCourses();
  const { data: feeDiscountsData, isLoading: feeDiscountsLoading } = useFeeDiscounts();

  // Extract courses, batches, additional courses, and fee discounts from API response
  const courses = coursesData?.items || coursesData?.data?.items || [];
  const batches = batchesData?.data?.batches || batchesData?.batches || [];
  const additionalCourses = additionalCoursesData?.items || additionalCoursesData?.data?.items || [];
  const feeDiscounts = feeDiscountsData?.data || feeDiscountsData || [];

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://seashell-app-vgu3a.ondigitalocean.app/api/v1/students/${studentId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const student = data.data;
          setCurrentImageUrl(student.image || '');
          setFormData({
            inchargeCode: student.inchargeCode || '',
            inchargeName: student.inchargeName || '',
            studentName: student.studentName || '',
            fathersName: student.fathersName || '',
            mothersName: student.mothersName || '',
            dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
            category: student.category || 'General',
            nationality: student.nationality || 'Indian',
            gender: student.gender || 'Male',
            email: student.email || '',
            mobileNumber: student.mobileNumber || '',
            alternativeMobileNumber: student.alternativeMobileNumber || '',
            adharNumber: student.adharNumber || '',
            presentAddress: student.presentAddress || {
              fullAddress: '',
              state: 'Bihar',
              district: 'Araria',
              country: 'India',
              pincode: ''
            },
            isPermanentSameAsPresent: student.isPermanentSameAsPresent || false,
            permanentAddress: student.permanentAddress || {
              fullAddress: '',
              state: 'Bihar',
              district: 'Araria',
              country: 'India',
              pincode: ''
            },
            collegeName: student.collegeName || '',
            className: student.className || '',
            courseId: student.courseDetails?.courseId?._id || '',
            additionalCourseId: student.courseDetails?.additionalCourseId?._id || '',
            paymentType: student.courseDetails?.paymentType || 'EMI',
            courseFee: student.courseDetails?.courseFee?.toString() || '0',
            batchId: student.courseDetails?.batchId?._id || '',
            session: student.courseDetails?.session || '',
            downPayment: student.courseDetails?.downPayment?.toString() || '',
            nextPaymentDueDate: student.courseDetails?.nextPaymentDueDate ? new Date(student.courseDetails.nextPaymentDueDate) : null,
            paymentMode: student.courseDetails?.paymentMode || '',
            transactionId: student.courseDetails?.transactionId || '',
            referenceNumber: student.courseDetails?.referenceNumber || '',
            discountCode: student.courseDetails?.discountCode || '',
            discountAmount: student.courseDetails?.discountAmount?.toString() || '',
            discountFile: null,
            imageFile: null
          });
        } else {
          throw new Error(data.message || 'Failed to fetch student data');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setErrorMessage(error.message || 'Failed to load student data. Please try again.');
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  // Update permanent address when checkbox is checked
  useEffect(() => {
    if (formData.isPermanentSameAsPresent) {
      setFormData(prev => ({
        ...prev,
        permanentAddress: prev.presentAddress
      }));
    }
  }, [formData.isPermanentSameAsPresent, formData.presentAddress]);

  // Validate incharge code via API (same as registration page)
  const validateInchargeCode = async (inchargeCode) => {
    if (!inchargeCode || inchargeCode.length < 6) {
      setInchargeValidationResult(null);
      return false;
    }

    setIsValidatingIncharge(true);
    try {
      const response = await fetch('https://seashell-app-vgu3a.ondigitalocean.app/api/v1/check-admissionIncharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incharge_code: inchargeCode })
      });
      const data = await response.json();
      if (data.exists) {
        setInchargeValidationResult({
          success: true,
          incharge_name: data.incharge_name,
          incharge_code: data.incharge_code,
          email: data.email
        });
        return true;
      } else {
        setInchargeValidationResult({ success: false, message: data.message });
        return false;
      }
    } catch (error) {
      console.error('Incharge validation error:', error);
      setInchargeValidationResult({ success: false, message: 'Failed to validate incharge code. Please try again.' });
      setErrorMessage('Failed to validate incharge code. Please check your connection and try again.');
      setShowError(true);
      return false;
    } finally {
      setIsValidatingIncharge(false);
    }
  };

  // Auto-populate when TBINC29819 entered and validate incharge code (same behavior as registration)
  useEffect(() => {
    if (formData.inchargeCode === 'TBINC29819') {
      setFormData(prev => ({
        ...prev,
        inchargeName: 'GAURI SHANKAR',
        nationality: prev.nationality || 'Indian',
        gender: prev.gender || 'Male',
        presentAddress: {
          ...prev.presentAddress,
          state: prev.presentAddress.state || 'Bihar',
          district: prev.presentAddress.district || 'Araria',
          country: prev.presentAddress.country || 'India'
        },
        permanentAddress: prev.permanentAddress || {
          fullAddress: '',
          state: 'Bihar',
          district: 'Araria',
          country: 'India',
          pincode: ''
        }
      }));
      setInchargeValidationResult({
        success: true,
        incharge_name: 'GAURI SHANKAR',
        incharge_code: 'TBINC29819',
        email: ''
      });
    } else if (formData.inchargeCode && formData.inchargeCode.length >= 6) {
      const timeoutId = setTimeout(() => {
        validateInchargeCode(formData.inchargeCode);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setInchargeValidationResult(null);
    }
  }, [formData.inchargeCode]);

  // Auto-populate incharge name when validation succeeds
  useEffect(() => {
    if (inchargeValidationResult?.success && inchargeValidationResult.incharge_name) {
      setFormData(prev => ({ ...prev, inchargeName: inchargeValidationResult.incharge_name }));
    }
  }, [inchargeValidationResult]);

  const validateForm = () => {
    const newErrors = {};
    
    // Student personal information validation
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (formData.studentName.trim().length < 2) newErrors.studentName = 'Student name must be at least 2 characters';
    if (!formData.fathersName.trim()) newErrors.fathersName = 'Father\'s name is required';
    if (formData.fathersName.trim().length < 2) newErrors.fathersName = 'Father\'s name must be at least 2 characters';
    if (!formData.mothersName.trim()) newErrors.mothersName = 'Mother\'s name is required';
    if (formData.mothersName.trim().length < 2) newErrors.mothersName = 'Mother\'s name must be at least 2 characters';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
    // Age validation (must be at least 5 years old)
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 5) newErrors.dateOfBirth = 'Student must be at least 5 years old';
      if (age > 100) newErrors.dateOfBirth = 'Please enter a valid date of birth';
    }
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    // Contact validation
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number starting with 6-9';
    }
    
    // Alternative mobile validation (if provided)
    if (formData.alternativeMobileNumber.trim() && !/^[6-9]\d{9}$/.test(formData.alternativeMobileNumber.trim())) {
      newErrors.alternativeMobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    
    // Email validation (if provided)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Aadhar validation (if provided)
    if (formData.adharNumber.trim() && !/^\d{12}$/.test(formData.adharNumber.trim())) {
      newErrors.adharNumber = 'Aadhar number must be exactly 12 digits';
    }
    
    // Address validation
    if (!formData.presentAddress.fullAddress.trim()) newErrors.presentAddress = 'Present address is required';
    if (!formData.presentAddress.state) newErrors.presentState = 'Present state is required';
    if (!formData.presentAddress.district) newErrors.presentDistrict = 'Present district is required';
    if (!formData.presentAddress.country) newErrors.presentCountry = 'Present country is required';
    if (!formData.presentAddress.pincode.trim()) newErrors.presentPincode = 'Present pincode is required';
    if (!/^\d{6}$/.test(formData.presentAddress.pincode.trim())) {
      newErrors.presentPincode = 'Pincode must be exactly 6 digits';
    }
    
    // Permanent address validation (if not same as present)
    if (!formData.isPermanentSameAsPresent) {
      if (!formData.permanentAddress.fullAddress.trim()) newErrors.permanentAddress = 'Permanent address is required';
      if (!formData.permanentAddress.state) newErrors.permanentState = 'Permanent state is required';
      if (!formData.permanentAddress.district) newErrors.permanentDistrict = 'Permanent district is required';
      if (!formData.permanentAddress.country) newErrors.permanentCountry = 'Permanent country is required';
      if (!formData.permanentAddress.pincode.trim()) newErrors.permanentPincode = 'Permanent pincode is required';
      if (!/^\d{6}$/.test(formData.permanentAddress.pincode.trim())) {
        newErrors.permanentPincode = 'Pincode must be exactly 6 digits';
      }
    }
    
    // Academic validation
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (formData.collegeName.trim().length < 3) newErrors.collegeName = 'College name must be at least 3 characters';
    if (!formData.className) newErrors.className = 'Class name is required';
    
    // Course validation
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.session.trim()) newErrors.session = 'Session is required';
    if (!formData.paymentType) newErrors.paymentType = 'Payment type is required';
    
    // Payment validation
    if (formData.paymentType === 'EMI') {
      if (!formData.downPayment || parseFloat(formData.downPayment) <= 0) {
        newErrors.downPayment = 'Down payment is required for EMI';
      } else {
        const courseFee = parseFloat(formData.courseFee) || 0;
        const downPayment = parseFloat(formData.downPayment) || 0;
        if (downPayment > courseFee) {
          newErrors.downPayment = `Down payment (₹${downPayment}) cannot exceed course fee (₹${courseFee})`;
        }
      }
      if (!formData.nextPaymentDueDate) {
        newErrors.nextPaymentDueDate = 'Next payment due date is required for EMI';
      }
    }
    
    // Course fee validation
    if (!formData.courseFee || parseFloat(formData.courseFee) <= 0) {
      newErrors.courseFee = 'Course fee must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-populate course fee when course is selected
    if (field === 'courseId' && value) {
      const selectedCourse = courses.find(course => course._id === value);
      if (selectedCourse) {
        setFormData(prev => ({ ...prev, courseFee: selectedCourse.fee.toString() }));
        
        // Auto-populate down payment with EMI fee if EMI is selected
        if (formData.paymentType === 'EMI' && selectedCourse.emiFee) {
          setFormData(prev => ({ ...prev, downPayment: selectedCourse.emiFee.toString() }));
        }
        
        // Recalculate discount if one is selected
        if (formData.discountCode) {
          const selectedDiscount = feeDiscounts.find(discount => discount.discountCode === formData.discountCode);
          if (selectedDiscount) {
            const courseFee = formData.paymentType === 'EMI' && selectedCourse.emiFee > 0 ? selectedCourse.emiFee : selectedCourse.fee;
            let discountAmount = 0;
            
            if (selectedDiscount.discountType === 'percentage') {
              discountAmount = (courseFee * selectedDiscount.percentage) / 100;
            } else {
              discountAmount = selectedDiscount.amount;
            }
            
            setFormData(prev => ({ ...prev, discountAmount: discountAmount.toString() }));
          }
        }
      }
    }
    
    // Auto-populate additional course fee when additional course is selected
    if (field === 'additionalCourseId' && value) {
      const selectedAdditionalCourse = additionalCourses.find(course => course._id === value);
      if (selectedAdditionalCourse) {
        const currentFee = parseFloat(formData.courseFee) || 0;
        const additionalFee = selectedAdditionalCourse.fee || 0;
        const newCourseFee = currentFee + additionalFee;
        setFormData(prev => ({ ...prev, courseFee: newCourseFee.toString() }));
        
        // Auto-populate down payment with EMI fee if EMI is selected
        if (formData.paymentType === 'EMI' && selectedAdditionalCourse.emiFee) {
          setFormData(prev => ({ ...prev, downPayment: selectedAdditionalCourse.emiFee.toString() }));
        }
        
        // Recalculate discount if one is selected
        if (formData.discountCode) {
          const selectedDiscount = feeDiscounts.find(discount => discount.discountCode === formData.discountCode);
          if (selectedDiscount) {
            let discountAmount = 0;
            
            if (selectedDiscount.discountType === 'percentage') {
              discountAmount = (newCourseFee * selectedDiscount.percentage) / 100;
            } else {
              discountAmount = selectedDiscount.amount;
            }
            
            setFormData(prev => ({ ...prev, discountAmount: discountAmount.toString() }));
          }
        }
      }
    }
    
    // Auto-populate down payment with EMI fee when payment type changes to EMI
    if (field === 'paymentType' && value === 'EMI') {
      const selectedCourse = courses.find(course => course._id === formData.courseId);
      if (selectedCourse && selectedCourse.emiFee) {
        setFormData(prev => ({ ...prev, downPayment: selectedCourse.emiFee.toString() }));
      }
    }
    
    // Auto-calculate discount amount when discount code is selected
    if (field === 'discountCode') {
      if (value) {
        const selectedDiscount = feeDiscounts.find(discount => discount.discountCode === value);
        if (selectedDiscount) {
          const courseFee = parseFloat(formData.courseFee) || 0;
          let discountAmount = 0;
          
          if (selectedDiscount.discountType === 'percentage') {
            discountAmount = (courseFee * selectedDiscount.percentage) / 100;
          } else {
            discountAmount = selectedDiscount.amount;
          }
          
          setFormData(prev => ({ ...prev, discountAmount: discountAmount.toString() }));
        }
      } else {
        setFormData(prev => ({ ...prev, discountAmount: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data according to API requirements
      const studentData = new FormData();
      
      // Basic Information
      studentData.append('inchargeCode', formData.inchargeCode);
      studentData.append('inchargeName', formData.inchargeName);
      studentData.append('studentName', formData.studentName);
      studentData.append('fathersName', formData.fathersName);
      studentData.append('mothersName', formData.mothersName);
      studentData.append('dateOfBirth', formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : '');
      studentData.append('category', formData.category);
      studentData.append('nationality', formData.nationality);
      studentData.append('gender', formData.gender);
      
      // Contact Information
      studentData.append('email', formData.email);
      studentData.append('mobileNumber', formData.mobileNumber);
      studentData.append('alternativeMobileNumber', formData.alternativeMobileNumber);
      studentData.append('adharNumber', formData.adharNumber);
      
      // Address Information
      studentData.append('presentAddress', JSON.stringify(formData.presentAddress));
      studentData.append('isPermanentSameAsPresent', formData.isPermanentSameAsPresent.toString());
      
      // Academic Information
      studentData.append('collegeName', formData.collegeName);
      studentData.append('className', formData.className);
      
      // Course Details - format exactly like Postman
      const courseDetails = {
        courseId: formData.courseId,
        additionalCourseId: formData.additionalCourseId || '',
        paymentType: formData.paymentType,
        downPayment: formData.downPayment || '',
        nextPaymentDueDate: formData.nextPaymentDueDate ? formData.nextPaymentDueDate.toISOString().split('T')[0] : '',
        courseFee: formData.courseFee,
        batchId: formData.batchId || '',
        session: formData.session,
        paymentMode: formData.paymentMode || '',
        transactionId: formData.transactionId || '',
        referenceNumber: formData.referenceNumber || '',
        discountCode: formData.discountCode || '',
        discountAmount: formData.discountAmount || '',
        discountFile: formData.discountFile || ''
      };
      
      // Format courseDetails exactly like Postman (compact JSON)
      const courseDetailsString = JSON.stringify(courseDetails, null, 0);
      studentData.append('courseDetails', courseDetailsString);
      
      // Image upload (only if new image is selected)
      if (formData.imageFile) {
        studentData.append('image', formData.imageFile);
      }
      
      // Call the PUT API
      const response = await fetch(`https://seashell-app-vgu3a.ondigitalocean.app/api/v1/student-update/${studentId}`, {
        method: 'PUT',
        body: studentData
      });
      
      const result = await response.json();
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          if (onBack) return onBack();
          navigate(-1);
        }, 3000);
      } else {
        throw new Error(result.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Student update error:', error);
      setErrorMessage(error.message || 'Failed to update student. Please try again.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading student data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        p: 4,
        mb: 4,
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => (onBack ? onBack() : navigate(-1))}
            sx={{ 
              color: 'white', 
              minWidth: 'auto',
              borderRadius: '50%',
              width: 48,
              height: 48,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SchoolIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '0.5px', mb: 0.5 }}>
                Edit Student
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 400 }}>
                Update student information
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: '100%', mx: 'auto', px: 2 }}>
        <form onSubmit={handleSubmit}>
          {/* Incharge Details */}
          <Card sx={{ 
            mb: 4, 
            borderRadius: 4, 
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e8e8e8',
            transition: 'all 0.3s ease-in-out'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  borderRadius: '50%', 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
                }}>
                  <PersonIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2', mb: 0.5 }}>
                    Incharge Details
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5c6bc0', fontWeight: 500 }}>
                    Validate and auto-fill incharge information
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Enter Incharge Code"
                    value={formData.inchargeCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, inchargeCode: e.target.value }))}
                    placeholder="TBINC29819"
                    size="small"
                    InputProps={{
                      endAdornment: isValidatingIncharge && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              border: '2px solid #e3e3e3',
                              borderTop: '2px solid #1976d2',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                            }}
                          />
                        </Box>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
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
                  />

                  {isValidatingIncharge && (
                    <Chip label="Validating..." size="small" color="default" sx={{ mt: 1 }} />
                  )}
                  {inchargeValidationResult?.success && (
                    <Chip label={`Valid: ${inchargeValidationResult.incharge_name}`} size="small" color="success" sx={{ mt: 1 }} />
                  )}
                  {inchargeValidationResult?.success === false && (
                    <Chip label={inchargeValidationResult.message} size="small" color="error" sx={{ mt: 1 }} />
                  )}
                </Box>

                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Incharge Name"
                    value={formData.inchargeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, inchargeName: e.target.value }))}
                    placeholder="Incharge Name"
                    size="small"
                    InputProps={{ readOnly: inchargeValidationResult?.success }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        backgroundColor: inchargeValidationResult?.success ? '#f5f5f5' : 'transparent',
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
                  />
                  {inchargeValidationResult?.success && (
                    <Typography variant="body2" color="success.main" sx={{ mt: 1, fontSize: '0.75rem' }}>
                      Auto-populated from incharge code
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
          {/* Student Personal Information */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  borderRadius: '50%', 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(123, 31, 162, 0.15)'
                }}>
                  <PersonIcon sx={{ color: '#7b1fa2', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#7b1fa2', mb: 0.5 }}>
                    Student Personal Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9c27b0', fontWeight: 500 }}>
                    Basic details and contact information
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Student Name *"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    placeholder="Student Name"
                    size="small"
                    required
                    error={!!errors.studentName}
                    helperText={errors.studentName}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: errors.studentName ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.studentName ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.studentName ? '#d32f2f' : '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Father's Name *"
                    value={formData.fathersName}
                    onChange={(e) => handleInputChange('fathersName', e.target.value)}
                    placeholder="Father's Name"
                    size="small"
                    required
                    error={!!errors.fathersName}
                    helperText={errors.fathersName}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: errors.fathersName ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.fathersName ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.fathersName ? '#d32f2f' : '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mother's Name *"
                    value={formData.mothersName}
                    onChange={(e) => handleInputChange('mothersName', e.target.value)}
                    placeholder="Mother's Name"
                    size="small"
                    required
                    error={!!errors.mothersName}
                    helperText={errors.mothersName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Birth *"
                      value={formData.dateOfBirth}
                      onChange={(newValue) => handleInputChange('dateOfBirth', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          required: true,
                          error: !!errors.dateOfBirth,
                          helperText: errors.dateOfBirth,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Nationality *</InputLabel>
                    <Select
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      label="Nationality *"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
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
                    >
                      <MenuItem value="Indian">Indian</MenuItem>
                      <MenuItem value="NRI">NRI</MenuItem>
                      <MenuItem value="Foreign National">Foreign National</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Category *</InputLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      label="Category *"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
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
                    >
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="OBC">OBC</MenuItem>
                      <MenuItem value="SC">SC</MenuItem>
                      <MenuItem value="ST">ST</MenuItem>
                      <MenuItem value="EWS">EWS</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gender *</FormLabel>
                    <RadioGroup
                      row
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      <FormControlLabel value="Other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email Id"
                    size="small"
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: errors.email ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.email ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.email ? '#d32f2f' : '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mobile *"
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleInputChange('mobileNumber', value);
                    }}
                    placeholder="Enter 10-digit mobile number"
                    size="small"
                    required
                    inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber || 'Must start with 6-9 and be 10 digits'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: errors.mobileNumber ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.mobileNumber ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.mobileNumber ? '#d32f2f' : '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Alternate Mobile"
                    value={formData.alternativeMobileNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleInputChange('alternativeMobileNumber', value);
                    }}
                    placeholder="Enter 10-digit mobile number"
                    size="small"
                    inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
                    helperText="Optional - Must start with 6-9 and be 10 digits"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Aadhar Number"
                    value={formData.adharNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                      handleInputChange('adharNumber', value);
                    }}
                    placeholder="Enter 12-digit Aadhar number"
                    size="small"
                    inputProps={{ maxLength: 12, pattern: '[0-9]{12}' }}
                    error={!!errors.adharNumber}
                    helperText={errors.adharNumber || 'Must be exactly 12 digits'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: errors.adharNumber ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.adharNumber ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.adharNumber ? '#d32f2f' : '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Present Address */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                  borderRadius: '50%', 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)'
                }}>
                  <LocationIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32', mb: 0.5 }}>
                    Present Address
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 500 }}>
                    Current residential address details
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Full Address"
                    value={formData.presentAddress.fullAddress}
                    onChange={(e) => handleInputChange('presentAddress', { ...formData.presentAddress, fullAddress: e.target.value })}
                    placeholder="Full Address"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>State</InputLabel>
                    <Select
                      value={formData.presentAddress.state}
                      onChange={(e) => handleInputChange('presentAddress', { ...formData.presentAddress, state: e.target.value })}
                      label="State"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
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
                    >
                      <MenuItem value="Bihar">Bihar</MenuItem>
                      <MenuItem value="Jharkhand">Jharkhand</MenuItem>
                      <MenuItem value="West Bengal">West Bengal</MenuItem>
                      <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                      <MenuItem value="Madhya Pradesh">Madhya Pradesh</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>District</InputLabel>
                    <Select
                      value={formData.presentAddress.district}
                      onChange={(e) => handleInputChange('presentAddress', { ...formData.presentAddress, district: e.target.value })}
                      label="District"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
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
                    >
                      <MenuItem value="Araria">Araria</MenuItem>
                      <MenuItem value="Purnia">Purnia</MenuItem>
                      <MenuItem value="Kishanganj">Kishanganj</MenuItem>
                      <MenuItem value="Katihar">Katihar</MenuItem>
                      <MenuItem value="Madhepura">Madhepura</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={formData.presentAddress.country}
                      onChange={(e) => handleInputChange('presentAddress', { ...formData.presentAddress, country: e.target.value })}
                      label="Country"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
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
                    >
                      <MenuItem value="India">India</MenuItem>
                      <MenuItem value="Nepal">Nepal</MenuItem>
                      <MenuItem value="Bangladesh">Bangladesh</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pincode *"
                    value={formData.presentAddress.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('presentAddress', { ...formData.presentAddress, pincode: value });
                    }}
                    placeholder="Enter 6-digit pincode"
                    size="small"
                    inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
                    error={!!errors.presentPincode}
                    helperText={errors.presentPincode || 'Must be exactly 6 digits'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: errors.presentPincode ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.presentPincode ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.presentPincode ? '#d32f2f' : '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Permanent Address */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                  borderRadius: '50%', 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(245, 124, 0, 0.15)'
                }}>
                  <LocationIcon sx={{ color: '#f57c00', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f57c00', mb: 0.5 }}>
                    Permanent Address
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ef6c00', fontWeight: 500 }}>
                    Permanent residential address details
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isPermanentSameAsPresent}
                        onChange={(e) => handleInputChange('isPermanentSameAsPresent', e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                        Same as Present Address
                      </Typography>
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Full Address"
                    value={formData.permanentAddress.fullAddress}
                    onChange={(e) => handleInputChange('permanentAddress', { ...formData.permanentAddress, fullAddress: e.target.value })}
                    placeholder="Full Address"
                    size="small"
                    disabled={formData.isPermanentSameAsPresent}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#f5f5f5',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={formData.permanentAddress.state}
                    onChange={(e) => handleInputChange('permanentAddress', { ...formData.permanentAddress, state: e.target.value })}
                    size="small"
                    disabled={formData.isPermanentSameAsPresent}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#f5f5f5',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="District"
                    value={formData.permanentAddress.district}
                    onChange={(e) => handleInputChange('permanentAddress', { ...formData.permanentAddress, district: e.target.value })}
                    size="small"
                    disabled={formData.isPermanentSameAsPresent}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#f5f5f5',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={formData.permanentAddress.country}
                    onChange={(e) => handleInputChange('permanentAddress', { ...formData.permanentAddress, country: e.target.value })}
                    size="small"
                    disabled={formData.isPermanentSameAsPresent}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#f5f5f5',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Pincode *"
                    value={formData.permanentAddress.pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('permanentAddress', { ...formData.permanentAddress, pincode: value });
                    }}
                    placeholder="Enter 6-digit pincode"
                    size="small"
                    disabled={formData.isPermanentSameAsPresent}
                    inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
                    error={!!errors.permanentPincode}
                    helperText={errors.permanentPincode || 'Must be exactly 6 digits'}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: errors.permanentPincode ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.permanentPincode ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.permanentPincode ? '#d32f2f' : '#1976d2',
                        },
                        '&.Mui-disabled': {
                          backgroundColor: '#f5f5f5',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* College and Class Details */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)',
                  borderRadius: '50%', 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(2, 119, 189, 0.15)'
                }}>
                  <SchoolIcon sx={{ color: '#0277bd', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0277bd', mb: 0.5 }}>
                    College and Class Details
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#0288d1', fontWeight: 500 }}>
                    Academic institution information
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="College Name *"
                    value={formData.collegeName}
                    onChange={(e) => handleInputChange('collegeName', e.target.value)}
                    placeholder="College Name"
                    size="small"
                    required
                    error={!!errors.collegeName}
                    helperText={errors.collegeName}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: errors.collegeName ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.collegeName ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.collegeName ? '#d32f2f' : '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!errors.className}>
                    <InputLabel>Class Name *</InputLabel>
                    <Select
                      value={formData.className}
                      onChange={(e) => handleInputChange('className', e.target.value)}
                      label="Class Name *"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                          '& fieldset': {
                            borderColor: errors.className ? '#d32f2f' : '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: errors.className ? '#d32f2f' : '#9ca3af',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.className ? '#d32f2f' : '#1976d2',
                          },
                        },
                      }}
                    >
                      <MenuItem value="9th">9th</MenuItem>
                      <MenuItem value="10th">10th</MenuItem>
                      <MenuItem value="11th">11th</MenuItem>
                      <MenuItem value="12th">12th</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
                  borderRadius: '50%', 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(194, 24, 91, 0.15)'
                }}>
                  <PaymentIcon sx={{ color: '#c2185b', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#c2185b', mb: 0.5 }}>
                    Course Details
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ad1457', fontWeight: 500 }}>
                    Course selection and payment information
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!errors.courseId}>
                    <InputLabel>Course *</InputLabel>
                    <Select
                      value={formData.courseId}
                      onChange={(e) => handleInputChange('courseId', e.target.value)}
                      label="Course *"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
                          '& fieldset': {
                            borderColor: errors.courseId ? '#d32f2f' : '#d1d5db',
                          },
                          '&:hover fieldset': {
                            borderColor: errors.courseId ? '#d32f2f' : '#9ca3af',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: errors.courseId ? '#d32f2f' : '#1976d2',
                          },
                        },
                      }}
                    >
                      {coursesLoading ? (
                        <MenuItem disabled>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={16} />
                            Loading courses...
                          </Box>
                        </MenuItem>
                      ) : courses.length === 0 ? (
                        <MenuItem disabled>No courses available</MenuItem>
                      ) : (
                        courses.map((course) => (
                          <MenuItem key={course._id} value={course._id}>
                            {course.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Additional Course</InputLabel>
                    <Select
                      value={formData.additionalCourseId}
                      onChange={(e) => handleInputChange('additionalCourseId', e.target.value)}
                      label="Additional Course"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
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
                    >
                      <MenuItem value="">None</MenuItem>
                      {additionalCoursesLoading ? (
                        <MenuItem disabled>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={16} />
                            Loading additional courses...
                          </Box>
                        </MenuItem>
                      ) : additionalCourses.length === 0 ? (
                        <MenuItem disabled>No additional courses available</MenuItem>
                      ) : (
                        additionalCourses.map((course) => (
                          <MenuItem key={course._id} value={course._id}>
                            {course.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Payment Type *</InputLabel>
                    <Select
                      value={formData.paymentType}
                      onChange={(e) => handleInputChange('paymentType', e.target.value)}
                      label="Payment Type *"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
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
                    >
                      <MenuItem value="Full-payment">Full-payment</MenuItem>
                      <MenuItem value="EMI">EMI</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Course Fee"
                    value={formData.courseFee}
                    onChange={(e) => handleInputChange('courseFee', e.target.value)}
                    size="small"
                    InputProps={{
                      readOnly: !!formData.courseId,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        backgroundColor: formData.courseId ? '#f5f5f5' : 'transparent',
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
                    helperText={formData.courseId ? 'Auto-calculated from selected course' : 'Select a course to auto-calculate fee'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Batch</InputLabel>
                    <Select
                      value={formData.batchId}
                      onChange={(e) => handleInputChange('batchId', e.target.value)}
                      label="Batch"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
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
                    >
                      {batchesLoading ? (
                        <MenuItem disabled>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={16} />
                            Loading batches...
                          </Box>
                        </MenuItem>
                      ) : batches.length === 0 ? (
                        <MenuItem disabled>No batches available</MenuItem>
                      ) : (
                        batches.map((batch) => (
                          <MenuItem key={batch._id} value={batch._id}>
                            {batch.batchName}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Session *"
                    value={formData.session}
                    onChange={(e) => handleInputChange('session', e.target.value)}
                    placeholder="Enter Session"
                    size="small"
                    required
                    error={!!errors.session}
                    helperText={errors.session}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                        '& fieldset': {
                          borderColor: errors.session ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.session ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.session ? '#d32f2f' : '#1976d2',
                        },
                      },
                    }}
                  />
                </Grid>
                {formData.paymentType !== 'Full-payment' && (
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Next Payment Due Date"
                          value={formData.nextPaymentDueDate}
                          onChange={(newValue) => handleInputChange('nextPaymentDueDate', newValue)}
                          slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                        />
                      </LocalizationProvider>
                    </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel 
                      sx={{ 
                        fontSize: '0.875rem',
                        color: '#374151',
                        '&.Mui-focused': {
                          color: '#1976d2',
                        },
                        '&.MuiInputLabel-shrink': {
                          color: '#374151',
                        },
                      }}
                    >
                      Discount Code
                    </InputLabel>
                    <Select
                      value={formData.discountCode}
                      onChange={(e) => handleInputChange('discountCode', e.target.value)}
                      label="Discount Code"
                      sx={{
                        minWidth: '200px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '4px',
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
                        '& .MuiSelect-icon': {
                          color: '#6b7280',
                        },
                        '& .MuiInputLabel-root': {
                          backgroundColor: 'white',
                          paddingRight: 1,
                        },
                      }}
                    >
                      <MenuItem value="">No Discount</MenuItem>
                      {feeDiscountsLoading ? (
                        <MenuItem disabled>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={16} />
                            Loading discounts...
                          </Box>
                        </MenuItem>
                      ) : feeDiscounts.length === 0 ? (
                        <MenuItem disabled>
                          No discounts available
                        </MenuItem>
                      ) : (
                        feeDiscounts.map((discount) => (
                          <MenuItem key={discount._id} value={discount.discountCode}>
                            {discount.name} ({discount.discountCode}) - {discount.discountType === 'percentage' ? `${discount.percentage}%` : `₹${discount.amount}`}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Discount Amount"
                    value={formData.discountAmount}
                    onChange={(e) => handleInputChange('discountAmount', e.target.value)}
                    placeholder="Auto-calculated or enter manually"
                    size="small"
                    type="number"
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
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
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  borderRadius: '50%', 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(123, 31, 162, 0.15)'
                }}>
                  <PersonIcon sx={{ color: '#7b1fa2', fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#7b1fa2', mb: 0.5 }}>
                    Additional Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#9c27b0', fontWeight: 500 }}>
                    Additional documents and references
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    border: '2px dashed #d1d5db', 
                    borderRadius: 2, 
                    p: 4, 
                    textAlign: 'center',
                    backgroundColor: formData.imageFile ? '#f0f9ff' : '#fafafa',
                    borderColor: formData.imageFile ? '#1976d2' : '#d1d5db',
                    transition: 'all 0.3s ease',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {formData.imageFile ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: '50%', 
                          overflow: 'hidden',
                          border: '3px solid #1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#e3f2fd'
                        }}>
                          <img 
                            src={URL.createObjectURL(formData.imageFile)} 
                            alt="Student Preview" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                          {formData.imageFile.name}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setFormData(prev => ({ ...prev, imageFile: null }))}
                          sx={{ 
                            textTransform: 'none'
                          }}
                        >
                          Remove Photo
                        </Button>
                      </Box>
                    ) : currentImageUrl ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: '50%', 
                          overflow: 'hidden',
                          border: '3px solid #1976d2',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#e3f2fd'
                        }}>
                          <img 
                            src={currentImageUrl} 
                            alt="Current Student" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Current photo. Upload to replace.
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<UploadIcon />}
                          sx={{ textTransform: 'none' }}
                        >
                          CHOOSE PHOTO
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ 
                          width: 80, 
                          height: 80, 
                          borderRadius: '50%', 
                          backgroundColor: '#e3f2fd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px dashed #1976d2'
                        }}>
                          <UploadIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Click to upload student photo
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<UploadIcon />}
                          sx={{ textTransform: 'none' }}
                        >
                          CHOOSE PHOTO
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ mb: 2, color: '#333', fontWeight: 600, fontSize: '1rem' }}>
                    Reference Number (If any)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, color: '#666', fontSize: '0.875rem' }}>
                    Enter referral student admission number if applicable
                  </Typography>
                  <TextField
                    fullWidth
                    label="Reference Number"
                    value={formData.referenceNumber}
                    onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                    placeholder="Enter Referral Student Admission Number"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
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
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={onBack}
              disabled={isSubmitting}
              sx={{
                borderColor: '#666',
                color: '#666',
                px: 6,
                py: 2.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: '#333',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  transform: 'translateY(-1px)'
                },
                '&:disabled': {
                  borderColor: '#ccc',
                  color: '#ccc',
                  transform: 'none'
                }
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                px: 8,
                py: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: '8px',
                boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: '#ccc',
                  boxShadow: 'none',
                  transform: 'none'
                }
              }}
            >
              {isSubmitting ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Updating Student...
                </Box>
              ) : (
                'Update Student'
              )}
            </Button>
          </Box>
        </form>
      </Box>

      {/* Success Notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Student updated successfully! Redirecting to dashboard...
        </Alert>
      </Snackbar>

      {/* Error Notification */}
      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowError(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentEditPage;
