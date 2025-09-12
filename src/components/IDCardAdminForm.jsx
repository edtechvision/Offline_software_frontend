import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import { HexColorPicker } from 'react-colorful';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import IDCard from './IDCard';

const IDCardAdminForm = ({ initialStudentData = null, isCustomizing = false }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(null);
  const cardRef = useRef();

  // Student data state
  const [studentData, setStudentData] = useState(initialStudentData || {
    name: 'GAUTAM KUMAR',
    fatherName: 'Arun Yadav',
    studentId: 'TB920214',
    class: '12th',
    course: '12th Batch 2025-26',
    address: 'Vill - Marsandha, Post - Khemnichak Patna - 800001 (Bihar)',
    contactNo: '+91 9142806007',
    photoUrl: ''
  });

  // Style customization state
  const [customStyles, setCustomStyles] = useState({
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
  const [exportStatus, setExportStatus] = useState('');

  // Color picker options with initialization
  const colorOptions = [
    { key: 'headerTextColor', label: 'Header Text', color: customStyles.headerTextColor, defaultColor: '#033398' },
    { key: 'nameTextColor', label: 'Name Text', color: customStyles.nameTextColor, defaultColor: '#2E7D32' },
    { key: 'labelTextColor', label: 'Label Text', color: customStyles.labelTextColor, defaultColor: '#033398' },
    { key: 'valueTextColor', label: 'Value Text', color: customStyles.valueTextColor, defaultColor: '#333333' },
    { key: 'waveColor', label: 'Wave Accent', color: customStyles.waveColor, defaultColor: '#4CAF50' },
    { key: 'subHeaderTextColor', label: 'Sub Header', color: customStyles.subHeaderTextColor, defaultColor: '#333333' }
  ];

  // Gradient presets
  const gradientPresets = [
    { name: 'Default Orange', value: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)' },
    { name: 'Blue Sky', value: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)' },
    { name: 'Green Nature', value: 'linear-gradient(135deg, #98FB98 0%, #32CD32 50%, #228B22 100%)' },
    { name: 'Purple Elegant', value: 'linear-gradient(135deg, #DDA0DD 0%, #9370DB 50%, #8A2BE2 100%)' },
    { name: 'Red Power', value: 'linear-gradient(135deg, #FFB6C1 0%, #FF6347 50%, #DC143C 100%)' }
  ];

  const handleStudentDataChange = (field, value) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStyleChange = (field, value) => {
    setCustomStyles(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (field, color) => {
    setCustomStyles(prev => ({
      ...prev,
      [field]: color
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStudentData(prev => ({
          ...prev,
          photoUrl: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefaults = () => {
    setStudentData({
      name: 'GAUTAM KUMAR',
      fatherName: 'Arun Yadav',
      studentId: 'TB920214',
      class: '12th',
      course: '12th Batch 2025-26',
      address: 'Vill - Marsandha, Post - Khemnichak Patna - 800001 (Bihar)',
      contactNo: '+91 9142806007',
      photoUrl: ''
    });
    setCustomStyles({
      backgroundGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      headerTextColor: '#033398',
      subHeaderTextColor: '#333333',
      nameTextColor: '#2E7D32',
      labelTextColor: '#033398',
      valueTextColor: '#333333',
      borderRadius: '16px',
      waveColor: '#4CAF50'
    });
    setCardSize('medium');
  };

  const exportAsPNG = async () => {
    try {
      setExportStatus('Generating PNG...');
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `id-card-${studentData.studentId || 'student'}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      setExportStatus('PNG exported successfully!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('Error exporting PNG');
      console.error('Export error:', error);
    }
  };

  const exportAsPDF = async () => {
    try {
      setExportStatus('Generating PDF...');
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`id-card-${studentData.studentId || 'student'}.pdf`);
      
      setExportStatus('PDF exported successfully!');
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      setExportStatus('Error exporting PDF');
      console.error('Export error:', error);
    }
  };

  const printCard = () => {
    const printWindow = window.open('', '_blank');
    const cardHTML = cardRef.current.outerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print ID Card</title>
          <style>
            body { margin: 0; padding: 20px; display: flex; justify-content: center; }
            @media print { body { margin: 0; padding: 0; } }
          </style>
        </head>
        <body>
          ${cardHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#033398' }}>
        ID Card Designer & Generator
      </Typography>

      <Grid container spacing={3}>
        {/* Left Panel - Controls */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                  <Tab label="Student Data" />
                  <Tab label="Style Customization" />
                  <Tab label="Export & Print" />
                </Tabs>
              </Box>

              {/* Student Data Tab */}
              {activeTab === 0 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Student Name"
                      value={studentData.name}
                      onChange={(e) => handleStudentDataChange('name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Father's Name"
                      value={studentData.fatherName}
                      onChange={(e) => handleStudentDataChange('fatherName', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Student ID"
                      value={studentData.studentId}
                      onChange={(e) => handleStudentDataChange('studentId', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Class"
                      value={studentData.class}
                      onChange={(e) => handleStudentDataChange('class', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Course"
                      value={studentData.course}
                      onChange={(e) => handleStudentDataChange('course', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      multiline
                      rows={2}
                      value={studentData.address}
                      onChange={(e) => handleStudentDataChange('address', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      value={studentData.contactNo}
                      onChange={(e) => handleStudentDataChange('contactNo', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ height: '56px' }}
                    >
                      Upload Photo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                  </Grid>
                </Grid>
              )}

              {/* Style Customization Tab */}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  {/* Card Size */}
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
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
                  </Grid>

                  {/* Background Gradients */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Background Gradient</Typography>
                    <Grid container spacing={1}>
                      {gradientPresets.map((preset, index) => (
                        <Grid item key={index}>
                          <Chip
                            label={preset.name}
                            onClick={() => handleStyleChange('backgroundGradient', preset.value)}
                            variant={customStyles.backgroundGradient === preset.value ? 'filled' : 'outlined'}
                            sx={{
                              background: customStyles.backgroundGradient === preset.value ? preset.value : 'transparent',
                              color: customStyles.backgroundGradient === preset.value ? '#fff' : 'inherit'
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {/* Color Customization */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Text Colors</Typography>
                  <Grid container spacing={2}>
                    {colorOptions.map((option) => (
                      <Grid item xs={12} sm={6} md={4} key={option.key}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {option.label}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              onClick={() => setShowColorPicker(showColorPicker === option.key ? null : option.key)}
                              sx={{
                                width: 50,
                                height: 50,
                                backgroundColor: option.color,
                                border: '3px solid #fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                '&:hover': { 
                                  border: '3px solid #2196f3',
                                  transform: 'scale(1.05)'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <PaletteIcon sx={{ color: 'white', fontSize: 20 }} />
                            </IconButton>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                                {option.color}
                              </Typography>
                              <Button
                                size="small"
                                onClick={() => handleColorChange(option.key, option.defaultColor)}
                                sx={{ fontSize: '0.7rem', p: 0.5, minWidth: 'auto' }}
                              >
                                Reset
                              </Button>
                            </Box>
                          </Box>
                          {showColorPicker === option.key && (
                            <Box sx={{ 
                              position: 'absolute', 
                              zIndex: 1000, 
                              mt: 2,
                              p: 2,
                              bgcolor: 'white',
                              borderRadius: 2,
                              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                              border: '1px solid #e0e0e0'
                            }}>
                              <Box
                                sx={{ 
                                  position: 'fixed', 
                                  top: 0, 
                                  left: 0, 
                                  right: 0, 
                                  bottom: 0,
                                  zIndex: 999
                                }}
                                onClick={() => setShowColorPicker(null)}
                              />
                              <Box sx={{ position: 'relative', zIndex: 1001 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                  Choose {option.label} Color
                                </Typography>
                                <HexColorPicker
                                  color={option.color}
                                  onChange={(color) => handleColorChange(option.key, color)}
                                />
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleColorChange(option.key, option.defaultColor)}
                                  >
                                    Default
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => setShowColorPicker(null)}
                                  >
                                    Done
                                  </Button>
                                </Box>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    ))}
                    </Grid>

                    {/* Quick Color Presets */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Quick Color Schemes</Typography>
                      <Grid container spacing={1}>
                        {[
                          {
                            name: 'Default',
                            colors: {
                              headerTextColor: '#033398',
                              nameTextColor: '#2E7D32',
                              labelTextColor: '#033398',
                              valueTextColor: '#333333',
                              waveColor: '#4CAF50'
                            }
                          },
                          {
                            name: 'Royal Blue',
                            colors: {
                              headerTextColor: '#1565c0',
                              nameTextColor: '#0d47a1',
                              labelTextColor: '#033398',
                              valueTextColor: '#424242',
                              waveColor: '#42a5f5'
                            }
                          },
                          {
                            name: 'Forest Green',
                            colors: {
                              headerTextColor: '#2e7d32',
                              nameTextColor: '#1b5e20',
                              labelTextColor: '#388e3c',
                              valueTextColor: '#424242',
                              waveColor: '#66bb6a'
                            }
                          },
                          {
                            name: 'Purple Elite',
                            colors: {
                              headerTextColor: '#7b1fa2',
                              nameTextColor: '#4a148c',
                              labelTextColor: '#8e24aa',
                              valueTextColor: '#424242',
                              waveColor: '#ba68c8'
                            }
                          },
                          {
                            name: 'Sunset Orange',
                            colors: {
                              headerTextColor: '#ef6c00',
                              nameTextColor: '#e65100',
                              labelTextColor: '#f57c00',
                              valueTextColor: '#424242',
                              waveColor: '#ffb74d'
                            }
                          }
                        ].map((preset) => (
                          <Grid item xs={12} sm={6} md={4} key={preset.name}>
                            <Button
                              variant="outlined"
                              size="small"
                              fullWidth
                              onClick={() => {
                                setCustomStyles(prev => ({
                                  ...prev,
                                  ...preset.colors
                                }));
                              }}
                              sx={{
                                p: 1,
                                height: 'auto',
                                flexDirection: 'column',
                                gap: 0.5,
                                textTransform: 'none'
                              }}
                            >
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {Object.values(preset.colors).slice(0, 4).map((color, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      width: 12,
                                      height: 12,
                                      backgroundColor: color,
                                      borderRadius: '50%',
                                      border: '1px solid white',
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    }}
                                  />
                                ))}
                              </Box>
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                {preset.name}
                              </Typography>
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Export & Print Tab */}
              {activeTab === 2 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Export Options</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={exportAsPNG}
                      sx={{ height: '56px' }}
                    >
                      Export as PNG
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={exportAsPDF}
                      sx={{ height: '56px' }}
                    >
                      Export as PDF
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={printCard}
                      sx={{ height: '56px' }}
                    >
                      Print Card
                    </Button>
                  </Grid>
                  
                  {exportStatus && (
                    <Grid item xs={12}>
                      <Alert severity={exportStatus.includes('Error') ? 'error' : 'success'}>
                        {exportStatus}
                      </Alert>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={resetToDefaults}
                      color="warning"
                    >
                      Reset to Defaults
                    </Button>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Preview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PreviewIcon />
                Live Preview
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box ref={cardRef}>
                  <IDCard
                    studentData={studentData}
                    customStyles={customStyles}
                    size={cardSize}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IDCardAdminForm;
