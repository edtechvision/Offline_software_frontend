import React from 'react';
import { Box, Typography, Avatar, Divider } from '@mui/material';
import { CallEnd, Phone, PhoneEnabled } from '@mui/icons-material';

const AdmissionReceiptDisplay = ({ data }) => {
  const {
    studentName,
    fathersName,
    mothersName,
    dateOfBirth,
    gender,
    mobileNumber,
    alternativeMobileNumber,
    email,
    adharNumber,
    presentAddress,
    permanentAddress,
    isPermanentSameAsPresent,
    collegeName,
    className,
    courseDetails,
    inchargeName,
    registrationNo,
    image
  } = data;


  console.log(data, "data");

  // Calculate admission date (current date)
  const admissionDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Generate admission number if not available
  const admissionNo = registrationNo || `TB${Date.now().toString().slice(-7)}`;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return 'N/A';
    if (typeof address === 'string') return address;
    return `${address.fullAddress || ''}, ${address.district || ''}, ${address.state || ''}, ${address.country || ''} - ${address.pincode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '');
  };

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      fontFamily: 'Montserrat, Arial, sans-serif !important',
      position: 'relative',
      overflow: 'hidden',

    }}>
      {/* Watermark */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '200px',
        color: '#f3f4f6',
        fontWeight: 'bold',
        zIndex: 0,
        opacity: 0.05,
        pointerEvents: 'none'
      }}>
        TB
      </Box>

      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        borderBottom: '1px solid #000',
        pb: 2,
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo */}
        <Box sx={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          flexShrink: 0
        }}>
          <img
            src="/logo.png"
            alt="TB Logo"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain'
            }}
          />
        </Box>

        {/* Header Text - Centered */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          mx: 4
        }}>
          <Typography sx={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#000',
            mb: 0,
            letterSpacing: '1px',
            fontFamily: 'Montserrat, Arial, sans-serif !important',
            textAlign: 'center'
          }}>
            TARGET BOARD
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#000',
            fontWeight: 'normal',
            fontFamily: 'Montserrat, Arial, sans-serif !important',
            textAlign: 'center'
          }}>
            TARGET BOARD JEHANABAD 804408
          </Typography>
          <Typography sx={{
            fontSize: '14px',
            color: '#000',
            fontWeight: 'bold',
            fontFamily: 'Montserrat, Arial, sans-serif !important',
            textAlign: 'center'
          }}>
            Bihar Board NO-1 Educational Platform
          </Typography>
          {/* Phone - Right Aligned */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0
          }}>
            <Box sx={{
              width: '20px',
              height: '20px',

              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Phone />
            </Box>
            <Typography sx={{
              fontSize: '14px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              +91 7779855339
            </Typography>
          </Box>
        </Box>


      </Box>

      {/* Receipt Title */}
      <Box sx={{
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        py: 1,
        mb: 2,
        position: 'relative',
        zIndex: 1
      }}>
        <Typography sx={{
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'Montserrat, Arial, sans-serif !important'
        }}>
          Admission Receipt
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2, width: '100%' }}>
        <Avatar src={image} sx={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #000' }} />

      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', border: '1px solid #000', position: 'relative', zIndex: 1 }}>
        {/* Left Column - Student Details */}
        <Box sx={{
          flex: 1,
          borderRight: '1px solid #000',
          p: 2,
          minHeight: '300px'
        }}>
          <Typography sx={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#000',
            mb: 2,
            textDecoration: 'underline',
            fontFamily: 'Montserrat, Arial, sans-serif !important'
          }}>
            Student Details:
          </Typography>

          <Box sx={{ mb: 1 }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              {studentName || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              <span style={{ fontWeight: 'bold' }}>F. Name-</span> {fathersName || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              <span style={{ fontWeight: 'bold' }}>Date of Birth :</span> {formatDate(dateOfBirth)}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              <span style={{ fontWeight: 'bold' }}>Address :</span> {formatAddress(presentAddress)}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              <span style={{ fontWeight: 'bold' }}>Class :</span> {className || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              <span style={{ fontWeight: 'bold' }}>Course :</span> {courseDetails?.courseId?.name || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              <span style={{ fontWeight: 'bold' }}>Batch :</span> {courseDetails?.batchId?.batchName || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Right Column - Admission Info */}
        <Box sx={{
          width: '250px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Date */}
          <Box sx={{
            borderBottom: '1px solid #000',
            p: 1.5,
            backgroundColor: '#f5f5f5'
          }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              Date : {admissionDate}
            </Typography>
          </Box>

          {/* Session */}
          <Box sx={{
            borderBottom: '1px solid #000',
            p: 1.5
          }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              Session : {courseDetails?.session || 'N/A'}
            </Typography>
          </Box>

          {/* Admission No */}
          <Box sx={{
            borderBottom: '1px solid #000',
            p: 1.5,
            backgroundColor: '#f5f5f5'
          }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              Admission No : {admissionNo}
            </Typography>
          </Box>

          {/* Admission Date */}
          <Box sx={{
            borderBottom: '1px solid #000',
            p: 1.5
          }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              Admission Date : {admissionDate}
            </Typography>
          </Box>

          {/* Mobile Number */}
          <Box sx={{
            p: 1.5,
            backgroundColor: '#f5f5f5',
            flex: 1
          }}>
            <Typography sx={{
              fontSize: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              Mobile Number : {mobileNumber || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ display: 'flex', position: 'relative', zIndex: 1 }}>
        {/* Declaration */}
        <Box sx={{
          flex: 1,
        
          p: 2
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#000',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              DECLARATION
            </Typography>
            <Typography sx={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#000',
              fontFamily: 'Montserrat, Arial, sans-serif !important'
            }}>
              ADMISSION RECEIVED BY {inchargeName || 'N/A'}
            </Typography>
          </Box>

          <Typography sx={{
            fontSize: '10px',
            color: '#000',
            lineHeight: 1.4,
            textAlign: 'justify',
            fontWeight: 'bold',
            fontFamily: 'Montserrat, Arial, sans-serif !important'
          }}>
            I Mr/Mrs.................................................................S/o or D/o....................................................hereby declare that
            The information provided in this form and all supporting documents is true, complete,
            and accurate to the best of my knowledge.
            <br />I Will Obey all the Rules and Regulations Of the Institution and be fully responsible for
            violating the rules.
            <br />I understand that any false or misleading information may result in the cancellation of my
            admission and after payble no any payment refunded by institution.
            <br />I agree to abide by the rules and regulations of Target Board and understand that failure
            to do so may result in disciplinary action.
          </Typography>
        </Box>
      </Box>

      {/* Signatures */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        mt: 3,
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{
            fontSize: '10px',
            color: '#000',
            borderBottom: '1px dotted #000',
            pb: 1,
            minWidth: '200px',
            display: 'inline-block'
          }}>
          </Typography>
          <Typography sx={{
            fontSize: '12px',
            color: '#000',
            fontWeight: 'bold',
            mt: 1,
            fontFamily: 'Montserrat, Arial, sans-serif !important'
          }}>
            Signature of Authority
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{
            fontSize: '10px',
            color: '#000',
            borderBottom: '1px dotted #000',
            pb: 1,
            minWidth: '200px',
            display: 'inline-block'
          }}>
          </Typography>
          <Typography sx={{
            fontSize: '12px',
            color: '#000',
            fontWeight: 'bold',
            mt: 1,
            fontFamily: 'Montserrat, Arial, sans-serif !important'
          }}>
            Signature of Student/Parent
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdmissionReceiptDisplay;