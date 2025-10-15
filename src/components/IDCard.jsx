import React, { useRef } from 'react';
import { Card, Box, Typography, Grid, Avatar, IconButton, Tooltip } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { Download as DownloadIcon } from '@mui/icons-material';
import html2canvas from 'html2canvas';

const IDCard = ({ 
  studentData = {}, 
  customStyles = {},
  size = 'medium', // small, medium, large
  showDownloadButton = true
}) => {
  const cardRef = useRef(null);
  // Default student data
  const defaultStudentData = {
    name: 'GAUTAM KUMAR',
    fatherName: 'Arun Yadav',
    studentId: 'TB920214',
    class: '12th',
    course: '12th Batch 2025-26',
    address: 'Vill - Marsandha, Post- Khemnichak Patna- 800001 (Bihar)',
    contactNo: '+91 9142806007',
    photoUrl: null // Will use placeholder if null
  };

  // Default styles
  const defaultStyles = {
    backgroundGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    headerTextColor: '#033398', // Blue
    subHeaderTextColor: '#000200',
    nameTextColor: '#4D5201', // Green
    labelTextColor: '#120600', // Blue
    valueTextColor: '#072E82',
    borderRadius: '16px',
    waveColor: '#4CAF50',
    // Font customization defaults
    headerFontSize: '33px',
    headerFontWeight: 'bold',
    subHeaderFontSize: '13px',
    subHeaderFontWeight: '500',
    nameFontSize: '24px',
    nameFontWeight: 'bold',
    labelFontSize: '12px',
    labelFontWeight: 'bold',
    valueFontSize: '11px',
    valueFontWeight: 'bold'
  };

  // Size configurations - Standard ID Card dimensions (791 × 1256 pixels at 300 DPI)
  const sizeConfig = {
    small: {
      width: 350,
      height: 500,
      fontSize: {
        header: '24px',
        subHeader: '11px',
        name: '20px',
        label: '10px',
        value: '9px'
      },
      spacing: 1.2,
      photoSize: 90,
      qrSize: 50
    },
    medium: {
      width: 420, // Increased width for better proportions
      height: 600, // Increased height proportionally
      fontSize: {
        header: '33px',
        subHeader: '13px',
        name: '24px',
        label: '12px',
        value: '11px'
      },
      spacing: 1.8,
      photoSize: 110,
      qrSize: 60
    },
    large: {
      width: 500, // Increased width for better visibility
      height: 725, // Increased height proportionally
      fontSize: {
        header: '26px',
        subHeader: '15px',
        name: '28px',
        label: '14px',
        value: '13px'
      },
      spacing: 2.2,
      photoSize: 130,
      qrSize: 70
    }
  };

  // Merge data and styles
  const data = { ...defaultStudentData, ...studentData };
  const styles = { ...defaultStyles, ...customStyles };
  const config = sizeConfig[size];

  // Generate QR code value
  const qrValue = `Name: ${data.name}\nID: ${data.studentId}\nContact: ${data.contactNo}\nCourse: ${data.course}`;

  // Download ID card as image
  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `ID_Card_${data.studentId || data.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading ID card:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Card
        ref={cardRef}
        sx={{
          width: config.width,
          height: config.height,
          background: styles.backgroundGradient,
          borderRadius: styles.borderRadius,
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid #fff',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            background: `linear-gradient(45deg, transparent 20%, ${styles.waveColor}20 20%, ${styles.waveColor}20 40%, transparent 40%, transparent 60%, ${styles.waveColor}15 60%, ${styles.waveColor}15 80%, transparent 80%)`,
            opacity: 0.3,
            zIndex: 1
          }
        }}
      >
      {/* Background Element */}
      <Box
        sx={{
          position: 'absolute',
          top: '-60px',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'url(/element.png) no-repeat 25% -9%',
          backgroundSize: 'cover',
          backgroundPosition: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.2,
          zIndex: 1
        }}
      />

      {/* Header Section */}
      <Box sx={{ p: config.spacing, position: 'relative', zIndex: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
            }}
          >
            <img
              src="/logo.png"
              alt="TARGET BOARD Logo"
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'contain'
              }}
            />
          </Box>
          
          {/* Header Text */}
          <Box sx={{ flex: 1, pt: 0.5 }}>
            <Typography
              sx={{
                fontSize: styles.headerFontSize || config.fontSize.header,
                fontWeight: styles.headerFontWeight || 'bold',
                fontFamily: 'Montserrat, sans-serif',
                color: styles.headerTextColor,
                lineHeight: 1.1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.8)',
                letterSpacing: '0.5px',
                mb: 0.5
              }}
            >
              TARGET BOARD
            </Typography>
            <Typography
              sx={{
                fontSize: styles.subHeaderFontSize || config.fontSize.subHeader,
                fontWeight: styles.subHeaderFontWeight || 500,
                color: styles.subHeaderTextColor,
                lineHeight: 1.2,
                textAlign: 'center',
                mb: 0.2
              }}
            >
              NEAR HP PETROL PUMP, MAIN ROAD
            </Typography>
            <Typography
              sx={{
                fontSize: styles.subHeaderFontSize || config.fontSize.subHeader,
                fontWeight: styles.subHeaderFontWeight || 500,
                color: styles.subHeaderTextColor,
                lineHeight: 1.2,
                textAlign: 'center'
              }}
            >
              JEHANABAD, 7779833559
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Photo Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1, position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            width: config.photoSize,
            height: config.photoSize,
            borderRadius: '8px',
            border: '3px solid #4D4B08',
            overflow: 'hidden',
            background: '#f5f5f5',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {data.photoUrl ? (
            <img
              src={data.photoUrl}
              alt="Student"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '4px',
                fontSize: config.fontSize.name,
                bgcolor: '#e0e0e0',
                color: '#666'
              }}
            >
              {data.name?.charAt(0) || 'S'}
            </Avatar>
          )}
        
        </Box>
      </Box>

      {/* Name Section */}
      <Box sx={{ px: config.spacing, mb: config.spacing, position: 'relative', zIndex: 2 }}>
        <Typography
          sx={{
            fontSize: styles.nameFontSize || config.fontSize.name,
            fontWeight: styles.nameFontWeight || 'bold',
            fontFamily: 'Montserrat, sans-serif',
            color: styles.nameTextColor,
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
            letterSpacing: '1.5px',
            lineHeight: 1.1
          }}
        >
          {data.name}
        </Typography>
      </Box>

      {/* Details Section */}
      <Box sx={{ px: config.spacing, flex: 1, position: 'relative', zIndex: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
          {[
            { label: "Father's Name", value: data.fatherName },
            { label: "Student Id", value: data.studentId },
            { label: "Name", value: data.name },
            { label: "Class", value: data.class },
            { label: "Course", value: data.course },
            { label: "Address", value: data.address },
            { label: "Contact No", value: data.contactNo }
          ].map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Typography
                component="span"
                sx={{
                  fontSize: styles.labelFontSize || config.fontSize.label,
                  fontWeight: styles.labelFontWeight || 'bold',
                  fontFamily: 'Khand, sans-serif',
                  color: styles.labelTextColor,
                  minWidth: '90px',
                  marginRight: '8px',
                  display: 'inline-block',
                  lineHeight: 1.3
                }}
              >
                {item.label}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontSize: styles.valueFontSize || config.fontSize.value,
                  fontWeight: styles.valueFontWeight || 'bold',
                  fontFamily: 'Khand, sans-serif',
                  color: styles.valueTextColor,
                  flex: 1,
                  wordBreak: index === 5 ? 'break-word' : 'normal', // Address can break
                  lineHeight: 1.3
                }}
              >
                : {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* QR Code Section */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 20, 
          right: 20,
          zIndex: 3,
          background: '#fff',
          padding: '6px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
          border: '1px solid rgba(0,0,0,0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(0,0,0,0.1))',
            borderRadius: '10px',
            zIndex: -1
          }
        }}
      >
        <QRCodeSVG
          value={qrValue}
          size={config.qrSize}
          level="M"
          includeMargin={false}
        />
      </Box>
      </Card>
      
      {/* Download Button */}
      {showDownloadButton && (
        <Tooltip title="Download ID Card">
          <IconButton
            onClick={handleDownload}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease',
              zIndex: 10
            }}
            size="small"
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default IDCard;
