import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

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
    padding: 15,
    fontFamily: 'Montserrat',
    position: 'relative',
  },
  
  // Header Styles
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottom: '1px solid #000000',
    paddingBottom: 8,
    position: 'relative',
    zIndex: 1,
  },
  
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    flexShrink: 0,
  },
  
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
    letterSpacing: 1,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'normal',
    fontFamily: 'Montserrat',
    textAlign: 'center',
    marginBottom: 4,
    marginTop: 2,
  },
  
  tagline: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  
  phoneText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  
  // Watermark
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 200,
    color: '#f3f4f6',
    fontWeight: 700,
    zIndex: 0,
    opacity: 0.05,
  },
  
  // Background Logo Watermark
  backgroundLogo: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    height: 300,
    opacity: 0.3,
    zIndex: 0,
  },
  
  // Receipt Title
  receiptTitle: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 4,
    marginBottom: 8,
    position: 'relative',
    zIndex: 1,
  },
  
  receiptTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  
  // Main Content Layout
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    border: '1px solid #000000',
    position: 'relative',
    zIndex: 1,
    marginBottom: 8,
  },
  
  leftColumn: {
    flex: 1,
    borderRight: '1px solid #000000',
    padding: 8,
    minHeight: 200,
  },
  
  rightColumn: {
    width: 250,
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Student Details Title
  studentDetailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    textDecoration: 'underline',
    fontFamily: 'Montserrat',
  },
  
  // Detail Rows
  detailRow: {
    marginBottom: 4,
  },
  
  detailText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  
  // Info Boxes for Right Column
  infoBox: {
    borderBottom: '1px solid #000000',
    padding: 6,
  },
  
  infoBoxAlt: {
    borderBottom: '1px solid #000000',
    padding: 6,
    backgroundColor: '#f5f5f5',
  },
  
  infoBoxLast: {
    padding: 6,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  
  infoText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  
  // Fee Receipt Table
  feeReceiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#000000',
    fontFamily: 'Montserrat',
  },
  
  feeTable: {
    border: '1px solid #000000',
    marginBottom: 8,
  },
  
  feeTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingVertical: 4,
  },
  
  feeTableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  
  feeTableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000000',
    // paddingVertical: 4,
    minHeight: 20,
  },
  
  feeTableCell: {
    fontSize: 10,
    color: '#000000',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 2,
    borderRight: '1px solid #000000',
    paddingVertical: 2,
  },
  feeTableCellLeft: {
    fontSize: 10,
    color: '#000000',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingHorizontal: 2,
    borderRight: '1px solid #000000',
    paddingVertical: 2,
  },
  feeTableCellRight: {
    fontSize: 10,
    color: '#000000',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    textAlign: 'right',
    paddingHorizontal: 2,
    borderRight: '1px solid #000000',
    paddingVertical: 2,
  },
  
  
  feeTableCellAmount: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  
  // Payment Summary
  paymentSummary: {
    marginTop: 8,
    padding: 8,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  
  summaryLabel: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  
  summaryValue: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 5,
    borderTop: '1px solid #000000',
  },
  
  totalLabel: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  
  totalValue: {
    fontSize: 10,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  
  // Signature Section
  signatures: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    position: 'relative',
    zIndex: 1,
  },
  
  signatureBox: {
    textAlign: 'center',
  },
  
  signatureLine: {
    borderBottom: '1px dotted #000000',
    paddingBottom: 4,
    minWidth: 200,
    display: 'inline-block',
    height: 10,
  },
  
  signatureLabel: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
    marginTop: 4,
    fontFamily: 'Montserrat',
  },
});

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

// Helper function to format currency
const formatCurrency = (amount) => {
  return `${amount?.toFixed(2) || '0.00'}`;
};

// Main PDF Component
const FeeCollectReceipt = ({ data }) => {
  const {
    student,
    feeGroup,
    paymentData
  } = data;

  // Calculate current date
  const receiptDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Generate receipt number
  const receiptNo = `TBREC${Date.now().toString().slice(-6)}`;

  // Calculate totals
  const totalAmount = feeGroup?.amount || 0;
  const totalPaid = feeGroup?.paid || 0;
  const totalDiscount = feeGroup?.discount || 0;
  const totalFine = feeGroup?.fine || 0;
  const balance = feeGroup?.balance || 0;

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
          <View>
            <Image 
              style={styles.logo} 
              src="/logo.png" 
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>TARGET BOARD</Text>
            <Text style={styles.subtitle}>TARGET BOARD JEHANABAD 804408</Text>
            <Text style={styles.tagline}>Bihar Board NO-1 Educational Platform</Text>
            <Text style={styles.phoneText}>+91 7779855339</Text>
          </View>
        </View>

        {/* Receipt Title */}
        <View style={styles.receiptTitle}>
          <Text style={styles.receiptTitleText}>FEE RECEIPT</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Left Column - Student Details */}
          <View style={styles.leftColumn}>
            <Text style={styles.studentDetailsTitle}>Student Details:</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>{student?.studentName || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>
                <Text style={{ fontWeight: 'bold' }}>F. Name-</Text> {student?.fathersName || 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>
                <Text style={{ fontWeight: 'bold' }}>Address :</Text> {student?.presentAddress?.fullAddress || 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>
                <Text style={{ fontWeight: 'bold' }}>Class :</Text> {student?.className || 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>
                <Text style={{ fontWeight: 'bold' }}>Course :</Text> {feeGroup?.name || 'N/A'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>
                <Text style={{ fontWeight: 'bold' }}>Batch :</Text> {student?.batchName || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Right Column - Receipt Details */}
          <View style={styles.rightColumn}>
            <View style={styles.infoBoxAlt}>
              <Text style={styles.infoText}>Receipt No : {receiptNo}</Text>
            </View>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Date : {receiptDate}</Text>
            </View>
            
            <View style={styles.infoBoxAlt}>
              <Text style={styles.infoText}>Admission No : {student?.registrationNo || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Next Due Date : {receiptDate}</Text>
            </View>
          </View>
        </View>

        {/* Fee Receipt Table */}
        <Text style={styles.feeReceiptTitle}>FEE RECEIPT</Text>
        
        <View style={styles.feeTable}>
          {/* Table Header */}
          <View style={styles.feeTableHeader}>
            <Text style={[styles.feeTableHeaderText, { flex: 1 }]}>Sl. no.</Text>
            <Text style={[styles.feeTableHeaderText, { flex: 3 }]}>Particular</Text>
            <Text style={[styles.feeTableHeaderText, { flex: 1 }]}>Amount</Text>
          </View>
          
          {/* Fee Items */}
          <View style={styles.feeTableRow}>
            <Text style={[styles.feeTableCell, { flex: 1 }]}>1.</Text>
            <Text style={[styles.feeTableCellLeft, { flex: 3 }]}>Course Fee (CLASS 11TH BATCH 2025-26)</Text>
            <Text style={[styles.feeTableCellAmount, { flex: 1 }]}>₹{totalAmount}</Text>
          </View>
          
          <View style={styles.feeTableRow}>
            <Text style={[styles.feeTableCell, { flex: 1 }]}>2.</Text>
            <Text style={[styles.feeTableCellLeft, { flex: 3 }]}>Previous Recieved Amount</Text>
            <Text style={[styles.feeTableCellAmount, { flex: 1 }]}>₹{totalPaid}</Text>
          </View>
          
          <View style={styles.feeTableRow}>
            <Text style={[styles.feeTableCell, { flex: 1 }]}>3.</Text>
            <Text style={[styles.feeTableCellLeft, { flex: 3 }]}>Amount Recieved</Text>
            <Text style={[styles.feeTableCellAmount, { flex: 1 }]}>₹{totalPaid}</Text>
          </View>
          
          <View style={styles.feeTableRow}>
            <Text style={[styles.feeTableCell, { flex: 1 }]}></Text>
            <Text style={[styles.feeTableCellRight, { flex: 3, fontWeight: 'bold' }]}>Total Received Amount</Text>
            <Text style={[styles.feeTableCellAmount, { flex: 1 }]}>₹{totalPaid}</Text>
          </View>
          
          <View style={styles.feeTableRow}>
            <Text style={[styles.feeTableCell, { flex: 1 }]}></Text>
            <Text style={[styles.feeTableCellRight, { flex: 3, fontWeight: 'bold' }]}>Dues Amount</Text>
            <Text style={[styles.feeTableCellAmount, { flex: 1 }]}>₹{balance}</Text>
          </View>
        </View>

        {/* Payment Information */}
        <View style={styles.paymentSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Received Amount in Word: (Two Thousand Rupees Only)</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Mode of Payment: Cash</Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature of Authority</Text>
          </View>
          
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature of Student/Parent</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FeeCollectReceipt;
