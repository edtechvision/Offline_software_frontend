# ID Card Management System

A comprehensive, professional ID card design and generation system for the offline admission software.

## Features

### 🎨 Advanced Card Designer
- **Real-time Preview**: See changes instantly as you customize
- **Multiple Sizes**: Small (240x320), Medium (300x400), Large (360x480)
- **Custom Styling**: Colors, gradients, fonts, and layouts
- **QR Code Integration**: Auto-generated QR codes with student information
- **Photo Support**: Upload and display student photos

### 🚀 Bulk Generation
- **Multi-student Selection**: Select multiple students at once
- **Batch Processing**: Generate hundreds of cards efficiently
- **Template Management**: Save and reuse custom designs
- **Progress Tracking**: Real-time generation progress

### 📤 Export Options
- **PNG Export**: High-quality images for web use
- **PDF Export**: Print-ready documents
- **Bulk ZIP**: Individual PNG files for each student
- **Print Support**: Direct printing with optimized layouts

### 🎯 Professional Design
- **Target Bihar Branding**: Matches the provided design specification
- **Responsive Layout**: Works on desktop and mobile devices
- **Material-UI Integration**: Consistent with existing app design
- **Wave Patterns**: Subtle design elements for visual appeal

## Components Overview

### Core Components

#### `IDCard.jsx`
The main reusable card component with the following props:
```jsx
<IDCard
  studentData={{
    name: 'GAUTAM KUMAR',
    fatherName: 'Arun Yadav',
    studentId: 'TB920214',
    class: '12th',
    course: '12th Batch 2025-26',
    address: 'Full address...',
    contactNo: '+91 9142806007',
    photoUrl: 'optional-image-url'
  }}
  customStyles={{
    backgroundGradient: 'linear-gradient(...)',
    headerTextColor: '#033398',
    nameTextColor: '#2E7D32',
    // ... other style options
  }}
  size="medium" // small, medium, large
/>
```

#### `IDCardAdminForm.jsx`
Administrative form for designing and customizing cards:
- Student data input fields
- Style customization controls
- Color pickers for text elements
- Gradient preset selection
- Real-time preview
- Export functionality

#### `IDCardBulkGenerator.jsx`
Bulk generation interface:
- Student selection table
- Bulk settings configuration
- Progress tracking
- Multiple export formats
- Template management

### Utility Components

#### `IDCardDemo.jsx`
Showcase component displaying various card styles and sizes.

#### `useIDCard.js`
Custom hook for ID card operations:
- Bulk card generation
- Template management
- Export functionality
- Settings persistence

## Usage Examples

### Basic Card Display
```jsx
import IDCard from '../components/IDCard';

const MyComponent = () => {
  const studentData = {
    name: 'STUDENT NAME',
    studentId: 'TB123456',
    // ... other fields
  };
  
  return <IDCard studentData={studentData} />;
};
```

### Custom Styling
```jsx
const customStyles = {
  backgroundGradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  headerTextColor: '#033398',
  nameTextColor: '#2E7D32'
};

return (
  <IDCard 
    studentData={studentData} 
    customStyles={customStyles}
    size="large"
  />
);
```

### Bulk Generation
```jsx
import { useIDCard } from '../hooks/useIDCard';

const BulkGenerator = () => {
  const { generateBulkCards, exportMultipleCards } = useIDCard();
  
  const handleBulkExport = async (students) => {
    const cards = generateBulkCards(students);
    await exportMultipleCards(cards, 'pdf');
  };
};
```

## Technical Implementation

### Dependencies
- `qrcode.react`: QR code generation
- `html2canvas`: Canvas-based image export
- `jspdf`: PDF generation
- `react-colorful`: Color picker interface
- `@mui/material`: UI components

### Key Features
1. **Modular Design**: Reusable components with clear separation of concerns
2. **Performance Optimized**: Lazy loading and efficient rendering
3. **Responsive**: Works across different screen sizes
4. **Accessible**: Proper ARIA labels and keyboard navigation
5. **Customizable**: Extensive styling and configuration options

### File Structure
```
src/
├── components/
│   ├── IDCard.jsx                  # Main card component
│   ├── IDCardAdminForm.jsx         # Design interface
│   ├── IDCardBulkGenerator.jsx     # Bulk operations
│   └── IDCardDemo.jsx              # Showcase component
├── hooks/
│   └── useIDCard.js                # Card management hook
└── pages/
    └── IcardPage.jsx               # Main page integration
```

## Design Specifications

### Card Layout
- **Header**: TARGET BIHAR logo and contact information
- **Photo Section**: Student photo with rounded corners
- **Name**: Large, prominent student name
- **Details**: Labeled information fields
- **QR Code**: Bottom-right corner with student data

### Color Scheme
- **Background**: Yellow-orange gradient (#FFD700 to #FF8C00)
- **Header Text**: Blue (#033398)
- **Name Text**: Green (#2E7D32)
- **Labels**: Blue (#033398)
- **Values**: Dark gray (#333333)

### Typography
- **Header**: Bold, 20px (medium size)
- **Name**: Bold, 22px (medium size)
- **Labels**: Bold, 11px (medium size)
- **Values**: Regular, 10px (medium size)

## Future Enhancements

### Planned Features
1. **Batch Printing**: Optimized layouts for physical printing
2. **Card Templates**: Pre-designed templates for different courses
3. **Integration**: Connect with student database for auto-population
4. **Validation**: Data validation and error handling
5. **Analytics**: Track card generation and usage statistics

### Performance Improvements
1. **Virtual Scrolling**: For large student lists
2. **Image Optimization**: Compress photos automatically
3. **Caching**: Cache generated cards for faster re-exports
4. **Background Processing**: Generate cards in web workers

## Troubleshooting

### Common Issues
1. **QR Code Not Showing**: Check if student data is properly formatted
2. **Export Fails**: Ensure browser supports html2canvas
3. **Styling Issues**: Verify CSS-in-JS syntax in style objects
4. **Performance Slow**: Reduce card size or limit concurrent generations

### Browser Compatibility
- Chrome: Full support
- Firefox: Full support
- Safari: Full support (may need polyfills for older versions)
- Edge: Full support

## Contributing

When adding new features or modifications:
1. Follow the existing component structure
2. Add proper TypeScript/PropTypes definitions
3. Include comprehensive documentation
4. Test across different browsers and screen sizes
5. Ensure accessibility compliance

## Support

For issues or questions about the ID card system:
1. Check this documentation first
2. Review the demo component for examples
3. Test with the provided demo data
4. Contact the development team for complex issues
