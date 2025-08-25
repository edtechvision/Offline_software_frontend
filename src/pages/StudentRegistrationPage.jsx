import React, { useState, useEffect } from 'react';
import { useCourses, useBatches, useCreateStudent } from '../hooks';
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
  InputAdornment,
  Chip,
  Divider,
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
  CalendarToday as CalendarIcon,
  CloudUpload as UploadIcon,
  School as SchoolIcon,
  Payment as PaymentIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const StudentRegistrationPage = ({ onBack }) => {
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
    referenceNumber: '',
    
    // File Upload
    image: null
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingIncharge, setIsValidatingIncharge] = useState(false);
  const [inchargeValidationResult, setInchargeValidationResult] = useState(null);

  // API hooks for courses and batches
  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const { data: batchesData, isLoading: batchesLoading } = useBatches();
  const createStudentMutation = useCreateStudent();

  // Extract courses and batches from API response
  const courses = coursesData?.items || coursesData?.data?.items || [];
  const batches = batchesData?.data?.batches || batchesData?.batches || [];
  


  // Auto-populate when TBINC29819 is entered and validate incharge code
  useEffect(() => {
    if (formData.inchargeCode === 'TBINC29819') {
      setFormData(prev => ({
        ...prev,
        inchargeName: 'GAURI SHANKAR',
        nationality: 'Indian',
        gender: 'Male',
        presentState: 'Bihar',
        presentDistrict: 'Araria',
        presentCountry: 'India',
        permanentState: 'Bihar',
        permanentDistrict: 'Araria',
        permanentCountry: 'India'
      }));
      // Set validation result for hardcoded code
      setInchargeValidationResult({
        success: true,
        incharge_name: 'GAURI SHANKAR',
        incharge_code: 'TBINC29819',
        email: ''
      });
    } else if (formData.inchargeCode.length >= 6) {
      // Debounce API validation to avoid too many calls
      const timeoutId = setTimeout(() => {
        validateInchargeCode(formData.inchargeCode);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      // Clear validation result for short codes
      setInchargeValidationResult(null);
    }
  }, [formData.inchargeCode]);

  // Auto-populate incharge name when validation is successful
  useEffect(() => {
    if (inchargeValidationResult?.success && inchargeValidationResult.incharge_name) {
      setFormData(prev => ({
        ...prev,
        inchargeName: inchargeValidationResult.incharge_name
      }));
    }
  }, [inchargeValidationResult]);

  // Validate incharge code via API
  const validateInchargeCode = async (inchargeCode) => {
    if (!inchargeCode || inchargeCode.length < 6) {
      setInchargeValidationResult(null);
      return false;
    }

    setIsValidatingIncharge(true);
    try {
      const response = await fetch('https://seashell-app-vgu3a.ondigitalocean.app/api/v1/check-admissionIncharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incharge_code: inchargeCode
        })
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
        setInchargeValidationResult({
          success: false,
          message: data.message
        });
        return false;
      }
    } catch (error) {
      setInchargeValidationResult({
        success: false,
        message: 'Failed to validate incharge code. Please try again.'
      });
      return false;
    } finally {
      setIsValidatingIncharge(false);
    }
  };

  // Check if incharge code is valid based on API validation
  const isInchargeCodeValid = inchargeValidationResult?.success === true;

  // Update permanent address when checkbox is checked
  useEffect(() => {
    if (formData.sameAsPresent) {
      setFormData(prev => ({
        ...prev,
        permanentAddress: prev.presentAddress,
        permanentState: prev.presentState,
        permanentDistrict: prev.presentDistrict,
        permanentCountry: prev.presentCountry,
        permanentPincode: prev.presentPincode
      }));
    }
  }, [formData.sameAsPresent, formData.presentAddress, formData.presentState, formData.presentDistrict, formData.presentCountry, formData.presentPincode]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.inchargeCode.trim()) newErrors.inchargeCode = 'Incharge code is required';
    if (!isInchargeCodeValid) newErrors.inchargeCode = 'Please enter a valid incharge code';
    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.fathersName.trim()) newErrors.fathersName = 'Father\'s name is required';
    if (!formData.mothersName.trim()) newErrors.mothersName = 'Mother\'s name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile number is required';
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!formData.className) newErrors.className = 'Class name is required';
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.session.trim()) newErrors.session = 'Session is required';
    
    // Mobile number validation
    if (formData.mobile && !/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Aadhar validation
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data according to API requirements
      const studentData = {
        inchargeCode: formData.inchargeCode,
        inchargeName: formData.inchargeName,
        studentName: formData.studentName,
        fathersName: formData.fathersName,
        mothersName: formData.mothersName,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : '',
        category: formData.category,
        nationality: formData.nationality,
        gender: formData.gender,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        alternativeMobileNumber: formData.alternativeMobileNumber,
        adharNumber: formData.adharNumber,
        presentAddress: JSON.stringify(formData.presentAddress),
        isPermanentSameAsPresent: formData.isPermanentSameAsPresent,
        collegeName: formData.collegeName,
        className: formData.className,
        courseDetails: JSON.stringify({
          courseId: formData.courseId,
          additionalCourseId: formData.additionalCourseId,
          paymentType: formData.paymentType,
          downPayment: formData.downPayment,
          nextPaymentDueDate: formData.nextPaymentDueDate ? formData.nextPaymentDueDate.toISOString().split('T')[0] : '',
          courseFee: formData.courseFee,
          batchId: formData.batchId,
          session: formData.session,
          paymentMode: formData.paymentMode,
          referenceNumber: formData.referenceNumber
        }),
        image: formData.image
      };
      
      // Call the API
      const result = await createStudentMutation.mutateAsync(studentData);
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onBack();
        }, 3000);
      } else {
        throw new Error(result.message || 'Failed to create student');
      }
    } catch (error) {
      // You can add error handling here (show error message to user)
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

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
      {/* CSS for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
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
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'translate(50%, -50%)'
        }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
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
                Student Registration
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 400 }}>
                Complete the form below to register a new student
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
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-2px)'
            }
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
                    Enter the admission incharge information
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Enter Incharge Code"
                    value={formData.inchargeCode}
                    onChange={(e) => handleInputChange('inchargeCode', e.target.value)}
                    placeholder="TBINC29819"
                    size="small"
                    error={!!errors.inchargeCode}
                    helperText={errors.inchargeCode}
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
                          borderColor: errors.inchargeCode ? '#d32f2f' : '#d1d5db',
                        },
                        '&:hover fieldset': {
                          borderColor: errors.inchargeCode ? '#d32f2f' : '#9ca3af',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: errors.inchargeCode ? '#d32f2f' : '#1976d2',
                        },
                      },
                    }}
                  />
                  
                  {/* Validation Status */}
                  {isValidatingIncharge && (
                    <Chip 
                      label="Validating..." 
                      size="small" 
                      color="default" 
                      sx={{ mt: 1 }}
                    />
                  )}
                  
                  {inchargeValidationResult?.success && (
                    <Chip 
                      label={`Valid: ${inchargeValidationResult.incharge_name}`}
                      size="small" 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  )}
                  
                  {inchargeValidationResult?.success === false && (
                    <Chip 
                      label={inchargeValidationResult.message}
                      size="small" 
                      color="error" 
                      sx={{ mt: 1 }}
                    />
                  )}
                  
                  {formData.inchargeCode === 'TBINC29819' && (
                    <Chip 
                      label="Auto-populated" 
                      size="small" 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                  <TextField
                    fullWidth
                    label="Incharge Name"
                    value={formData.inchargeName}
                    onChange={(e) => handleInputChange('inchargeName', e.target.value)}
                    placeholder="Incharge Name"
                    size="small"
                    InputProps={{
                      readOnly: inchargeValidationResult?.success,
                    }}
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

          {/* Conditional Form Display */}
          {isInchargeCodeValid && (
            <>
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
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '4px',
                            '& fieldset': {
                              borderColor: errors.mothersName ? '#d32f2f' : '#d1d5db',
                            },
                            '&:hover fieldset': {
                              borderColor: errors.mothersName ? '#d32f2f' : '#9ca3af',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.mothersName ? '#d32f2f' : '#1976d2',
                            },
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '4px',
                                  '& fieldset': {
                                    borderColor: errors.dateOfBirth ? '#d32f2f' : '#d1d5db',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: errors.dateOfBirth ? '#d32f2f' : '#9ca3af',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: errors.dateOfBirth ? '#d32f2f' : '#1976d2',
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                          Nationality *
                        </InputLabel>
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
                            '& .MuiSelect-icon': {
                              color: '#6b7280',
                            },
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              paddingRight: 1,
                            },
                          }}
                        >
                          <MenuItem value="Indian">Indian</MenuItem>
                          <MenuItem value="NRI">NRI</MenuItem>
                          <MenuItem value="Foreign National">Foreign National</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                          Category *
                        </InputLabel>
                        <Select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          label="Category *"
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
                        >
                          <MenuItem value="General">General</MenuItem>
                          <MenuItem value="OBC">OBC</MenuItem>
                          <MenuItem value="SC">SC</MenuItem>
                          <MenuItem value="ST">ST</MenuItem>
                          <MenuItem value="EWS">EWS</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontSize: '0.875rem', color: '#374151', mb: 1 }}>
                          Gender *
                        </FormLabel>
                        <RadioGroup
                          row
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                        >
                          <FormControlLabel 
                            value="Male" 
                            control={<Radio sx={{ '&.Mui-checked': { color: '#1976d2' } }} />} 
                            label="Male" 
                          />
                          <FormControlLabel 
                            value="Female" 
                            control={<Radio sx={{ '&.Mui-checked': { color: '#1976d2' } }} />} 
                            label="Female" 
                          />
                          <FormControlLabel 
                            value="Other" 
                            control={<Radio sx={{ '&.Mui-checked': { color: '#1976d2' } }} />} 
                            label="Other" 
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="Mobile *"
                        value={formData.mobileNumber}
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        placeholder="Mobile Number"
                        size="small"
                        required
                        error={!!errors.mobileNumber}
                        helperText={errors.mobileNumber}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '4px',
                            '& fieldset': {
                              borderColor: errors.mobile ? '#d32f2f' : '#d1d5db',
                            },
                            '&:hover fieldset': {
                              borderColor: errors.mobile ? '#d32f2f' : '#9ca3af',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.mobile ? '#d32f2f' : '#1976d2',
                            },
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="Alternate Mobile"
                        value={formData.alternativeMobileNumber}
                        onChange={(e) => handleInputChange('alternativeMobileNumber', e.target.value)}
                        placeholder="Alternate Mobile Number"
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="Aadhar Number"
                        value={formData.aadharNumber}
                        onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                        placeholder="Adhaar Number"
                        size="small"
                        error={!!errors.aadharNumber}
                        helperText={errors.aadharNumber}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '4px',
                            '& fieldset': {
                              borderColor: errors.aadharNumber ? '#d32f2f' : '#d1d5db',
                            },
                            '&:hover fieldset': {
                              borderColor: errors.aadharNumber ? '#d32f2f' : '#9ca3af',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: errors.aadharNumber ? '#d32f2f' : '#1976d2',
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
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
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                          State
                        </InputLabel>
                        <Select
                          value={formData.presentState}
                          onChange={(e) => handleInputChange('presentState', e.target.value)}
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
                            '& .MuiSelect-icon': {
                              color: '#6b7280',
                            },
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              paddingRight: 1,
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                          District
                        </InputLabel>
                        <Select
                          value={formData.presentDistrict}
                          onChange={(e) => handleInputChange('presentDistrict', e.target.value)}
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
                            '& .MuiSelect-icon': {
                              color: '#6b7280',
                            },
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              paddingRight: 1,
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                          Country
                        </InputLabel>
                        <Select
                          value={formData.presentCountry}
                          onChange={(e) => handleInputChange('presentCountry', e.target.value)}
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
                            '& .MuiSelect-icon': {
                              color: '#6b7280',
                            },
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              paddingRight: 1,
                            },
                          }}
                        >
                          <MenuItem value="India">India</MenuItem>
                          <MenuItem value="Nepal">Nepal</MenuItem>
                          <MenuItem value="Bangladesh">Bangladesh</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        value={formData.presentPincode}
                        onChange={(e) => handleInputChange('presentPincode', e.target.value)}
                        placeholder="Pincode"
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
                    </Box>
                  </Box>
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
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.sameAsPresent}
                            onChange={(e) => handleInputChange('sameAsPresent', e.target.checked)}
                            sx={{ 
                              '&.Mui-checked': { 
                                color: '#1976d2' 
                              } 
                            }}
                          />
                        }
                        label={
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151' }}>
                            Same as Present Address
                          </Typography>
                        }
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Full Address"
                        value={formData.permanentAddress}
                        onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                        placeholder="Full Address"
                        size="small"
                        disabled={formData.sameAsPresent}
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="State"
                        value={formData.permanentState}
                        onChange={(e) => handleInputChange('permanentState', e.target.value)}
                        size="small"
                        disabled={formData.sameAsPresent}
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="District"
                        value={formData.permanentDistrict}
                        onChange={(e) => handleInputChange('permanentDistrict', e.target.value)}
                        size="small"
                        disabled={formData.sameAsPresent}
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={formData.permanentCountry}
                        onChange={(e) => handleInputChange('permanentCountry', e.target.value)}
                        size="small"
                        disabled={formData.sameAsPresent}
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        value={formData.permanentPincode}
                        onChange={(e) => handleInputChange('permanentPincode', e.target.value)}
                        placeholder="Pincode"
                        size="small"
                        disabled={formData.sameAsPresent}
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
                    </Box>
                  </Box>
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
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <FormControl fullWidth size="small" error={!!errors.className}>
                        <InputLabel 
                          sx={{ 
                            fontSize: '0.875rem',
                            color: errors.className ? '#d32f2f' : '#374151',
                            '&.Mui-focused': {
                              color: errors.className ? '#d32f2f' : '#1976d2',
                            },
                            '&.MuiInputLabel-shrink': {
                              color: errors.className ? '#d32f2f' : '#374151',
                            },
                          }}
                        >
                          Class Name *
                        </InputLabel>
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
                            '& .MuiSelect-icon': {
                              color: errors.className ? '#d32f2f' : '#6b7280',
                            },
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              paddingRight: 1,
                            },
                          }}
                        >
                          <MenuItem value="Class 9">Class 9</MenuItem>
                          <MenuItem value="Class 10">Class 10</MenuItem>
                          <MenuItem value="Class 11">Class 11</MenuItem>
                          <MenuItem value="Class 12">Class 12</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
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

                  
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <FormControl fullWidth size="small" error={!!errors.courseName}>
                        <InputLabel 
                          sx={{ 
                            fontSize: '0.875rem',
                            color: errors.courseId ? '#d32f2f' : '#374151',
                            '&.Mui-focused': {
                              color: errors.courseId ? '#d32f2f' : '#1976d2',
                            },
                            '&.MuiInputLabel-shrink': {
                              color: errors.courseId ? '#d32f2f' : '#374151',
                            },
                          }}
                        >
                          Course *
                        </InputLabel>
                        <Select
                          value={formData.courseId}
                          onChange={(e) => handleInputChange('courseId', e.target.value)}
                          label="Course *"
                          sx={{
                            minWidth: '200px',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '4px',
                              '& fieldset': {
                                borderColor: errors.courseName ? '#d32f2f' : '#d1d5db',
                              },
                              '&:hover fieldset': {
                                borderColor: errors.courseName ? '#d32f2f' : '#9ca3af',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: errors.courseName ? '#d32f2f' : '#1976d2',
                              },
                            },
                            '& .MuiSelect-icon': {
                              color: errors.courseName ? '#d32f2f' : '#6b7280',
                            },
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              paddingRight: 1,
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
                            <MenuItem disabled>
                              No courses available
                            </MenuItem>
                          ) : (
                            courses.map((course) => (
                              <MenuItem key={course._id} value={course._id}>
                                {course.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                          Additional Course
                        </InputLabel>
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
                            '& .MuiSelect-icon': {
                              color: '#6b7280',
                            },
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              paddingRight: 1,
                            },
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {coursesLoading ? (
                            <MenuItem disabled>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={16} />
                                Loading courses...
                              </Box>
                            </MenuItem>
                          ) : courses.length === 0 ? (
                            <MenuItem disabled>
                              No courses available
                            </MenuItem>
                          ) : (
                            courses.map((course) => (
                              <MenuItem key={course._id} value={course._id}>
                                {course.name}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                          Payment Type *
                        </InputLabel>
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
                            '& .MuiSelect-icon': {
                              color: '#6b7280',
                            },
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              paddingRight: 1,
                            },
                          }}
                        >
                          <MenuItem value="Full Payment">Full Payment</MenuItem>
                          <MenuItem value="EMI">EMI</MenuItem>
                          <MenuItem value="Installments">Installments</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="Course Fee"
                        value={formData.courseFee}
                        onChange={(e) => handleInputChange('courseFee', e.target.value)}
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
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                          Batch
                        </InputLabel>
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
                            '& .MuiSelect-icon': {
                              color: '#6b7280',
                            },
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              paddingRight: 1,
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
                            <MenuItem disabled>
                              No batches available
                            </MenuItem>
                          ) : (
                            batches.map((batch) => (
                              <MenuItem key={batch._id} value={batch._id}>
                                {batch.batchName}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
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
                    </Box>
                    {/* Conditional EMI/Installment Fields */}
                    {formData.paymentType !== 'Full Payment' && (
                      <>
                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                          <TextField
                            fullWidth
                            label="Down Payment"
                            value={formData.downPayment}
                            onChange={(e) => handleInputChange('downPayment', e.target.value)}
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
                        </Box>
                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              label="Next Payment Due Date"
                              value={formData.nextPaymentDueDate}
                              onChange={(newValue) => handleInputChange('nextPaymentDueDate', newValue)}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: 'small',
                                  sx: {
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
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Box>
                      </>
                    )}
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ fontSize: '0.875rem', color: '#374151', mb: 1 }}>
                          Payment Mode
                        </FormLabel>
                        <RadioGroup
                          row
                          value={formData.paymentMode}
                          onChange={(e) => handleInputChange('paymentMode', e.target.value)}
                        >
                          <FormControlLabel 
                            value="Cash" 
                            control={<Radio sx={{ '&.Mui-checked': { color: '#1976d2' } }} />} 
                            label="Cash" 
                          />
                          <FormControlLabel 
                            value="UPI" 
                            control={<Radio sx={{ '&.Mui-checked': { color: '#1976d2' } }} />} 
                            label="UPI" 
                          />
                        </RadioGroup>
                      </FormControl>
                    </Box>
                  </Box>
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
                      <InfoIcon sx={{ color: '#7b1fa2', fontSize: 28 }} />
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
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1, color: '#333', fontWeight: 500 }}>
                          Upload Image
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<UploadIcon />}
                          sx={{ 
                            textTransform: 'none',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                              borderColor: '#1565c0',
                              backgroundColor: 'rgba(25, 118, 210, 0.04)'
                            }
                          }}
                        >
                          CHOOSE FILE
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </Button>
                        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                          {formData.imageFile ? formData.imageFile.name : 'No file chosen'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                      <TextField
                        fullWidth
                        label="Reference Number (If any)"
                        value={formData.referenceNumber}
                        onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
                        placeholder="Enter Referal Student Admission Number"
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
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </>
          )}

          {/* Show message when incharge code is not valid */}
          {!isInchargeCodeValid && formData.inchargeCode.length > 0 && (
            <Card sx={{ 
              mb: 3, 
              borderRadius: 3, 
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e0e0e0'
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Please enter a valid incharge code (at least 6 characters) to continue with the form
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {isInchargeCodeValid && (
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={onBack}
                disabled={isSubmitting || createStudentMutation.isPending}
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
                disabled={isSubmitting || createStudentMutation.isPending}
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
                {isSubmitting || createStudentMutation.isPending ? 'Creating Student...' : 'Create Student'}
              </Button>
            </Box>
          )}
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
          Student registered successfully! Redirecting to dashboard...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentRegistrationPage;
