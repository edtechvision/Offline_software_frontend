import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: '2px solid #1976d2',
    paddingBottom: 15,
  },
  
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
    borderRadius: 30,
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  
  subtitle: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  
  contact: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },
  
  // Receipt Title
  receiptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1976d2',
    textTransform: 'uppercase',
  },
  
  // Main Content Layout
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
  
  // Student Photo Section
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
    paddingRight: '100px',
  },
  
  studentPhoto: {
    width: 160,
    height: 160,
    border: '1px solid #1976d2',
    borderRadius: 4,
    marginBottom: 10,
  },
  
  // Detail Rows
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  
  detailLabel: {
    fontSize: 11,
    color: '#374151',
    width: 140,
    fontWeight: 'bold',
  },
  
  detailValue: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: 'bold',
    flex: 1,
  },
  
  // Declaration Section
  declarationSection: {
    marginTop: 30,
    padding: 15,
    border: '1px solid #E5E7EB',
    borderRadius: 4,
  },
  
  declarationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  declarationText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 15,
  },
  
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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

// Main PDF Component
const AdmissionReceiptPDF = ({ data }) => {
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
        <Text style={styles.receiptTitle}>Admission Receipt</Text>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Left Column - Student Photo and Basic Info */}
          <View style={styles.leftColumn}>
            {/* Student Photo */}
            <View style={styles.photoSection}>
              {image ? (
                <Image 
                  style={styles.studentPhoto} 
                  src={image} 
                />
              ) : (
                <View style={[styles.studentPhoto, { backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ fontSize: 24, color: '#1976d2', fontWeight: 'bold' }}>
                    {studentName?.charAt(0) || 'S'}
                  </Text>
                </View>
              )}
            </View>

            {/* Student Details */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name :</Text>
              <Text style={styles.detailValue}>{studentName || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Father's Name :</Text>
              <Text style={styles.detailValue}>{fathersName || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date of Birth :</Text>
              <Text style={styles.detailValue}>{formatDate(dateOfBirth)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gender :</Text>
              <Text style={styles.detailValue}>{gender || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile No. :</Text>
              <Text style={styles.detailValue}>{mobileNumber || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Permanent Address :</Text>
              <Text style={styles.detailValue}>{formatAddress(presentAddress)}</Text>
            </View>
          </View>

          {/* Right Column - Admission Details */}
          <View style={styles.rightColumn}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Admission No. :</Text>
              <Text style={styles.detailValue}>{admissionNo}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Admission Date :</Text>
              <Text style={styles.detailValue}>{admissionDate}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Class :</Text>
              <Text style={styles.detailValue}>{className || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Course :</Text>
              <Text style={styles.detailValue}>{courseDetails?.courseId?.name || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Batch :</Text>
              <Text style={styles.detailValue}>{courseDetails?.batchId?.batchName || 'N/A'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Session :</Text>
              <Text style={styles.detailValue}>{courseDetails?.session || new Date().getFullYear() + 1}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Admission Received By :</Text>
              <Text style={styles.detailValue}>{inchargeName || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Declaration Section */}
        <View style={styles.declarationSection}>
          <Text style={styles.declarationTitle}>Declaration</Text>
          <Text style={styles.declarationText}>
            I, Mr/Mrs ________________________ S/o or D/O ________________________ hereby declare that the information provided above is true, complete and accurate to the best of my knowledge. I agree to obey the rules and regulations of the institution. I understand that any false information provided by me can lead to cancellation of my admission without any refund. I also understand that failure to abide by the rules and regulations may result in disciplinary action against me.
          </Text>
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

export default AdmissionReceiptPDF;
