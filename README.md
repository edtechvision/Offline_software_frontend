# Offline Admission Software

A comprehensive offline admission management system built with React, Material-UI, and React Query.

## 🚀 Features

- **User Authentication**: Secure login system with role-based access
- **Student Management**: Complete student registration and management
- **Center Management**: Multi-center support with admin controls
- **Course Management**: Flexible course and batch management
- **Fee Management**: Comprehensive fee tracking and management
- **Responsive Design**: Modern UI built with Material-UI and Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 19, Material-UI 7, Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Fetch API with custom service layer
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd offline-admission-software
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Update with your API configuration
   VITE_API_BASE_URL=https://your-api-domain.com/api/v1
   VITE_APP_NAME=Offline Admission Software
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React Query hooks
├── services/           # API service functions
├── utils/              # Utility functions and configurations
└── assets/             # Static assets
```

## 🌐 API Integration

### Authentication
- **Login**: `POST /login`
- **Logout**: Client-side token removal

### Centers
- **Create**: `POST /center/create`
- **Get All**: `GET /center/get?page=1&limit=10&search=query`
- **Get by ID**: `GET /center/:id`
- **Update**: `PUT /center/:id`
- **Delete**: `DELETE /center/:id`

### Students
- **Create**: `POST /student/create`
- **Get All**: `GET /student/get?page=1&limit=10&search=query`
- **Get by ID**: `GET /student/:id`
- **Update**: `PUT /student/:id`
- **Delete**: `DELETE /student/:id`

## 🔐 Authentication

The system supports two authentication methods:

1. **Demo Mode**: Use predefined credentials for testing
   - Main Admin: `admin` / `admin123`
   - Admission Incharge: `incharge` / `incharge123`

2. **API Mode**: Connect to backend authentication service
   - Supports email, username, or center code as identifier
   - JWT token-based authentication

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Components

Built with Material-UI components and custom styling:
- **Cards**: Information containers with consistent styling
- **Forms**: Responsive form layouts with validation
- **Tables**: Data display with pagination and search
- **Navigation**: Collapsible sidebar navigation
- **Charts**: Data visualization with Chart.js

## 🔄 State Management

Uses React Query for:
- **Server State**: API data fetching and caching
- **Mutations**: Create, update, delete operations
- **Optimistic Updates**: Immediate UI feedback
- **Background Refetching**: Automatic data synchronization

## 📊 Data Flow

1. **User Action** → Component calls hook
2. **Hook** → React Query mutation/query
3. **React Query** → API service function
4. **API Service** → Fetch request to backend
5. **Response** → Update React Query cache
6. **UI Update** → Component re-renders with new data

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Configure environment variables** in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile app support
- [ ] Offline data synchronization
- [ ] Multi-language support
- [ ] Advanced user permissions
- [ ] Audit logging
- [ ] Data export/import functionality
