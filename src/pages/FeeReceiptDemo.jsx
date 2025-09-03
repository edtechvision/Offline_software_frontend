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
import FeeReceiptGenerator from '../components/FeeReceiptGenerator';
import ReceiptDisplay from '../components/ReceiptDisplay';

const FeeReceiptDemo = () => {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [autoOpenReceipt, setAutoOpenReceipt] = useState(false);

  // Check for receipt data from sessionStorage on component mount
  useEffect(() => {
    const receiptData = sessionStorage.getItem('receiptData');
    if (receiptData) {
      try {
        const parsedData = JSON.parse(receiptData);
        setSelectedReceipt(parsedData);
        setAutoOpenReceipt(true);
        // Clear the sessionStorage after reading
        sessionStorage.removeItem('receiptData');
      } catch (error) {
        console.error('Error parsing receipt data:', error);
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

  // Sample receipt data - this would come from your API
  const sampleReceiptData = {
    "studentId": "68b6e3985c02b85e5921003c",
    "studentName": "Rohit Verma",
    "registrationNo": "TB0925002",
    "className": "9th",
    "courseName": "CLASS 12TH BATCH 2025-26",
    "batchName": "11TH BATCH (7:00 - 12:00)",
    "totalFee": 12000,
    "paymentDate": "2025-09-02T12:31:20.736Z",
    "amount": 2000,
    "previousReceivedAmount": 0,
    "pendingAmountAfterPayment": 10000,
    "paymentMode": "UPI",
    "transactionId": "TXN5678901",
    "remarks": "Down Payment at Admission",
    "receiptNo": "TBREC85836"
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
    console.log('Receipt printed:', receiptData);
  };

  const handleDownload = async (receiptData) => {
    try {
      // Import the PDF generation function
      const { pdf } = await import('@react-pdf/renderer');
      const FeeReceiptPDF = (await import('../components/FeeReceiptPDF')).default;
      
      // Generate PDF blob
      const blob = await pdf(<FeeReceiptPDF data={receiptData} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Fee_Receipt_${receiptData.receiptNo || receiptData.studentName}.pdf`;
      
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
  

      {/* PDF Receipt Display */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: 2,
        pt: 10
      }}>
        <Box sx={{
          width: '210mm', // A4 width
          minHeight: '297mm', // A4 height
          backgroundColor: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          border: '2px solid #10b981',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Receipt Content */}
          <Box sx={{ flex: 1 }}>
            <ReceiptDisplay data={displayReceiptData} />
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
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                }
              }}
            >
              Download PDF
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Receipt Generator Dialog */}
      {/* <FeeReceiptGenerator
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
        receiptData={displayReceiptData}
        onPrint={handlePrint}
        onDownload={handleDownload}
      /> */}
    </Box>
  );
};

export default FeeReceiptDemo;
