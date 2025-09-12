import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import IDCard from './IDCard';

const IDCardDemo = () => {
  // Demo data for different students
  const demoStudents = [
    {
      name: 'GAUTAM KUMAR',
      fatherName: 'Arun Yadav',
      studentId: 'TB920214',
      class: '12th',
      course: '12th Batch 2025-26',
      address: 'Vill - Marsandha, Post - Khemnichak Patna - 800001 (Bihar)',
      contactNo: '+91 9142806007',
      photoUrl: null
    },
    {
      name: 'PRIYA SHARMA',
      fatherName: 'Rajesh Sharma',
      studentId: 'TB920215',
      class: '11th',
      course: '11th Batch 2025-26',
      address: 'Ram Nagar, Near City Mall, Patna- 800002 (Bihar)',
      contactNo: '+91 9876543210',
      photoUrl: null
    },
    {
      name: 'AMIT SINGH',
      fatherName: 'Suresh Singh',
      studentId: 'TB920216',
      class: '10th',
      course: '10th Batch 2025-26',
      address: 'Gandhi Maidan Road, Patna- 800001 (Bihar)',
      contactNo: '+91 8765432109',
      photoUrl: null
    }
  ];

  // Different style variations
  const styleVariations = [
    {
      name: 'Default Orange',
      styles: {
        backgroundGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
        headerTextColor: '#033398',
        nameTextColor: '#2E7D32',
        labelTextColor: '#033398',
        valueTextColor: '#333333',
        waveColor: '#4CAF50'
      }
    },
    {
      name: 'Blue Professional',
      styles: {
        backgroundGradient: 'linear-gradient(135deg, #87CEEB 0%, #4682B4 50%, #1E90FF 100%)',
        headerTextColor: '#ffffff',
        nameTextColor: '#003366',
        labelTextColor: '#ffffff',
        valueTextColor: '#000033',
        waveColor: '#0066CC'
      }
    },
    {
      name: 'Green Nature',
      styles: {
        backgroundGradient: 'linear-gradient(135deg, #98FB98 0%, #32CD32 50%, #228B22 100%)',
        headerTextColor: '#004d00',
        nameTextColor: '#ffffff',
        labelTextColor: '#004d00',
        valueTextColor: '#001a00',
        waveColor: '#66FF66'
      }
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        ID Card Showcase
      </Typography>

      {/* Size Variations */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Size Variations</Typography>
        <Grid container spacing={3} justifyContent="center">
          {['small', 'medium', 'large'].map((size) => (
            <Grid item key={size}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
                  {size}
                </Typography>
                <IDCard
                  studentData={demoStudents[0]}
                  size={size}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Style Variations */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Style Variations</Typography>
        <Grid container spacing={3} justifyContent="center">
          {styleVariations.map((variation, index) => (
            <Grid item key={variation.name}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {variation.name}
                </Typography>
                <IDCard
                  studentData={demoStudents[index % demoStudents.length]}
                  customStyles={variation.styles}
                  size="medium"
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Different Students */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Different Students</Typography>
        <Grid container spacing={3} justifyContent="center">
          {demoStudents.map((student, index) => (
            <Grid item key={student.studentId}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {student.name}
                </Typography>
                <IDCard
                  studentData={student}
                  size="medium"
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default IDCardDemo;
