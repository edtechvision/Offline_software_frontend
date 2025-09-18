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
// Removed external QR scanner dependency - using mock implementation

const QRCodeScanner = ({ open, onClose, onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  // Mock QR code data for demonstration
  const mockQRData = {
    id: 'STU' + Date.now(),
    name: 'John Doe',
    fatherName: 'Robert Doe',
    studentId: 'STU' + Math.floor(Math.random() * 10000),
    class: '12th',
    course: 'Science',
    address: '123 Main Street, City',
    contactNo: '+91 9876543210',
    photoUrl: null,
    scannedAt: new Date().toISOString(),
    status: 'present'
  };

  useEffect(() => {
    if (open) {
      checkCameraPermission();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [open]);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      setIsScanning(true);
      setError(null);
      setScanResult(null);
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Camera permission denied:', err);
      setError('Camera access denied. Please allow camera permissions and try again.');
      setHasPermission(false);
      setIsScanning(false);
      
      if (onScanError) {
        onScanError(err);
      }
    }
  };

  const handleScan = (result) => {
    if (result && result.length > 0) {
      try {
        // Try to parse as JSON first
        const parsedResult = JSON.parse(result);
        setScanResult(result);
        setIsScanning(false);
        
        if (onScanSuccess) {
          onScanSuccess(result);
        }
      } catch (e) {
        // If not JSON, create a mock student data
        const mockResult = JSON.stringify({
          ...mockQRData,
          studentId: result || 'SCANNED_' + Date.now(),
          name: 'Scanned Student',
          scannedAt: new Date().toISOString()
        });
        
        setScanResult(mockResult);
        setIsScanning(false);
        
        if (onScanSuccess) {
          onScanSuccess(mockResult);
        }
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner error:', err);
    setError('Failed to scan QR code. Please try again.');
    setIsScanning(false);
    
    if (onScanError) {
      onScanError(err);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScanResult(null);
    setError(null);
    setHasPermission(null);
  };

  const handleClose = () => {
    stopScanning();
    onClose();
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
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          QR Code Scanner
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative', minHeight: 400 }}>
          {/* Camera View Area */}
          <Box
            sx={{
              width: '100%',
              height: 400,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2
            }}
          >
            {/* Mock QR Scanner with Camera Simulation */}
            {hasPermission && isScanning && !scanResult && !error && (
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                {/* Mock Camera Feed */}
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, #1a1a1a 25%, #2a2a2a 25%, #2a2a2a 50%, #1a1a1a 50%, #1a1a1a 75%, #2a2a2a 75%)',
                    backgroundSize: '20px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Mock QR Code Pattern */}
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      background: 'white',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        width: 20,
                        height: 20,
                        background: 'black'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        width: 20,
                        height: 20,
                        background: 'black'
                      }
                    }}
                  />
                </Box>
                
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

                {/* Mock Scan Button */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      // Simulate QR code detection
                      const mockQRData = {
                        id: 'STU' + Date.now(),
                        name: 'John Doe',
                        fatherName: 'Robert Doe',
                        studentId: 'STU' + Math.floor(Math.random() * 10000),
                        class: '12th',
                        course: 'Science',
                        address: '123 Main Street, City',
                        contactNo: '+91 9876543210',
                        photoUrl: null,
                        scannedAt: new Date().toISOString(),
                        status: 'present'
                      };
                      handleScan(JSON.stringify(mockQRData));
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
                      }
                    }}
                  >
                    Simulate QR Scan
                  </Button>
                </Box>
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
                  background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 2,
                    p: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <CircularProgress size={40} sx={{ color: '#667eea', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#374151', fontWeight: 600, mb: 1 }}>
                    Checking Camera Access...
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
                    Scan Failed
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                    {error}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={checkCameraPermission}
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
                ? 'Checking camera permissions...'
                : hasPermission && isScanning 
                  ? 'Click "Simulate QR Scan" to test the scanning functionality'
                  : scanResult 
                    ? 'QR code successfully scanned!'
                    : error
                      ? 'Camera access denied. Please check permissions.'
                      : 'Click "Start Scan" to begin scanning QR codes'
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
            onClick={checkCameraPermission}
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
