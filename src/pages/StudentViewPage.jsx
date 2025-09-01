import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const StudentViewPage = ({ student: propStudent, onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(propStudent || null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id || propStudent) return;
      try {
        setLoading(true);
        const res = await fetch(`https://seashell-app-vgu3a.ondigitalocean.app/api/v1/students/${id}`);
        const data = await res.json();
        if (data?.success && data?.data) {
          setStudent(data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, propStudent]);

  const handleBack = () => {
    if (onBack) return onBack();
    navigate(-1);
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.fullAddress}, ${address.district}, ${address.state}, ${address.country} - ${address.pincode}`;
  };

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
            onClick={handleBack}
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
              <PersonIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '0.5px', mb: 0.5 }}>
                Student Details
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 400 }}>
                View complete student information
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
        {loading || !student ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
        <Grid container spacing={3}>
          {/* Student Photo and Basic Info */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 4, 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e8e8e8',
              textAlign: 'center',
              p: 3
            }}>
              <Avatar
                src={student.image}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto', 
                  mb: 3,
                  border: '4px solid #1976d2'
                }}
              >
                {student.studentName?.charAt(0) || 'S'}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>
                {student.studentName || 'N/A'}
              </Typography>
              <Chip
                label={student.inchargeCode || 'N/A'}
                color="primary"
                sx={{ mb: 2, fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Registration No: {student.registrationNo || 'N/A'}
              </Typography>
              <Chip
                label="Active"
                color="success"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Card>
          </Grid>

          {/* Student Information */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e0e0e0'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <PersonIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        Personal Information
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Father's Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.fathersName || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Mother's Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.mothersName || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatDate(student.dateOfBirth)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Gender</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.gender || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Category</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.category || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Nationality</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.nationality || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e0e0e0'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <PhoneIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        Contact Information
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Mobile Number</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.mobileNumber || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Alternative Mobile</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.alternativeMobileNumber || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.email || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Aadhar Number</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.adharNumber || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e0e0e0'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <LocationIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        Address Information
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Present Address</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatAddress(student.presentAddress)}
                        </Typography>
                      </Grid>
                      {!student.isPermanentSameAsPresent && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Permanent Address</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatAddress(student.permanentAddress)}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Academic Information */}
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e0e0e0'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <SchoolIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        Academic Information
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">College Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.collegeName || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Class Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.className || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Course</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.courseDetails?.courseId?.name || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Batch</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.courseDetails?.batchId?.batchName || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Session</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.courseDetails?.session || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Incharge</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.inchargeName || 'N/A'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Payment Information */}
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: 3, 
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e0e0e0'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <PaymentIcon sx={{ color: '#1976d2', fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                        Payment Information
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Payment Type</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.courseDetails?.paymentType || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Course Fee</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          ₹{student.courseDetails?.courseFee || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Down Payment</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          ₹{student.courseDetails?.downPayment || 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Payment Mode</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {student.courseDetails?.paymentMode || 'N/A'}
                        </Typography>
                      </Grid>
                      {student.courseDetails?.nextPaymentDueDate && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Next Payment Due</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatDate(student.courseDetails.nextPaymentDueDate)}
                          </Typography>
                        </Grid>
                      )}
                      {student.courseDetails?.referenceNumber && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Reference Number</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {student.courseDetails.referenceNumber}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        )}
      </Box>
    </Box>
  );
};

export default StudentViewPage;
