import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 12,
    borderBottom: '2px solid #1976d2',
    paddingBottom: 8,
  },
  
  logo: {
    width: 45,
    height: 45,
    marginBottom: 6,
    borderRadius: 22,
  },
  
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  subtitle: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 1,
    fontWeight: 'bold',
  },
  
  contact: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 3,
  },
  
  // Receipt Title
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1976d2',
    textTransform: 'uppercase',
  },
  
  // Main Content Layout
  mainContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  
  leftColumn: {
    flex: 1,
    marginRight: 15,
  },
  
  rightColumn: {
    flex: 1,
  },
  
  // Student Photo Section
  photoSection: {
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: '80px',
  },
  
  studentPhoto: {
    width: 120,
    height: 120,
    border: '1px solid #000000',
    borderRadius: 4,
    marginBottom: 6,
  },
  
  // Detail Rows
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  
  detailLabel: {
    fontSize: 9,
    color: '#374151',
    width: 120,
    fontWeight: 'bold',
  },
  
  detailValue: {
    fontSize: 9,
    color: '#1976d2',
    fontWeight: 'bold',
    flex: 1,
  },
  
  // Fee Details Section
  feeDetailsSection: {
    marginTop: 15,
    padding: 10,
    border: '1px solid #E5E7EB',
    borderRadius: 4,
  },
  
  feeDetailsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 6,
    textAlign: 'center',
  },
  
  feeTable: {
    marginBottom: 10,
  },
  
  feeTableRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingVertical: 2,
  },
  
  feeTableHeader: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingVertical: 3,
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #E5E7EB',
  },
  
  feeTableHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
  },
  
  feeTableCell: {
    fontSize: 8,
    color: '#374151',
  },
  
  feeTableCellAmount: {
    fontSize: 8,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  
  // Payment Summary
  paymentSummary: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f9f9f9',
    border: '1px solid #E5E7EB',
    borderRadius: 4,
  },
  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  
  summaryLabel: {
    fontSize: 9,
    color: '#374151',
    fontWeight: 'bold',
  },
  
  summaryValue: {
    fontSize: 9,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 5,
    borderTop: '1px solid #E5E7EB',
  },
  
  totalLabel: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  
  totalValue: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  
  // Signature Section
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  
  signatureBox: {
    width: 120,
    textAlign: 'center',
  },
  
  signatureLine: {
    borderBottom: '1px solid #374151',
    marginBottom: 3,
    height: 15,
  },
  
  signatureLabel: {
    fontSize: 7,
    color: '#374151',
  },
  
  // Watermark
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 80,
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
    width: 200,
    height: 200,
    opacity: 0.05,
    zIndex: -1,
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
          <Image 
            style={styles.logo} 
            src="/logo.png" 
          />
          <Text style={styles.title}>TARGET BOARD</Text>
          <Text style={styles.subtitle}>TARGET BOARD JEHANABAD 804408</Text>
          <Text style={styles.subtitle}>Bihar Board NO-1 Educational Platform</Text>
          <Text style={styles.contact}>P.H No. -7779855339</Text>
        </View>

        {/* Receipt Title */}
        <Text style={styles.receiptTitle}>Fee Collection Receipt</Text>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Left Column - Student Photo and Basic Info */}
          <View style={styles.leftColumn}>
            {/* Student Photo */}
            <View style={styles.photoSection}>
              {student?.image && student.image.trim() !== '' ? (
                <Image 
                  style={styles.studentPhoto} 
                  src={student.image}
                  cache={false}
                />
              ) : (
                <View style={[styles.studentPhoto, { backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ fontSize: 16, color: '#1976d2', fontWeight: 'bold' }}>
                    {student?.studentName?.charAt(0)?.toUpperCase() || 'S'}
                  </Text>
                </View>
              )}
            </View>

            {/* Student Details */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name :</Text>
              <Text style={styles.detailValue}>{student?.studentName || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Father's Name :</Text>
              <Text style={styles.detailValue}>{student?.fathersName || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Registration No. :</Text>
              <Text style={styles.detailValue}>{student?.registrationNo || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Class :</Text>
              <Text style={styles.detailValue}>{student?.className || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile No. :</Text>
              <Text style={styles.detailValue}>{student?.mobileNumber || 'N/A'}</Text>
            </View>
          </View>

          {/* Right Column - Fee Details */}
          <View style={styles.rightColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Receipt No. :</Text>
              <Text style={styles.detailValue}>{receiptNo}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Receipt Date :</Text>
              <Text style={styles.detailValue}>{receiptDate}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Course :</Text>
              <Text style={styles.detailValue}>{feeGroup?.name || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Mode :</Text>
              <Text style={styles.detailValue}>{paymentData?.paymentMode || 'Cash'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID :</Text>
              <Text style={styles.detailValue}>{paymentData?.transactionId || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Fee Details Section */}
        <View style={styles.feeDetailsSection}>
          <Text style={styles.feeDetailsTitle}>Fee Details</Text>
          
          {/* Fee Table */}
          <View style={styles.feeTable}>
            {/* Table Header */}
            <View style={styles.feeTableHeader}>
              <Text style={[styles.feeTableHeaderText, { flex: 2 }]}>Description</Text>
              <Text style={[styles.feeTableHeaderText, { flex: 1, textAlign: 'right' }]}>Amount</Text>
            </View>
            
            {/* Fee Items */}
            <View style={styles.feeTableRow}>
              <Text style={[styles.feeTableCell, { flex: 2 }]}>Course Fee</Text>
              <Text style={[styles.feeTableCellAmount, { flex: 1, textAlign: 'right' }]}>{formatCurrency(totalAmount)}</Text>
            </View>
            
            {totalDiscount > 0 && (
              <View style={styles.feeTableRow}>
                <Text style={[styles.feeTableCell, { flex: 2 }]}>Discount</Text>
                <Text style={[styles.feeTableCellAmount, { flex: 1, textAlign: 'right', color: '#4caf50' }]}>-{formatCurrency(totalDiscount)}</Text>
              </View>
            )}
            
            {totalFine > 0 && (
              <View style={styles.feeTableRow}>
                <Text style={[styles.feeTableCell, { flex: 2 }]}>Fine</Text>
                <Text style={[styles.feeTableCellAmount, { flex: 1, textAlign: 'right', color: '#f44336' }]}>+{formatCurrency(totalFine)}</Text>
              </View>
            )}
          </View>

          {/* Payment Summary */}
          <View style={styles.paymentSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Fee:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalAmount)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Paid:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalPaid)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Discount:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalDiscount)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Fine:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalFine)}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Balance Amount:</Text>
              <Text style={styles.totalValue}>{formatCurrency(balance)}</Text>
            </View>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatureRow}>
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

export default FeeCollectReceipt;
