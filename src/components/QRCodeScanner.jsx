import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  QrCodeScanner as QrCodeIcon,
  Close as CloseIcon,
  CameraAlt as CameraIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import QrScanner from 'qr-scanner';

const QRCodeScanner = ({ open, onClose, onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    if (open) {
      // Small delay to ensure video element is rendered
      const timer = setTimeout(() => {
        startCamera();
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      stopScanning();
    }
  }, [open]);

  // Additional effect to handle video element mounting
  useEffect(() => {
    if (open && videoRef.current && !qrScannerRef.current) {
      startCamera();
    }
  }, [open, videoRef.current]);

  const startCamera = async () => {
    try {
      setError(null);
      setScanResult(null);
      
      // Wait a bit for the video element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!videoRef.current) {
        setError('Video element not found');
        return;
      }

      // Check if QR scanner is supported
      if (!QrScanner.hasCamera()) {
        setError('No camera found on this device');
        setHasPermission(false);
        return;
      }

      // Create QR scanner instance
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result);
          handleQRCodeDetected(result.data);
        },
        {
          onDecodeError: (err) => {
            // Ignore decode errors - they're normal during scanning
            console.log('QR decode error (normal):', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      // Show the video element when scanning starts
      if (videoRef.current) {
        videoRef.current.style.display = 'block';
        videoRef.current.style.width = '100%';
        videoRef.current.style.height = '100%';
        videoRef.current.style.objectFit = 'cover';
        videoRef.current.style.borderRadius = '8px';
      }

      // Start scanning
      await qrScannerRef.current.start();
      setHasPermission(true);
      setIsScanning(true);
      
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera permissions and try again.');
      setHasPermission(false);
      setIsScanning(false);
      
      if (onScanError) {
        onScanError(err);
      }
    }
  };

  const parseQRData = (qrData) => {
    try {
      // Parse the QR data text
      const lines = qrData.split('\n');
      const studentData = {};
      
      lines.forEach(line => {
        if (line.includes('Name:')) {
          studentData.name = line.replace('Name:', '').trim();
        } else if (line.includes('ID:')) {
          studentData.studentId = line.replace('ID:', '').trim();
        } else if (line.includes('Contact:')) {
          studentData.contact = line.replace('Contact:', '').trim();
        } else if (line.includes('Course:')) {
          studentData.course = line.replace('Course:', '').trim();
        }
      });
      
      // Add timestamp
      studentData.scannedAt = new Date().toISOString();
      studentData.status = 'present';
      
      return studentData;
    } catch (error) {
      console.error('Error parsing QR data:', error);
      return null;
    }
  };

  const handleQRCodeDetected = (qrData) => {
    // This function will be called when a real QR code is detected
    console.log('QR Code detected:', qrData);
    
    // Parse the QR data
    const parsedData = parseQRData(qrData);
    if (parsedData) {
      setScanResult(JSON.stringify(parsedData));
    } else {
      setScanResult(qrData);
    }
    
    setIsScanning(false);
    
    // Stop the QR scanner
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
    
    if (onScanSuccess) {
      onScanSuccess(parsedData ? JSON.stringify(parsedData) : qrData);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanResult(null);
    setError(null);
    setHasPermission(null);
    setIsProcessing(false);
    
    // Stop QR scanner
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    
    // Hide video element
    if (videoRef.current) {
      videoRef.current.style.display = 'none';
    }
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  const handleManualScan = () => {
    // This function is no longer needed since real QR scanning is working
    console.log('Manual scan not needed - real QR scanning is active');
  };


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          QR Code Scanner
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Hidden video element for QR scanner */}
        <video
          ref={videoRef}
          style={{ display: 'none' }}
        />
        
        <Box sx={{ position: 'relative', minHeight: 400 }}>
          {/* Camera View Area */}
          <Box
            sx={{
              width: '100%',
              height: 400,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              backgroundColor: '#000'
            }}
          >
            {/* Real Camera Feed */}
            {hasPermission && isScanning && !scanResult && !error && (
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Camera feed will be displayed by QR scanner */}
                
                {/* Scanning Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 200,
                    height: 200,
                    border: '3px solid #667eea',
                    borderRadius: 2,
                    pointerEvents: 'none',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -3,
                      left: -3,
                      right: -3,
                      bottom: -3,
                      border: '2px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: 2,
                      animation: 'pulse 2s infinite'
                    }
                  }}
                />

                {/* QR Scanner will automatically detect QR codes */}
              </Box>
            )}

            {/* Permission Check */}
            {hasPermission === null && !error && (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(45deg, #1a1a1a 25%, #2a2a2a 25%, #2a2a2a 50%, #1a1a1a 50%, #1a1a1a 75%, #2a2a2a 75%)',
                  backgroundSize: '20px 20px'
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 2,
                    p: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <CircularProgress size={40} sx={{ color: '#667eea', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, mb: 1 }}>
                    Starting Camera...
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Please allow camera permissions to scan QR codes
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Success State */}
            {scanResult && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 2
                }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, mb: 1 }}>
                    QR Code Detected!
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    Student data has been successfully scanned
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Error State */}
            {error && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 2
                }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <ErrorIcon sx={{ fontSize: 48, color: '#ef4444', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, mb: 1 }}>
                    Camera Error
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                    {error}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={startCamera}
                    startIcon={<CameraIcon />}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        borderColor: '#5a67d8',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                  >
                    Retry
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Instructions */}
          <Box sx={{ p: 3, backgroundColor: '#f8fafc' }}>
            <Typography variant="body2" sx={{ color: '#6b7280', textAlign: 'center' }}>
              {hasPermission === null 
                ? 'Starting camera...'
                : hasPermission && isScanning 
                  ? 'Point camera at QR code - scanning automatically'
                  : scanResult 
                    ? 'QR code successfully scanned!'
                    : error
                      ? 'Camera access denied. Please check permissions.'
                      : 'Camera ready for QR code scanning'
              }
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#f8fafc' }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: '#6b7280',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#374151',
              backgroundColor: 'rgba(55, 65, 81, 0.1)'
            }
          }}
        >
          Cancel
        </Button>
        
        {hasPermission === false && (
          <Button
            onClick={startCamera}
            variant="contained"
            startIcon={<CameraIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
              }
            }}
          >
            Grant Permission
          </Button>
        )}

        {scanResult && (
          <Button
            onClick={() => {
              handleClose();
              if (onScanSuccess) {
                onScanSuccess(scanResult);
              }
            }}
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              }
            }}
          >
            Process Data
          </Button>
        )}
      </DialogActions>

      {/* CSS animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </Dialog>
  );
};

export default QRCodeScanner;
