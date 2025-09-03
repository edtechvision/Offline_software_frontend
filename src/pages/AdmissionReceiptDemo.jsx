import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import AdmissionReceiptDisplay from '../components/AdmissionReceiptDisplay';

const AdmissionReceiptDemo = () => {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [autoOpenReceipt, setAutoOpenReceipt] = useState(false);

  // Check for receipt data from sessionStorage on component mount
  useEffect(() => {
    const receiptData = sessionStorage.getItem('admissionReceiptData');
    if (receiptData) {
      try {
        const parsedData = JSON.parse(receiptData);
        setSelectedReceipt(parsedData);
        setAutoOpenReceipt(true);
        // Clear the sessionStorage after reading
        sessionStorage.removeItem('admissionReceiptData');
      } catch (error) {
        console.error('Error parsing admission receipt data:', error);
      }
    }
  }, []);

  // Auto-open receipt generator if data is available
  useEffect(() => {
    if (autoOpenReceipt && selectedReceipt) {
      setIsReceiptOpen(true);
      setAutoOpenReceipt(false);
    }
  }, [autoOpenReceipt, selectedReceipt]);

  // Sample admission receipt data - this would come from your API
  const sampleReceiptData = {
    "studentId": "68b6e3985c02b85e5921003c",
    "studentName": "Niranjan Kumar",
    "fathersName": "Satendra Chaudhary",
    "mothersName": "N/A",
    "dateOfBirth": "2008-07-09",
    "gender": "Male",
    "mobileNumber": "7061911460",
    "alternativeMobileNumber": "N/A",
    "email": "niranjan@example.com",
    "adharNumber": "123456789012",
    "presentAddress": {
      "fullAddress": "USASDEWRA",
      "district": "Jehanabad",
      "state": "Bihar",
      "country": "India",
      "pincode": "804408"
    },
    "permanentAddress": {
      "fullAddress": "USASDEWRA",
      "district": "Jehanabad",
      "state": "Bihar",
      "country": "India",
      "pincode": "804408"
    },
    "isPermanentSameAsPresent": true,
    "collegeName": "Target Board",
    "className": "12th",
    "courseDetails": {
      "courseId": {
        "name": "CLASS 12TH BATCH 2025-26 + CRASH COURSE"
      },
      "batchId": {
        "batchName": "12TH BATCH 1 (06:30 - 11:30)"
      },
      "session": "2026",
      "paymentType": "Full Payment",
      "courseFee": 12000,
      "downPayment": 2000,
      "paymentMode": "UPI"
    },
    "inchargeName": "Gauri Shankar",
    "registrationNo": "TB2446256",
    "image": null
  };

  const handleGenerateReceipt = (receiptData) => {
    setSelectedReceipt(receiptData);
    setIsReceiptOpen(true);
  };

  // Use actual receipt data if available, otherwise use sample data
  const displayReceiptData = selectedReceipt || sampleReceiptData;

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setSelectedReceipt(null);
  };

  const handlePrint = (receiptData) => {
    console.log('Admission receipt printed:', receiptData);
  };

  const handleDownload = async (receiptData) => {
    try {
      // Import the PDF generation function
      const { pdf } = await import('@react-pdf/renderer');
      const AdmissionReceiptPDF = (await import('../components/AdmissionReceiptPDF')).default;
      
      // Generate PDF blob
      const blob = await pdf(<AdmissionReceiptPDF data={receiptData} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Admission_Receipt_${receiptData.studentName || receiptData.registrationNo || 'Student'}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <Box sx={{ 
      p: 0, 
      m: 0, 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        p: 4,
        mb: 4,
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.25)'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '0.5px', mb: 1 }}>
          Admission Receipt Demo
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.95 }}>
          Preview and download admission receipts in PDF format
        </Typography>
      </Box>

      {/* PDF Receipt Display */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: 2,
        pt: 0
      }}>
        <Box sx={{
          width: '210mm', // A4 width
          minHeight: '297mm', // A4 height
          backgroundColor: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          border: '2px solid #1976d2',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Receipt Content */}
          <Box sx={{ flex: 1 }}>
            <AdmissionReceiptDisplay data={displayReceiptData} />
          </Box>
          
          {/* Download PDF Button - Inside the receipt */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload(displayReceiptData)}
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                }
              }}
            >
              Download PDF
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Sample Data Info */}
      <Box sx={{ p: 2, maxWidth: '1200px', mx: 'auto' }}>
        <Alert severity="info" sx={{ borderRadius: '8px' }}>
          <Typography variant="body2">
            <strong>Demo Data:</strong> This is showing sample admission receipt data. 
            In the actual application, this would be populated with real student data from your database.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default AdmissionReceiptDemo;
