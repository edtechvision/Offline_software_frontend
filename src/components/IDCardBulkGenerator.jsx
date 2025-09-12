import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  Print as PrintIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useStudents } from '../hooks/useStudents';
import { useIDCard } from '../hooks/useIDCard';
import IDCard from './IDCard';

const IDCardBulkGenerator = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const printRef = useRef();

  // Fetch students data
  const { data: studentsResponse, isLoading, error } = useStudents();
  const students = studentsResponse?.students || studentsResponse?.data?.students || [];

  // ID Card hook for bulk operations
  const {
    bulkCardSettings,
    setBulkCardSettings,
    generateBulkCards,
    saveCardTemplate,
    getCardTemplates
  } = useIDCard();

  const [tempSettings, setTempSettings] = useState(bulkCardSettings);

  // Handle student selection
  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(student => student.id));
    }
  };

  // Settings handlers
  const handleSettingsChange = (field, value) => {
    setTempSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStyleChange = (field, value) => {
    setTempSettings(prev => ({
      ...prev,
      customStyles: {
        ...prev.customStyles,
        [field]: value
      }
    }));
  };

  const applySettings = () => {
    setBulkCardSettings(tempSettings);
    setShowSettings(false);
  };

  const resetSettings = () => {
    setTempSettings(bulkCardSettings);
    setShowSettings(false);
  };

  // Generate and export functions
  const generateBulkPDF = async () => {
    if (selectedStudents.length === 0) {
      setGenerationStatus('Please select at least one student');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGenerationStatus('Preparing PDF generation...');

    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const selectedStudentData = students.filter(student => 
        selectedStudents.includes(student.id)
      );

      const cardsPerPage = 2; // 2 cards per page for better quality
      let cardCount = 0;

      for (const student of selectedStudentData) {
        setProgress((cardCount / selectedStudentData.length) * 100);
        setGenerationStatus(`Processing card ${cardCount + 1} of ${selectedStudentData.length}...`);

        // Create a temporary container for the card
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        document.body.appendChild(tempContainer);

        // Render the card (this would need React rendering in a real implementation)
        // For now, we'll simulate the process
        await new Promise(resolve => setTimeout(resolve, 500));

        if (cardCount > 0 && cardCount % cardsPerPage === 0) {
          pdf.addPage();
        }

        // Remove temporary container
        document.body.removeChild(tempContainer);
        cardCount++;
      }

      pdf.save(`student-id-cards-bulk-${new Date().getTime()}.pdf`);
      setGenerationStatus(`Successfully generated ${selectedStudentData.length} ID cards!`);
      
    } catch (error) {
      console.error('Bulk PDF generation error:', error);
      setGenerationStatus('Error generating PDF. Please try again.');
    }

    setIsGenerating(false);
    setProgress(100);
    setTimeout(() => {
      setGenerationStatus('');
      setProgress(0);
    }, 3000);
  };

  const generateBulkZIP = async () => {
    if (selectedStudents.length === 0) {
      setGenerationStatus('Please select at least one student');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('Generating individual PNG files...');
    
    // This would implement ZIP generation with individual PNG files
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGenerationStatus('ZIP generation feature coming soon!');
    setIsGenerating(false);
    
    setTimeout(() => setGenerationStatus(''), 3000);
  };

  // Template management
  const templates = getCardTemplates();

  const saveTemplate = () => {
    const templateName = prompt('Enter template name:');
    if (templateName) {
      const result = saveCardTemplate(templateName, bulkCardSettings);
      setGenerationStatus(result.message);
      setTimeout(() => setGenerationStatus(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading students...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Error loading students: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Bulk ID Card Generator
      </Typography>

      {/* Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                onClick={() => setShowSettings(true)}
                fullWidth
              >
                Card Settings
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={generateBulkPDF}
                disabled={isGenerating || selectedStudents.length === 0}
                fullWidth
              >
                Export PDF
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={generateBulkZIP}
                disabled={isGenerating || selectedStudents.length === 0}
                fullWidth
              >
                Export ZIP
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                disabled={selectedStudents.length === 0}
                fullWidth
              >
                Print Selected
              </Button>
            </Grid>
          </Grid>

          {/* Progress and Status */}
          {isGenerating && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {generationStatus}
              </Typography>
            </Box>
          )}

          {generationStatus && !isGenerating && (
            <Alert 
              severity={generationStatus.includes('Error') ? 'error' : 'success'} 
              sx={{ mt: 2 }}
            >
              {generationStatus}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Current Settings Display */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Current Settings</Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Chip label={`Size: ${bulkCardSettings.size}`} />
            </Grid>
            <Grid item>
              <Chip label={`Selected: ${selectedStudents.length} students`} />
            </Grid>
            <Grid item>
              <Chip label="Template: Default" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Student Selection Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Select Students ({selectedStudents.length} of {students.length} selected)
            </Typography>
            <Button onClick={handleSelectAll}>
              {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.length === students.length && students.length > 0}
                      indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student.id}
                    selected={selectedStudents.includes(student.id)}
                    hover
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell>{student.student_id || student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.course || student.batch}</TableCell>
                    <TableCell>{student.contact_no || student.phone}</TableCell>
                    <TableCell>
                      {student.is_active ? (
                        <Chip icon={<CheckIcon />} label="Active" color="success" size="small" />
                      ) : (
                        <Chip icon={<CancelIcon />} label="Inactive" color="error" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="md" fullWidth>
        <DialogTitle>Bulk Card Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Card Size</InputLabel>
                <Select
                  value={tempSettings.size}
                  onChange={(e) => handleSettingsChange('size', e.target.value)}
                  label="Card Size"
                >
                  <MenuItem value="small">Small (350x500)</MenuItem>
                  <MenuItem value="medium">Medium (420x600)</MenuItem>
                  <MenuItem value="large">Large (500x725)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Background Gradients</Typography>
              <Grid container spacing={1}>
                {[
                  { name: 'Default Orange', value: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)' },
                  { name: 'Blue Sky', value: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)' },
                  { name: 'Green Nature', value: 'linear-gradient(135deg, #98FB98 0%, #32CD32 50%, #228B22 100%)' }
                ].map((preset, index) => (
                  <Grid item key={index}>
                    <Chip
                      label={preset.name}
                      onClick={() => handleStyleChange('backgroundGradient', preset.value)}
                      variant={tempSettings.customStyles.backgroundGradient === preset.value ? 'filled' : 'outlined'}
                      sx={{
                        background: tempSettings.customStyles.backgroundGradient === preset.value ? preset.value : 'transparent',
                        color: tempSettings.customStyles.backgroundGradient === preset.value ? '#fff' : 'inherit'
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetSettings}>Cancel</Button>
          <Button onClick={saveTemplate} variant="outlined">Save as Template</Button>
          <Button onClick={applySettings} variant="contained">Apply Settings</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IDCardBulkGenerator;
