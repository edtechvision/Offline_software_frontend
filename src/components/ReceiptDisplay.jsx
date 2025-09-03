import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Helper function to convert number to words
const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  if (num === 0) return 'Zero';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
  return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Helper function to calculate next due date (15 days from payment date)
const calculateNextDueDate = (paymentDate) => {
  const date = new Date(paymentDate);
  date.setDate(date.getDate() + 15);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const ReceiptDisplay = ({ data }) => {
  const {
    studentName,
    registrationNo,
    className,
    courseName,
    batchName,
    totalFee,
    paymentDate,
    amount,
    previousReceivedAmount,
    pendingAmountAfterPayment,
    paymentMode,
    receiptNo,
    transactionId,
    remarks
  } = data;

  // Calculate derived values
  const totalReceivedAmount = previousReceivedAmount + amount;
  const duesAmount = pendingAmountAfterPayment;
  const amountInWords = numberToWords(amount) + ' Rupees Only';
  const formattedPaymentDate = formatDate(paymentDate);
  const nextDueDate = calculateNextDueDate(paymentDate);

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      backgroundColor: 'white'
    }}>
      {/* Background Watermark */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '120px',
        color: '#f0f0f0',
        fontWeight: 'bold',
        zIndex: 0,
        opacity: 0.1,
        pointerEvents: 'none'
      }}>
        TB
      </Box>

      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '2px solid #3B82F6',
        paddingBottom: '15px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo */}
        <Box sx={{
          width: '60px',
          height: '60px',
          marginRight: '15px',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/logo.png" 
            alt="TB Logo" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
        
        {/* Header Content */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography sx={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '5px',
            textTransform: 'uppercase'
          }}>
            TARGET BOARD
          </Typography>
          <Typography sx={{
            fontSize: '12px',
            color: '#374151',
            marginBottom: '2px'
          }}>
            TARGET BOARD JEHANABAD 804408
          </Typography>
          <Typography sx={{
            fontSize: '12px',
            color: '#374151',
            marginBottom: '2px'
          }}>
            Bihar Board NO-1 Educational Platform
          </Typography>
          <Typography sx={{
            fontSize: '10px',
            color: '#6B7280'
          }}>
            P.H No. -7779855339
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{
        display: 'flex',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Column - Admission Details */}
        <Box sx={{ flex: 1, marginRight: '20px' }}>
          <Typography sx={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '10px',
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '5px'
          }}>
            Admission Details
          </Typography>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '90px', fontWeight: 'bold' }}>
              Admission No. :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {registrationNo}
            </Typography>
          </Box>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '90px', fontWeight: 'bold' }}>
              Name :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {studentName}
            </Typography>
          </Box>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '90px', fontWeight: 'bold' }}>
              Father's Name :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              N/A
            </Typography>
          </Box>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '90px', fontWeight: 'bold' }}>
              Class :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {className}
            </Typography>
          </Box>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '90px', fontWeight: 'bold' }}>
              Course :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {courseName}
            </Typography>
          </Box>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '90px', fontWeight: 'bold' }}>
              Addition Course :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              NA
            </Typography>
          </Box>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '90px', fontWeight: 'bold' }}>
              Batch :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {batchName}
            </Typography>
          </Box>
        </Box>

        {/* Right Column - Receipt Details */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '10px',
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '5px'
          }}>
            Receipt Details
          </Typography>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '80px', fontWeight: 'bold' }}>
              Receipt No. :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {receiptNo}
            </Typography>
          </Box>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '80px', fontWeight: 'bold' }}>
              Date :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {formattedPaymentDate}
            </Typography>
          </Box>
          
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '80px', fontWeight: 'bold' }}>
              Next Due Date :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {nextDueDate}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Receipt Table */}
      <Box sx={{ marginTop: '20px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
        <Typography sx={{
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '15px',
          color: '#1F2937'
        }}>
          Receipt
        </Typography>
        
        <TableContainer component={Paper} sx={{ border: '1px solid #D1D5DB', width: '100%' , borderRadius: '4px'}}>
          <Table size="small" sx={{ width: '100%', tableLayout: 'fixed' }}>
              {/* Table Header */}
              <TableHead sx={{ backgroundColor: '#F3F4F6' }}>
                <TableRow>
                  <TableCell sx={{ 
                    fontSize: '10px', 
                    fontWeight: 'bold', 
                    color: '#374151', 
                    textAlign: 'left',
                    borderRight: '1px solid #D1D5DB',
                    width: '10%',
                    padding: '8px 4px'
                  }}>
                    #
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: '10px', 
                    fontWeight: 'bold', 
                    color: '#374151',
                    textAlign: 'left',
                    borderRight: '1px solid #D1D5DB',
                    width: '60%',
                    padding: '8px 4px'
                  }}>
                    Particular
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: '10px', 
                    fontWeight: 'bold', 
                    color: '#374151',
                    textAlign: 'right',
                    width: '30%',
                    padding: '8px 4px'
                  }}>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
            
            <TableBody>
              {/* Table Rows */}
              <TableRow>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  color: '#374151', 
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '10%'
                }}>
                  1
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  color: '#374151',
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '60%',
                  wordWrap: 'break-word'
                }}>
                  Course Fee ({courseName})
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  color: '#374151',
                  textAlign: 'right',
                  padding: '8px 4px',
                  width: '30%'
                }}>
                  ₹ {totalFee.toLocaleString()}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  color: '#374151', 
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '10%'
                }}>
                  2
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  color: '#374151',
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '60%'
                }}>
                  Previous Received Amount
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  color: '#374151',
                  textAlign: 'right',
                  padding: '8px 4px',
                  width: '30%'
                }}>
                  ₹ {previousReceivedAmount.toLocaleString()}
                </TableCell>
              </TableRow>
              
              <TableRow>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  color: '#374151', 
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '10%'
                }}>
                  3
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  color: '#374151',
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '60%'
                }}>
                  Amount Received
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  color: '#374151',
                  textAlign: 'right',
                  padding: '8px 4px',
                  width: '30%'
                }}>
                  ₹ {amount.toLocaleString()}
                </TableCell>
              </TableRow>
              
              {/* Summary Rows */}
              <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  fontWeight: 'bold',
                  color: '#1F2937',
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '10%'
                }}>
                  -
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  fontWeight: 'bold',
                  color: '#1F2937',
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '60%'
                }}>
                  Total Received Amount
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  fontWeight: 'bold',
                  color: '#1F2937',
                  textAlign: 'right',
                  padding: '8px 4px',
                  width: '30%'
                }}>
                  ₹ {amount.toLocaleString()}
                </TableCell>
              </TableRow>
              
              <TableRow sx={{ backgroundColor: '#FEF2F2' }}>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  fontWeight: 'bold',
                  color: '#1F2937',
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '10%'
                }}>
                  -
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  fontWeight: 'bold',
                  color: '#1F2937',
                  textAlign: 'left',
                  borderRight: '1px solid #D1D5DB',
                  padding: '8px 4px',
                  width: '60%'
                }}>
                  Dues Amount
                </TableCell>
                <TableCell sx={{ 
                  fontSize: '9px', 
                  fontWeight: 'bold',
                  color: '#1F2937',
                  textAlign: 'right',
                  padding: '8px 4px',
                  width: '30%'
                }}>
                  ₹ {duesAmount.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Footer */}
      <Box sx={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #E5E7EB', position: 'relative', zIndex: 1 }}>
        <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '10px', color: '#374151', width: '150px', fontWeight: 'bold' }}>
            Received Amount in Word :
          </Typography>
          <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
            ({amountInWords})
          </Typography>
        </Box>
        
        <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '10px', color: '#374151', width: '150px', fontWeight: 'bold' }}>
            Mode of Payment :
          </Typography>
          <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
            {paymentMode}
          </Typography>
        </Box>
        
        {transactionId && (
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '150px', fontWeight: 'bold' }}>
              Transaction ID :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {transactionId}
            </Typography>
          </Box>
        )}
        
        {remarks && (
          <Box sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '10px', color: '#374151', width: '150px', fontWeight: 'bold' }}>
              Remarks :
            </Typography>
            <Typography sx={{ fontSize: '10px', color: '#3B82F6', fontWeight: 'bold', flex: 1 }}>
              {remarks}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Signatures */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '30px',
        position: 'relative',
        zIndex: 1
      }}>
        <Box sx={{ width: '150px', textAlign: 'center' }}>
          <Box sx={{ 
            borderBottom: '1px solid #374151', 
            marginBottom: '5px', 
            height: '20px' 
          }} />
          <Typography sx={{ fontSize: '9px', color: '#374151' }}>
            Signature of Student/Parent
          </Typography>
        </Box>
        
        <Box sx={{ width: '150px', textAlign: 'center' }}>
          <Box sx={{ 
            borderBottom: '1px solid #374151', 
            marginBottom: '5px', 
            height: '20px' 
          }} />
          <Typography sx={{ fontSize: '9px', color: '#374151' }}>
            Signature of Authority
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ReceiptDisplay;
