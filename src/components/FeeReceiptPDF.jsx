import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register Montserrat font from Google Fonts
Font.register({
  family: 'Montserrat',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXpsog.woff2',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw3aXpsog.woff2',
      fontWeight: 'bold',
    },
  ],
});

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Montserrat',
    position: 'relative',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '2px solid #3B82F6',
    paddingBottom: 15,
  },
  subtitleText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 100, // Using the thin font weight
    fontFamily: 'Montserrat',
    textAlign: 'center',
    marginBottom: 4,
    marginTop: 2,
  },
  
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 30,
  },
  
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  
  subtitle: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 2,
  },
  
  contact: {
    fontSize: 10,
    color: '#6B7280',
  },
  
  // Main Content
  mainContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  
  leftColumn: {
    flex: 1,
    marginRight: 20,
  },
  
  rightColumn: {
    flex: 1,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: 5,
  },
  
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  
  detailLabel: {
    fontSize: 10,
    color: '#374151',
    width: 120,
    fontWeight: 'bold',
  },
  
  detailValue: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: 'bold',
    flex: 1,
  },
  
  // Receipt Table
  receiptSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#1F2937',
  },
  
  table: {
    border: '1px solid #D1D5DB',
    borderRadius: 4,
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottom: '1px solid #D1D5DB',
  },
  
  tableHeaderCell: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    borderRight: '1px solid #D1D5DB',
  },
  
  tableHeaderCellLeft: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'left',
    borderRight: '1px solid #D1D5DB',
  },
  
  tableHeaderCellRight: {
    padding: 8,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #D1D5DB',
  },
  
  tableCell: {
    padding: 8,
    fontSize: 9,
    color: '#374151',
    borderRight: '1px solid #D1D5DB',
    textAlign: 'left',
  },
  
  tableCellCenter: {
    textAlign: 'center',
  },
  
  tableCellRight: {
    textAlign: 'right',
  },
  
  tableCellBold: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  
  // Footer
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTop: '1px solid #E5E7EB',
  },
  
  footerRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  
  footerLabel: {
    fontSize: 10,
    color: '#374151',
    width: 180,
    fontWeight: 'bold',
  },
  
  footerValue: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: 'bold',
    flex: 1,
  },
  
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  
  signatureBox: {
    width: 150,
    textAlign: 'center',
  },
  
  signatureLine: {
    borderBottom: '1px solid #374151',
    marginBottom: 5,
    height: 20,
  },
  
  signatureLabel: {
    fontSize: 9,
    color: '#374151',
  },
  
  // Watermark
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 120,
    color: '#F3F4F6',
    fontWeight: 'bold',
    zIndex: -1,
    opacity: 0.1,
  },
  
  // Background Logo Watermark
  backgroundLogo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    height: 300,
    opacity: 0.05,
    zIndex: -1,
  },
});

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

// Main PDF Component
const FeeReceiptPDF = ({ data }) => {
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

  console.log(data,"datat");

  // Calculate derived values
  const totalReceivedAmount = previousReceivedAmount + amount;
  const duesAmount = pendingAmountAfterPayment;
  const amountInWords = numberToWords(amount) + ' Rupees Only';
  const formattedPaymentDate = formatDate(paymentDate);
  const nextDueDate = calculateNextDueDate(paymentDate);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>TB</Text>
        
        {/* Background Logo Watermark */}
        <Image 
          style={styles.backgroundLogo} 
          src="/logo.png" 
        />
        
        {/* Header */}
        <View style={styles.header}>
          <Image 
            style={styles.logo} 
            src="/logo.png" 
          />
          <View style={styles.headerContent}>
            <Text style={styles.title}>TARGET BOARD</Text>
            <Text style={styles.subtitle}>TARGET BOARD JEHANABAD 804408</Text>
            <Text style={styles.subtitle}>Bihar Board NO-1 Educational Platform</Text>
            <Text style={styles.contact}>P.H No. -7779855339</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Left Column - Admission Details */}
          <View style={styles.leftColumn}>
            <Text style={styles.sectionTitle}>Admission Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Admission No. :</Text>
              <Text style={styles.detailValue}>{registrationNo}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name :</Text>
              <Text style={styles.detailValue}>{studentName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Father's Name :</Text>
              <Text style={styles.detailValue}>N/A</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Class :</Text>
              <Text style={styles.detailValue}>{className}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Course :</Text>
              <Text style={styles.detailValue}>{courseName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Addition Course :</Text>
              <Text style={styles.detailValue}>NA</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Batch :</Text>
              <Text style={styles.detailValue}>{batchName}</Text>
            </View>
          </View>

          {/* Right Column - Receipt Details */}
          <View style={styles.rightColumn}>
            <Text style={styles.sectionTitle}>Receipt Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Receipt No. :</Text>
              <Text style={styles.detailValue}>{receiptNo}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date :</Text>
              <Text style={styles.detailValue}>{formattedPaymentDate}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Next Due Date :</Text>
              <Text style={styles.detailValue}>{nextDueDate}</Text>
            </View>
          </View>
        </View>

        {/* Receipt Table */}
        <View style={styles.receiptSection}>
          <Text style={styles.receiptTitle}>Receipt</Text>
          
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCellLeft, { flex: 0.3 }]}>#</Text>
              <Text style={[styles.tableHeaderCellLeft, { flex: 3.5 }]}>Particular</Text>
              <Text style={[styles.tableHeaderCellRight, { flex: 1.2 }]}>Amount</Text>
            </View>
            
            {/* Table Rows */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellCenter, { flex: 0.3 }]}>1</Text>
              <Text style={[styles.tableCell, { flex: 3.5 }]}>Course Fee ({courseName})</Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { flex: 1.2 }]}>{totalFee.toLocaleString()}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellCenter, { flex: 0.3 }]}>2</Text>
              <Text style={[styles.tableCell, { flex: 3.5 }]}>Previous Received Amount</Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { flex: 1.2 }]}>{previousReceivedAmount.toLocaleString()}</Text>
            </View>
            
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellCenter, { flex: 0.3 }]}>3</Text>
              <Text style={[styles.tableCell, { flex: 3.5 }]}>Amount Received</Text>
              <Text style={[styles.tableCell, styles.tableCellRight, { flex: 1.2 }]}>{amount.toLocaleString()}</Text>
            </View>
            
            {/* Summary Rows */}
            <View style={[styles.tableRow, { backgroundColor: '#F9FAFB' }]}>
              <Text style={[styles.tableCell, styles.tableCellCenter, styles.tableCellBold, { flex: 0.3 }]}>-</Text>
              <Text style={[styles.tableCell, styles.tableCellBold, { flex: 3.5 }]}>Total Received Amount</Text>
              <Text style={[styles.tableCell, styles.tableCellRight, styles.tableCellBold, { flex: 1.2 }]}>{totalReceivedAmount.toLocaleString()}</Text>
            </View>
            
            <View style={[styles.tableRow, { backgroundColor: '#FEF2F2' }]}>
              <Text style={[styles.tableCell, styles.tableCellCenter, styles.tableCellBold, { flex: 0.3 }]}>-</Text>
              <Text style={[styles.tableCell, styles.tableCellBold, { flex: 3.5 }]}>Dues Amount</Text>
              <Text style={[styles.tableCell, styles.tableCellRight, styles.tableCellBold, { flex: 1.2 }]}>{duesAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Received Amount in Word :</Text>
            <Text style={styles.footerValue}>({amountInWords})</Text>
            
          </View>
          
          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>Mode of Payment :</Text>
            <Text style={styles.footerValue}>{paymentMode}</Text>
          </View>
          
          {transactionId && (
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Transaction ID :</Text>
              <Text style={styles.footerValue}>{transactionId}</Text>
            </View>
          )}
          
          {remarks && (
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Remarks :</Text>
              <Text style={styles.footerValue}>{remarks}</Text>
            </View>
          )}
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature of Student/Parent</Text>
          </View>
          
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature of Authority</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FeeReceiptPDF;
