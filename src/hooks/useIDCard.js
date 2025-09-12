import { useState, useCallback } from 'react';

export const useIDCard = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [bulkCardSettings, setBulkCardSettings] = useState({
    size: 'medium',
    customStyles: {
      backgroundGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      headerTextColor: '#033398',
      subHeaderTextColor: '#333333',
      nameTextColor: '#2E7D32',
      labelTextColor: '#033398',
      valueTextColor: '#333333',
      borderRadius: '16px',
      waveColor: '#4CAF50'
    }
  });

  const generateBulkCards = useCallback((students, settings = bulkCardSettings) => {
    return students.map(student => ({
      studentData: {
        name: student.name || '',
        fatherName: student.father_name || student.fatherName || '',
        studentId: student.student_id || student.studentId || '',
        class: student.class || '',
        course: student.course || student.batch || '',
        address: student.address || '',
        contactNo: student.contact_no || student.contactNo || student.phone || '',
        photoUrl: student.photo_url || student.photoUrl || student.image || ''
      },
      customStyles: settings.customStyles,
      size: settings.size
    }));
  }, [bulkCardSettings]);

  const exportMultipleCards = useCallback(async (cards, format = 'pdf') => {
    try {
      if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        const { default: html2canvas } = await import('html2canvas');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const cardsPerPage = 2; // Adjust based on card size
        
        for (let i = 0; i < cards.length; i++) {
          if (i > 0 && i % cardsPerPage === 0) {
            pdf.addPage();
          }
          
          // This would need to be implemented with actual card rendering
          // For now, we'll return the configuration
        }
        
        return { success: true, message: 'Bulk PDF export configured' };
      } else if (format === 'zip') {
        // Implementation for ZIP export of individual PNGs
        return { success: true, message: 'Bulk ZIP export configured' };
      }
    } catch (error) {
      console.error('Bulk export error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const saveCardTemplate = useCallback((templateName, settings) => {
    try {
      const templates = JSON.parse(localStorage.getItem('idCardTemplates') || '{}');
      templates[templateName] = {
        ...settings,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('idCardTemplates', JSON.stringify(templates));
      return { success: true, message: 'Template saved successfully' };
    } catch (error) {
      console.error('Save template error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const loadCardTemplate = useCallback((templateName) => {
    try {
      const templates = JSON.parse(localStorage.getItem('idCardTemplates') || '{}');
      const template = templates[templateName];
      if (template) {
        setBulkCardSettings(template);
        return { success: true, template };
      }
      return { success: false, error: 'Template not found' };
    } catch (error) {
      console.error('Load template error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const getCardTemplates = useCallback(() => {
    try {
      const templates = JSON.parse(localStorage.getItem('idCardTemplates') || '{}');
      return Object.keys(templates).map(name => ({
        name,
        ...templates[name]
      }));
    } catch (error) {
      console.error('Get templates error:', error);
      return [];
    }
  }, []);

  const deleteCardTemplate = useCallback((templateName) => {
    try {
      const templates = JSON.parse(localStorage.getItem('idCardTemplates') || '{}');
      delete templates[templateName];
      localStorage.setItem('idCardTemplates', JSON.stringify(templates));
      return { success: true, message: 'Template deleted successfully' };
    } catch (error) {
      console.error('Delete template error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  return {
    selectedStudents,
    setSelectedStudents,
    bulkCardSettings,
    setBulkCardSettings,
    generateBulkCards,
    exportMultipleCards,
    saveCardTemplate,
    loadCardTemplate,
    getCardTemplates,
    deleteCardTemplate
  };
};
