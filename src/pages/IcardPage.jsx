import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  FaIdCard, 
  FaUser, 
  FaGraduationCap, 
  FaDownload, 
  FaPrint,
  FaUsers,
  FaDesktop,
  FaTable,
  FaTh,
  FaCog
} from 'react-icons/fa';
import IDCardAdminForm from '../components/IDCardAdminForm';
import IDCardBulkGenerator from '../components/IDCardBulkGenerator';
import StudentIDCardTable from '../components/StudentIDCardTable';
import IDCardGallery from '../components/IDCardGallery';
import GlobalIDCardCustomization from '../components/GlobalIDCardCustomization';

const IcardPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view'); // 'view', 'edit', 'generate'

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );

  // Format student data for ID card
  const formatStudentData = (student) => ({
    name: student.studentName || '',
    fatherName: student.fathersName || '',
    studentId: student.registrationNo || '',
    class: student.className || '',
    course: student.courseDetails?.courseId?.name || '',
    address: student.presentAddress?.fullAddress ? 
      `${student.presentAddress.fullAddress}, ${student.presentAddress.district}, ${student.presentAddress.state} - ${student.presentAddress.pincode}` : '',
    contactNo: student.mobileNumber || '',
    photoUrl: student.image || null
  });

  const handleViewCard = (student) => {
    setSelectedStudent(student);
    setDialogMode('view');
    setShowCardDialog(true);
  };

  const handleEditCard = (student) => {
    setSelectedStudent(student);
    setDialogMode('edit');
    setShowCardDialog(true);
  };

  const handleGenerateCard = (student) => {
    setSelectedStudent(student);
    setDialogMode('generate');
    setShowCardDialog(true);
  };

  const closeDialog = () => {
    setShowCardDialog(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Student ID Card Management</h1>
            <p className="text-indigo-100">Professional ID card design, generation and management system</p>
          </div>
          <FaIdCard className="text-5xl text-indigo-200" />
        </div>
      </div>

      {/* Main Content */}
      <Card sx={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, value) => setActiveTab(value)}
              sx={{ px: 3 }}
            >
              <Tab 
                icon={<FaTable />} 
                label="Student Management" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab 
                icon={<FaTh />} 
                label="ID Card Gallery" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab 
                icon={<FaDesktop />} 
                label="Card Designer" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab 
                icon={<FaUsers />} 
                label="Bulk Generator" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab 
                icon={<FaCog />} 
                label="Global Settings" 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Alert severity="info" sx={{ m: 3, mb: 0 }}>
              View all students in table format and manage their ID cards individually.
            </Alert>
            <StudentIDCardTable 
              onViewCard={handleViewCard}
              onEditCard={handleEditCard}
              onGenerateCard={handleGenerateCard}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Alert severity="info" sx={{ m: 3, mb: 0 }}>
              View all student ID cards in a beautiful gallery format with customization options.
            </Alert>
            <IDCardGallery />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Alert severity="info" sx={{ m: 3, mb: 0 }}>
              Design and customize individual ID cards with real-time preview. Perfect for creating templates and single cards.
            </Alert>
            <IDCardAdminForm />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Alert severity="info" sx={{ m: 3, mb: 0 }}>
              Generate multiple ID cards for students in bulk. Select students and apply consistent styling across all cards.
            </Alert>
            <IDCardBulkGenerator />
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Alert severity="info" sx={{ m: 3, mb: 0 }}>
              Set global styling preferences that will be applied to all student ID cards across the system.
            </Alert>
            <GlobalIDCardCustomization />
          </TabPanel>
        </CardContent>
      </Card>

      {/* Dialog for viewing/editing cards */}
      <Dialog
        open={showCardDialog}
        onClose={closeDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'view' && `View ID Card - ${selectedStudent?.studentName}`}
          {dialogMode === 'edit' && `Edit ID Card - ${selectedStudent?.studentName}`}
          {dialogMode === 'generate' && `Generate ID Card - ${selectedStudent?.studentName}`}
        </DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <IDCardAdminForm
              initialStudentData={formatStudentData(selectedStudent)}
              isCustomizing={true}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IcardPage;
