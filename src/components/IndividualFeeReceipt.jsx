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
    color: '#d32f2f',
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
  
  // Blue Banner
  blueBanner: {
    backgroundColor: '#1976d2',
    padding: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  bannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  bannerContact: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Copy Type
  copyType: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 15,
  },
  
  // Main Content Layout
  mainContent: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  
  leftColumn: {
    flex: 1,
    marginRight: 15,
  },
  
  rightColumn: {
    flex: 1,
  },
  
  // Detail Rows
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  
  detailLabel: {
    fontSize: 10,
    color: '#374151',
    width: 100,
    fontWeight: 'bold',
  },
  
  detailValue: {
    fontSize: 10,
    color: '#1976d2',
    fontWeight: 'bold',
    flex: 1,
  },
  
  // Payment Table
  paymentTable: {
    marginBottom: 15,
    border: '1px solid #E5E7EB',
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #E5E7EB',
  },
  
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#374151',
    padding: 6,
    borderRight: '1px solid #E5E7EB',
    textAlign: 'center',
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E7EB',
  },
  
  tableCell: {
    fontSize: 8,
    color: '#374151',
    padding: 6,
    borderRight: '1px solid #E5E7EB',
    textAlign: 'center',
  },
  
  tableCellAmount: {
    fontSize: 8,
    color: '#1976d2',
    fontWeight: 'bold',
    padding: 6,
    borderRight: '1px solid #E5E7EB',
    textAlign: 'center',
  },
  
  // Note Section
  noteSection: {
    marginBottom: 15,
  },
  
  noteLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 3,
  },
  
  noteText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.3,
  },
  
  // Signature Section
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  
  signatureBox: {
    width: 120,
    textAlign: 'center',
  },
  
  signatureLine: {
    borderBottom: '1px dashed #374151',
    marginBottom: 3,
    height: 15,
  },
  
  signatureLabel: {
    fontSize: 8,
    color: '#374151',
    fontWeight: 'bold',
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
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

// Helper function to format currency
const formatCurrency = (amount) => {
  return `${amount?.toFixed(2) || '0.00'}`;
};

// Main PDF Component
const IndividualFeeReceipt = ({ data }) => {
  const {
    student,
    payment,
    feeGroup,
    collectedBy
  } = data;

  // Calculate current date
  const receiptDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });

  // Generate payment ID
  const paymentId = payment?.receiptNo || `442/${Math.floor(Math.random() * 10) + 1}`;

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
          <Text style={styles.subtitle}>Near HP Petrol Pump, Main Road, Jehanabad</Text>
        </View>

        {/* Blue Banner */}
        <View style={styles.blueBanner}>
          <Text style={styles.bannerText}>BEST COACHING FOR BOARDS</Text>
          <Text style={styles.bannerContact}>Mob: 7070852272</Text>
        </View>

        {/* Copy Type */}
        <Text style={styles.copyType}>Office Copy</Text>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Left Column - Student Details */}
          <View style={styles.leftColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Student Name:</Text>
              <Text style={styles.detailValue}>{student?.studentName} ({student?.registrationNo})</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Father Name:</Text>
              <Text style={styles.detailValue}>{student?.fathersName}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Class:</Text>
              <Text style={styles.detailValue}>{student?.className} ({feeGroup?.name})</Text>
            </View>
          </View>

          {/* Right Column - Transaction Details */}
          <View style={styles.rightColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{receiptDate}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment ID:</Text>
              <Text style={styles.detailValue}>{paymentId}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Collected By:</Text>
              <Text style={styles.detailValue}>{collectedBy || 'Super Admin(9000)'}</Text>
            </View>
          </View>
        </View>

        {/* Payment Table */}
        <View style={styles.paymentTable}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Date</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Fees Group</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Fees Code</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Mode</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Amount</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Discount</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Fine</Text>
          </View>
          
          {/* Table Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{formatDate(payment?.paymentDate)}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{feeGroup?.name} ({feeGroup?.code})</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{feeGroup?.code}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{payment?.mode || 'Cash'}</Text>
            <Text style={[styles.tableCellAmount, { flex: 1 }]}>{formatCurrency(payment?.amount)}</Text>
            <Text style={[styles.tableCellAmount, { flex: 1 }]}>{formatCurrency(payment?.discount || 0)}</Text>
            <Text style={[styles.tableCellAmount, { flex: 1 }]}>{formatCurrency(payment?.fine || 0)}</Text>
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.noteSection}>
          <Text style={styles.noteLabel}>Note:</Text>
          <Text style={styles.noteText}>
            This receipt is computer generated hence no signature is required.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Authority Sign</Text>
          </View>
          
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Parents Sign</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default IndividualFeeReceipt;
