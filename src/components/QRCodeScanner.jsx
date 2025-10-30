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
import successSoundUrl from '../assets/sounds/scan.mp3';
import errorSoundUrl from '../assets/sounds/failure.wav';

const QRCodeScanner = ({ open, onClose, onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const askedPermissionRef = useRef(false);
  const restartCamera = async () => {
    try {
      if (qrScannerRef.current) {
        try {
          await qrScannerRef.current.start();
          setIsScanning(true);
          setHasPermission(true);
          return;
        } catch {}
        try { await qrScannerRef.current.stop(); } catch {}
        try { qrScannerRef.current.destroy(); } catch {}
        qrScannerRef.current = null;
      }
    } catch {}
    await startCamera();
  };

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
        console.error('Video element not found');
        return;
      }

      // Check if QR scanner is supported
      const hasCam = await QrScanner.hasCamera();
      if (!hasCam) {
        setError('No camera found on this device');
        return;
      }

      // If an instance already exists, try restarting it to avoid permission prompts
      if (qrScannerRef.current) {
        try {
          await qrScannerRef.current.start();
          setIsScanning(true);
          setHasPermission(true);
          return;
        } catch (e) {
          console.warn('Restart existing scanner failed, will recreate', e);
          try { await qrScannerRef.current.stop(); } catch {}
          try { qrScannerRef.current.destroy(); } catch {}
          qrScannerRef.current = null;
        }
      }

      if (!askedPermissionRef.current) {
        askedPermissionRef.current = true;
      }

      // Create QR scanner instance (prefer rear camera)
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        handleQRCodeDetected,
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
          returnDetailedScanResult: false,
          onDecodeError: (err) => {
            const msg = String(err || '');
            console.warn('Scanner error:', msg);
            // Ignore typical "No QR code found" noise; ensure scanner remains active
            if (msg.toLowerCase().includes('no qr code found')) {
              if (!isScanning) setIsScanning(true);
              return;
            }
            // For other errors, try a soft restart of camera
            restartCamera();
          }
        }
      );
      try { qrScannerRef.current.setInversionMode && qrScannerRef.current.setInversionMode('both'); } catch {}

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
      setIsScanning(true);
      setHasPermission(true);
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message || 'Failed to access camera');
      setHasPermission(false);
    }
  };

  // Parse QR data to extract student information
  const parseQRData = (qrData) => {
    try {
      // Handle both string and object formats
      let dataString;
      if (typeof qrData === 'string') {
        dataString = qrData;
      } else if (qrData && typeof qrData === 'object' && qrData.data) {
        dataString = qrData.data;
      } else {
        console.error('Unexpected QR data format:', qrData);
        return null;
      }

      const lines = dataString.split('\n');
      const studentData = {};
      
      lines.forEach(line => {
        if (line.includes('Name:')) {
          studentData.name = line.split('Name:')[1].trim();
        } else if (line.includes('ID:')) {
          studentData.studentId = line.split('ID:')[1].trim();
        } else if (line.includes('Contact:')) {
          studentData.contact = line.split('Contact:')[1].trim();
        } else if (line.includes('Course:')) {
          studentData.course = line.split('Course:')[1].trim();
        }
      });
      
      return studentData;
    } catch (error) {
      console.error('Error parsing QR data:', error);
      return null;
    }
  };

  const handleQRCodeDetected = async (qrData) => {
    // This function will be called when a real QR code is detected
    console.log('QR Code detected:', qrData);
    
    // Parse the QR data
    const parsedData = parseQRData(qrData);
    // Do not set scanResult here to avoid showing success UI; we'll only close on actual success

    setIsScanning(false);
    
    // Stop the QR scanner
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }

    // Check if QR data could be parsed
    if (!parsedData) {
      console.error('Failed to parse QR data');
      const errorMsg = 'Invalid QR code format. Please scan a valid student QR code.';
      if (onScanError) {
        onScanError(errorMsg);
      }
      return;
    }

    // Get staff ID from localStorage
    const staffData = JSON.parse(localStorage.getItem('staffData') || '{}');
    const staffId = staffData._id;
    
    if (!staffId) {
      console.error('Staff ID not found in localStorage');
      const errorMsg = 'Staff ID not found. Please login again.';
      if (onScanError) {
        onScanError(errorMsg);
      }
      return;
    }

    // Extract student ID from parsed data
    const studentId = parsedData?.studentId || parsedData?.id;
    
    if (!studentId) {
      console.error('Student ID not found in QR data');
      const errorMsg = 'Student ID not found in QR code data';
      if (onScanError) {
        onScanError(errorMsg);
      }
      return;
    }

    // Call attendance API directly
    try {
      const response = await fetch('https://seashell-app-vgu3a.ondigitalocean.app/api/v1/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrCodeData: studentId,
          staffId: staffId
        })
      });

      const apiResponse = await response.json();

      if (response.ok) {
        console.log('Attendance marked successfully:', apiResponse);
        // Play success sound
        try {
          const audio = new Audio(successSoundUrl);
          audio.volume = 0.5;
          audio.play().catch(error => {
            console.log('Could not play success sound:', error);
          });
        } catch (error) {
          console.log('Success sound not available:', error);
        }
        
        // Show success message
        if (onScanSuccess) {
          onScanSuccess({
            success: true,
            message: 'Attendance marked successfully!',
            studentData: parsedData,
            apiResponse: apiResponse
          });
        }
        // Immediately resume scanning for the next code without closing the modal
        setScanResult(null);
        await startCamera();
      } else {
        console.error('API Error:', apiResponse);
        // Play failure sound
        try {
          const audio = new Audio(errorSoundUrl);
          audio.volume = 0.5;
          audio.play().catch(error => {
            console.log('Could not play failure sound:', error);
          });
        } catch (error) {
          console.log('Failure sound not available:', error);
        }
        
        // Show error message
        if (onScanSuccess) {
          onScanSuccess({
            success: false,
            message: apiResponse.message || 'Failed to mark attendance',
            studentData: parsedData,
            error: apiResponse
          });
        }

        // Resume scanning automatically after a failed attempt
        setScanResult(null);
        await startCamera();
      }
    } catch (apiError) {
      console.error('Network Error:', apiError);
      // Play failure sound for network errors
      try {
        const audio = new Audio(errorSoundUrl);
        audio.volume = 0.5;
        audio.play().catch(error => {
          console.log('Could not play failure sound:', error);
        });
      } catch (error) {
        console.log('Failure sound not available:', error);
      }
      
      // Show network error message
      if (onScanSuccess) {
        onScanSuccess({
          success: false,
          message: 'Failed to connect to server. Please try again.',
          studentData: parsedData,
          error: apiError
        });
      }

      // Resume scanning automatically after network error
      setScanResult(null);
      await startCamera();
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          maxHeight: '90vh',
          margin: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontWeight: 600
      }}>
        <Typography variant="h6" component="span">
          QR Code Scanner
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: 'relative', minHeight: 250, backgroundColor: 'transparent' }}>
          {/* Camera feed (always mounted so ref is available before start) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '8px',
              // Keep camera visible whenever permission is granted and we haven't completed a scan
              display: hasPermission && !scanResult ? 'block' : 'none'
            }}
          />

          {/* Scanning Overlay */}
          {hasPermission && isScanning && !scanResult && !error && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 220,
                height: 220,
                border: '3px solid #667eea',
                borderRadius: 2,
                pointerEvents: 'none',
                zIndex: 10,
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
          )}

          {/* Permission Check */}
          {hasPermission === null && !error && (
            <Box
              sx={{
                width: '100%',
                height: 250,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(45deg, #1a1a1a 25%, #2a2a2a 25%, #2a2a2a 50%, #1a1a1a 50%, #1a1a1a 75%, #2a2a2a 75%)',
                backgroundSize: '20px 20px',
                borderRadius: 2
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
                  Please wait while we initialize the camera
                </Typography>
              </Box>
            </Box>
          )}

          {/* Success State */}
          {scanResult && (
            <Box
              sx={{
                width: '100%',
                height: 250,
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
                width: '100%',
                height: 250,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Show message over the live camera instead of hiding it
                background: 'transparent',
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
         <Box sx={{ p: 2, backgroundColor: '#f8fafc' }}>
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
      </DialogContent>

       <DialogActions sx={{ p: 2, backgroundColor: '#f8fafc' }}>
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