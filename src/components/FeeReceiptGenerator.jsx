import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Print as PrintIcon, 
  Download as DownloadIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import FeeReceiptPDF from './FeeReceiptPDF';

const FeeReceiptGenerator = ({ 
  isOpen, 
  onClose, 
  receiptData, 
  onPrint, 
  onDownload 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePrint = async () => {
    try {
      setIsGenerating(true);
      
      // Generate PDF blob
      const blob = await pdf(<FeeReceiptPDF data={receiptData} />).toBlob();
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      const url = URL.createObjectURL(blob);
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Fee Receipt - ${receiptData.receiptNo}</title>
            <style>
              body { margin: 0; padding: 0; }
              iframe { width: 100%; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${url}" onload="window.print(); window.close();"></iframe>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      showSnackbar('Receipt sent to printer successfully!', 'success');
      
      if (onPrint) {
        onPrint(receiptData);
      }
      
    } catch (error) {
      console.error('Print error:', error);
      showSnackbar('Failed to print receipt. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Generate PDF blob
      const blob = await pdf(<FeeReceiptPDF data={receiptData} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Fee_Receipt_${receiptData.receiptNo}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      showSnackbar('Receipt downloaded successfully!', 'success');
      
      if (onDownload) {
        onDownload(receiptData);
      }
      
    } catch (error) {
      console.error('Download error:', error);
      showSnackbar('Failed to download receipt. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    try {
      setIsGenerating(true);
      
      // Generate PDF blob
      const blob = await pdf(<FeeReceiptPDF data={receiptData} />).toBlob();
      
      // Open in new tab for preview
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      showSnackbar('Receipt preview opened in new tab!', 'success');
      
    } catch (error) {
      console.error('Preview error:', error);
      showSnackbar('Failed to preview receipt. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!receiptData) {
    return null;
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            minHeight: '500px'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <ReceiptIcon sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Fee Receipt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Receipt No: {receiptData.receiptNo}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Receipt Summary */}
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Receipt Summary
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Student Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {receiptData.studentName}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Registration No.
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {receiptData.registrationNo}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Course
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {receiptData.courseName}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Amount Received
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>
                  ₹ {receiptData.amount.toLocaleString()}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Payment Mode
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {receiptData.paymentMode}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Dues Amount
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'warning.main' }}>
                  ₹ {receiptData.pendingAmountAfterPayment.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button
              variant="contained"
              startIcon={isGenerating ? <CircularProgress size={16} /> : <PrintIcon />}
              onClick={handlePrint}
              disabled={isGenerating}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              Print Receipt
            </Button>
            
            <Button
              variant="contained"
              startIcon={isGenerating ? <CircularProgress size={16} /> : <DownloadIcon />}
              onClick={handleDownload}
              disabled={isGenerating}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1.5,
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                }
              }}
            >
              Download PDF
            </Button>
            
            <Button
              variant="outlined"
              onClick={handlePreview}
              disabled={isGenerating}
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1.5,
                borderColor: '#6b7280',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#374151',
                  color: '#374151',
                }
              }}
            >
              Preview
            </Button>
          </Box>

          {/* Instructions */}
          <Alert severity="info" sx={{ mt: 3, borderRadius: '8px' }}>
            <Typography variant="body2">
              <strong>Instructions:</strong> Click "Print Receipt" to print the receipt directly, 
              "Download PDF" to save it to your device, or "Preview" to view it in a new tab.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={onClose}
            startIcon={<CloseIcon />}
            sx={{ borderRadius: '8px' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FeeReceiptGenerator;
