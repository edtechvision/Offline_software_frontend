import React from 'react';
import { Box, Typography, Avatar, Divider } from '@mui/material';

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
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Watermark */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '120px',
        color: '#f3f4f6',
        fontWeight: 'bold',
        zIndex: -1,
        opacity: 0.1,
        pointerEvents: 'none'
      }}>
        TB
      </Box>

      {/* Background Logo Watermark */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        opacity: 0.05,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundImage: 'url(/logo.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }} />

      {/* Header */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 3, 
        borderBottom: '2px solid #1976d2',
        pb: 2
      }}>
        <Box sx={{ 
          width: '60px', 
          height: '60px', 
          mx: 'auto', 
          mb: 1,
          borderRadius: '50%',
          backgroundImage: 'url(/logo.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }} />
        <Typography sx={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#1976d2', 
          mb: 0.5,
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          TARGET BOARD
        </Typography>
        <Typography sx={{ 
          fontSize: '14px', 
          color: '#374151', 
          mb: 0.5,
          fontWeight: 'bold'
        }}>
          TARGET BOARD JEHANABAD 804408
        </Typography>
        <Typography sx={{ 
          fontSize: '14px', 
          color: '#374151', 
          mb: 0.5,
          fontWeight: 'bold'
        }}>
          Bihar Board NO-1 Educational Platform
        </Typography>
        <Typography sx={{ 
          fontSize: '12px', 
          color: '#6B7280'
        }}>
          P.H No. -7779855339
        </Typography>
      </Box>

      {/* Receipt Title */}
      <Typography sx={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        textAlign: 'center', 
        mb: 3, 
        color: '#1976d2',
        textTransform: 'uppercase'
      }}>
        Admission Receipt
      </Typography>

      {/* Main Content */}
      <Box sx={{ display: 'flex', mb: 3 }}>
        {/* Left Column - Student Photo and Basic Info */}
        <Box sx={{ flex: 1, pr: 2 }}>
          {/* Student Photo */}
          <Box sx={{ textAlign: 'center', mb: 2,paddingRight: '180px' }}>
            <Avatar
              src={image}
              sx={{ 
                width: 160, 
                height: 160, 
                mx: 'auto', 
                overflow: 'hidden',
                objectFit: 'contain',
                border: '1px solid #1976d2',
                borderRadius: 1,
                
              }}
            >
              {studentName?.charAt(0) || 'S'}
            </Avatar>
          </Box>

          {/* Student Details */}
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Name :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {studentName || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Father's Name :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {fathersName || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Date of Birth :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {formatDate(dateOfBirth)}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Gender :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {gender || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Mobile No. :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {mobileNumber || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Permanent Address :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {formatAddress(presentAddress)}
            </Typography>
          </Box>
        </Box>

        {/* Right Column - Admission Details */}
        <Box sx={{ flex: 1, pl: 2 }}>
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Admission No. :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {admissionNo}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Admission Date :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {admissionDate}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Class :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {className || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Course :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {courseDetails?.courseId?.name || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Batch :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {courseDetails?.batchId?.batchName || 'N/A'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Session :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {courseDetails?.session || new Date().getFullYear() + 1}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'inline-block', width: '140px' }}>
              Admission Received By :
            </Typography>
            <Typography component="span" sx={{ fontSize: '11px', color: '#1976d2', fontWeight: 'bold' }}>
              {inchargeName || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Declaration Section */}
      <Box sx={{ 
        mt: 4, 
        p: 2, 
        border: '1px solid #E5E7EB', 
        borderRadius: 1 
      }}>
        <Typography sx={{ 
          fontSize: '14px', 
          fontWeight: 'bold', 
          color: '#1976d2', 
          mb: 1, 
          textAlign: 'center' 
        }}>
          Declaration
        </Typography>
        <Typography sx={{ 
          fontSize: '10px', 
          color: '#374151', 
          lineHeight: 1.4, 
          mb: 2 
        }}>
          I, Mr/Mrs ________________________ S/o or D/O ________________________ hereby declare that the information provided above is true, complete and accurate to the best of my knowledge. I agree to obey the rules and regulations of the institution. I understand that any false information provided by me can lead to cancellation of my admission without any refund. I also understand that failure to abide by the rules and regulations may result in disciplinary action against me.
        </Typography>
      </Box>

      {/* Signatures */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 3 
      }}>
        <Box sx={{ width: '150px', textAlign: 'center' }}>
          <Divider sx={{ mb: 1 }} />
          <Typography sx={{ fontSize: '9px', color: '#374151' }}>
            Signature of Student/Parent
          </Typography>
        </Box>
        
        <Box sx={{ width: '150px', textAlign: 'center' }}>
          <Divider sx={{ mb: 1 }} />
          <Typography sx={{ fontSize: '9px', color: '#374151' }}>
            Signature of Authority
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdmissionReceiptDisplay;
