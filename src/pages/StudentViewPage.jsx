import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import AdmissionReceiptDisplay from '../components/AdmissionReceiptDisplay';

const StudentViewPage = ({ student: propStudent, onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(propStudent || null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchStudent = async () => {
      if (!id || propStudent) return;
      try {
        setLoading(true);
        const res = await fetch(`https://seashell-app-vgu3a.ondigitalocean.app/api/v1/students/${id}`);
        const data = await res.json();
        if (data?.success && data?.data) {
          setStudent(data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, propStudent]);

  const handleBack = () => {
    if (onBack) return onBack();
    navigate(-1);
  };


  const handleDownloadAdmissionReceipt = async () => {
    try {
      // Import the PDF generation function
      const { pdf } = await import('@react-pdf/renderer');
      const AdmissionReceiptPDF = (await import('../components/AdmissionReceiptPDF')).default;

      // Generate PDF blob
      const blob = await pdf(<AdmissionReceiptPDF data={student} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Admission_Receipt_${student.studentName || student.registrationNo || 'Student'}.pdf`;

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
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        p: 4,
        mb: 4,
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, position: 'relative', zIndex: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              color: 'white',
              minWidth: 'auto',
              borderRadius: '50%',
              width: 48,
              height: 48,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Box sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PersonIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '0.5px', mb: 0.5 }}>
                Admission Receipt
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95, fontWeight: 400 }}>
                {student ? `${student.studentName || 'Student'} - ${student.registrationNo || 'N/A'}` : 'View admission receipt'}
              </Typography>
            </Box>
          </Box>
          {student && (
            <Button
              startIcon={<PdfIcon />}
              onClick={handleDownloadAdmissionReceipt}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '25px',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease-in-out',
                fontWeight: 600
              }}
            >
              Download Admission Receipt
            </Button>
          )}
        </Box>
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
        {loading || !student ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <Box sx={{
            width: '240mm', // A4 width
            minHeight: '297mm', // A4 height
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            border: '0px solid #1976d2',
            display: 'flex',
            px: 2,
            flexDirection: 'column'
          }}>
            {/* Receipt Content */}
            <Box sx={{ flex: 1 }}>
              <AdmissionReceiptDisplay data={student} />
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
                onClick={handleDownloadAdmissionReceipt}
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
        )}
      </Box>
    </Box>
  );
};

export default StudentViewPage;
