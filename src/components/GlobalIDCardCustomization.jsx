import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Preview as PreviewIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { HexColorPicker } from 'react-colorful';
import IDCard from './IDCard';

const GlobalIDCardCustomization = () => {
  const [showColorPicker, setShowColorPicker] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Global style settings
  const [globalStyles, setGlobalStyles] = useState({
    backgroundGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
    headerTextColor: '#033398',
    subHeaderTextColor: '#333333',
    nameTextColor: '#2E7D32',
    labelTextColor: '#033398',
    valueTextColor: '#333333',
    borderRadius: '16px',
    waveColor: '#4CAF50'
  });

  const [cardSize, setCardSize] = useState('medium');

  // Load saved global styles on component mount
  useEffect(() => {
    const savedStyles = localStorage.getItem('globalIDCardStyles');
    if (savedStyles) {
      try {
        setGlobalStyles(JSON.parse(savedStyles));
      } catch (error) {
        console.error('Error loading saved styles:', error);
      }
    }
  }, []);

  // Color picker options with initialization and defaults
  const colorOptions = [
    { key: 'headerTextColor', label: 'Header Text', color: globalStyles.headerTextColor, defaultColor: '#033398', description: 'TARGET BOARD text color' },
    { key: 'nameTextColor', label: 'Name Text', color: globalStyles.nameTextColor, defaultColor: '#2E7D32', description: 'Student name display color' },
    { key: 'labelTextColor', label: 'Label Text', color: globalStyles.labelTextColor, defaultColor: '#033398', description: 'Field labels color' },
    { key: 'valueTextColor', label: 'Value Text', color: globalStyles.valueTextColor, defaultColor: '#333333', description: 'Field values color' },
    { key: 'waveColor', label: 'Wave Accent', color: globalStyles.waveColor, defaultColor: '#4CAF50', description: 'Decorative wave pattern' },
    { key: 'subHeaderTextColor', label: 'Sub Header', color: globalStyles.subHeaderTextColor, defaultColor: '#333333', description: 'Address and contact info' }
  ];

  // Gradient presets
  const gradientPresets = [
    { name: 'Default Orange', value: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)' },
    { name: 'Blue Sky', value: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)' },
    { name: 'Green Nature', value: 'linear-gradient(135deg, #98FB98 0%, #32CD32 50%, #228B22 100%)' },
    { name: 'Purple Elegant', value: 'linear-gradient(135deg, #DDA0DD 0%, #9370DB 50%, #8A2BE2 100%)' },
    { name: 'Red Power', value: 'linear-gradient(135deg, #FFB6C1 0%, #FF6347 50%, #DC143C 100%)' },
    { name: 'Gold Professional', value: 'linear-gradient(135deg, #FFD700 0%, #B8860B 50%, #DAA520 100%)' },
    { name: 'Ocean Blue', value: 'linear-gradient(135deg, #0077BE 0%, #004B87 50%, #003366 100%)' }
  ];

  // Sample student data for preview
  const sampleStudent = {
    name: 'SAMPLE STUDENT',
    fatherName: 'SAMPLE FATHER',
    studentId: 'TB000000',
    class: '12th',
    course: 'Sample Course 2025-26',
    address: 'Sample Address, Sample District, Sample State - 000000',
    contactNo: '+91 0000000000',
    photoUrl: null
  };

  const handleStyleChange = (field, value) => {
    setGlobalStyles(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (field, color) => {
    setGlobalStyles(prev => ({
      ...prev,
      [field]: color
    }));
  };

  const saveGlobalStyles = () => {
    try {
      localStorage.setItem('globalIDCardStyles', JSON.stringify(globalStyles));
      localStorage.setItem('globalCardSize', cardSize);
      showSnackbar('Global ID card styles saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving styles:', error);
      showSnackbar('Error saving styles. Please try again.', 'error');
    }
  };

  const resetToDefaults = () => {
    const defaultStyles = {
      backgroundGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      headerTextColor: '#033398',
      subHeaderTextColor: '#333333',
      nameTextColor: '#2E7D32',
      labelTextColor: '#033398',
      valueTextColor: '#333333',
      borderRadius: '16px',
      waveColor: '#4CAF50'
    };
    setGlobalStyles(defaultStyles);
    setCardSize('medium');
    showSnackbar('Reset to default styles', 'info');
  };

  const applyToAllCards = () => {
    // This would trigger a global update to all student cards
    saveGlobalStyles();
    showSnackbar('Global styles applied to all ID cards!', 'success');
  };

  const showSnackbarMessage = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon />
          Global ID Card Customization
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Set default styling that will be applied to all student ID cards across the system
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Controls Panel */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>Customization Settings</Typography>

              {/* Card Size Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Default Card Size
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Card Size</InputLabel>
                  <Select
                    value={cardSize}
                    onChange={(e) => setCardSize(e.target.value)}
                    label="Card Size"
                  >
                    <MenuItem value="small">Small (350x500)</MenuItem>
                    <MenuItem value="medium">Medium (420x600)</MenuItem>
                    <MenuItem value="large">Large (500x725)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Background Gradients */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Background Gradient
                </Typography>
                <Grid container spacing={1}>
                  {gradientPresets.map((preset, index) => (
                    <Grid item key={index}>
                      <Chip
                        label={preset.name}
                        onClick={() => handleStyleChange('backgroundGradient', preset.value)}
                        variant={globalStyles.backgroundGradient === preset.value ? 'filled' : 'outlined'}
                        sx={{
                          background: globalStyles.backgroundGradient === preset.value ? preset.value : 'transparent',
                          color: globalStyles.backgroundGradient === preset.value ? '#fff' : 'inherit',
                          fontWeight: globalStyles.backgroundGradient === preset.value ? 600 : 400
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Color Customization */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Text Colors
                </Typography>
                <Grid container spacing={3}>
                  {colorOptions.map((option) => (
                    <Grid item xs={12} sm={6} md={6} key={option.key}>
                      <Box sx={{ 
                        p: 2, 
                        border: '1px solid #e0e0e0', 
                        borderRadius: 2,
                        position: 'relative',
                        '&:hover': {
                          borderColor: '#2196f3',
                          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.1)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <IconButton
                            onClick={() => setShowColorPicker(showColorPicker === option.key ? null : option.key)}
                            sx={{
                              width: 60,
                              height: 60,
                              backgroundColor: option.color,
                              border: '4px solid #fff',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              '&:hover': { 
                                border: '4px solid #2196f3',
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.3)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <PaletteIcon sx={{ color: 'white', fontSize: 24 }} />
                          </IconButton>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {option.label}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              {option.description}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              color: 'primary.main', 
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              display: 'block',
                              mt: 0.5
                            }}>
                              {option.color}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleColorChange(option.key, option.defaultColor)}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            Reset to Default
                          </Button>
                          <Button
                            size="small"
                            variant="text"
                            onClick={() => setShowColorPicker(showColorPicker === option.key ? null : option.key)}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {showColorPicker === option.key ? 'Close Picker' : 'Choose Color'}
                          </Button>
                        </Box>

                        {showColorPicker === option.key && (
                          <>
                            {/* Backdrop */}
                            <Box
                              sx={{ 
                                position: 'fixed', 
                                top: 0, 
                                left: 0, 
                                right: 0, 
                                bottom: 0,
                                zIndex: 999,
                                backgroundColor: 'rgba(0, 0, 0, 0.1)'
                              }}
                              onClick={() => setShowColorPicker(null)}
                            />
                            {/* Color Picker Dialog */}
                            <Box sx={{ 
                              position: 'fixed', 
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 1000, 
                              p: 3,
                              bgcolor: 'white',
                              borderRadius: 2,
                              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                              border: '1px solid #e0e0e0',
                              minWidth: 350,
                              maxWidth: '90vw',
                              maxHeight: '90vh',
                              overflow: 'auto'
                            }}>
                              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                Choose {option.label} Color
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                {option.description}
                              </Typography>
                              <HexColorPicker
                                color={option.color}
                                onChange={(color) => handleColorChange(option.key, color)}
                                style={{ width: '100%' }}
                              />
                              <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleColorChange(option.key, option.defaultColor)}
                                >
                                  Use Default
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={() => setShowColorPicker(null)}
                                >
                                  Apply Color
                                </Button>
                              </Box>
                              <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  Selected: <span style={{ fontFamily: 'monospace', color: option.color }}>{option.color}</span>
                                </Typography>
                              </Box>
                            </Box>
                          </>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Quick Color Presets */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Color Schemes
                </Typography>
                <Grid container spacing={2}>
                  {[
                    {
                      name: 'Professional Blue',
                      colors: {
                        headerTextColor: '#1565c0',
                        nameTextColor: '#0d47a1',
                        labelTextColor: '#033398',
                        valueTextColor: '#424242',
                        waveColor: '#42a5f5'
                      }
                    },
                    {
                      name: 'Nature Green',
                      colors: {
                        headerTextColor: '#2e7d32',
                        nameTextColor: '#1b5e20',
                        labelTextColor: '#388e3c',
                        valueTextColor: '#424242',
                        waveColor: '#66bb6a'
                      }
                    },
                    {
                      name: 'Elegant Purple',
                      colors: {
                        headerTextColor: '#7b1fa2',
                        nameTextColor: '#4a148c',
                        labelTextColor: '#8e24aa',
                        valueTextColor: '#424242',
                        waveColor: '#ba68c8'
                      }
                    },
                    {
                      name: 'Warm Orange',
                      colors: {
                        headerTextColor: '#ef6c00',
                        nameTextColor: '#e65100',
                        labelTextColor: '#f57c00',
                        valueTextColor: '#424242',
                        waveColor: '#ffb74d'
                      }
                    }
                  ].map((preset) => (
                    <Grid item xs={12} sm={6} md={3} key={preset.name}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                          setGlobalStyles(prev => ({
                            ...prev,
                            ...preset.colors
                          }));
                          showSnackbarMessage(`Applied ${preset.name} color scheme`, 'success');
                        }}
                        sx={{
                          p: 2,
                          height: 'auto',
                          flexDirection: 'column',
                          gap: 1,
                          textTransform: 'none'
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                          {Object.values(preset.colors).slice(0, 4).map((color, index) => (
                            <Box
                              key={index}
                              sx={{
                                width: 16,
                                height: 16,
                                backgroundColor: color,
                                borderRadius: '50%',
                                border: '2px solid white',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {preset.name}
                        </Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveGlobalStyles}
                  color="primary"
                  size="large"
                >
                  Save Settings
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<PaletteIcon />}
                  onClick={applyToAllCards}
                  color="secondary"
                  size="large"
                >
                  Apply to All Cards
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={() => setShowPreview(true)}
                  size="large"
                >
                  Preview
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={resetToDefaults}
                  color="warning"
                  size="large"
                >
                  Reset to Defaults
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Preview Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PreviewIcon />
                Live Preview
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IDCard
                  studentData={sampleStudent}
                  customStyles={globalStyles}
                  size={cardSize}
                />
              </Box>
              <Alert severity="info" sx={{ mt: 2 }}>
                This preview shows how all ID cards will look with the current settings.
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Global Style Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <IDCard
              studentData={sampleStudent}
              customStyles={globalStyles}
              size="large"
            />
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            This is how all student ID cards will appear with the current global settings.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Close</Button>
          <Button onClick={applyToAllCards} variant="contained">
            Apply to All Cards
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GlobalIDCardCustomization;
