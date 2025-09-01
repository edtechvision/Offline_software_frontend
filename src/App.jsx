import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainAdminSidebar from './components/MainAdminSidebar';
import AdminCenterSidebar from './components/AdminCenterSidebar';
import StudentsPage from './pages/StudentsPage';
import StudentRegistrationPage from './pages/StudentRegistrationPage';
import StudentViewPage from './pages/StudentViewPage';
import StudentEditPage from './pages/StudentEditPage';
import CoursePage from './pages/CoursePage';
import BatchPage from './pages/BatchPage';
import CenterPage from './pages/CenterPage';
import FeePage from './pages/FeePage';
import ExpensesPage from './pages/ExpensesPage';
import EnquiryPage from './pages/EnquiryPage';
import StockManagementPage from './pages/StockManagementPage';
import JobApplicationsPage from './pages/JobApplicationsPage';
import IcardPage from './pages/IcardPage';
import SliderPage from './pages/SliderPage';
import JobCategoryPage from './pages/JobCategoryPage';
import JobsPage from './pages/JobsPage';
import JobApplicationsListPage from './pages/JobApplicationsListPage';
import AdmissionInchargePage from './pages/AdmissionInchargePage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Main App Routes Component
const AppRoutes = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { userRole, isAuthenticated, logout, currentUser, isLoading } = useAuthContext();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    // Clear React Query cache on logout
    queryClient.clear();
    // Force a page refresh to ensure clean state
    window.location.href = '/login';
  };

  // Get appropriate sidebar based on user role
  const getSidebar = () => {
    switch (userRole) {
      case 'admin':
        return (
          <MainAdminSidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={toggleSidebar} 
            onLogout={handleLogout}
            userData={currentUser}
          />
        );
      case 'incharge':
      case 'center':
        return (
          <AdminCenterSidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={toggleSidebar} 
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  // Layout wrapper for protected routes
  const ProtectedLayout = ({ children, requiredRoles = null }) => (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <div className="flex h-screen bg-bg-secondary font-mona overflow-hidden">
        {getSidebar()}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
        {/* Public route - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          } 
        />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />

      {/* Student Management Routes */}
      <Route
        path="/students"
        element={
          <ProtectedLayout requiredRoles={["admin", "center"]}>
            <StudentsPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/students/:id"
        element={
          <ProtectedLayout requiredRoles={["admin", "center"]}>
            <StudentViewPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/students/:id/edit"
        element={
          <ProtectedLayout requiredRoles={["admin"]}>
            <StudentEditPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/student-registration"
        element={
          <ProtectedLayout requiredRoles={["admin", "center"]}>
            <StudentRegistrationPage />
          </ProtectedLayout>
        }
      />

      {/* Course Management Routes */}
      <Route
        path="/course"
        element={
          <ProtectedLayout requiredRoles="admin">
            <CoursePage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/batch"
        element={
          <ProtectedLayout requiredRoles="admin">
            <BatchPage />
          </ProtectedLayout>
        }
      />

      {/* Center Management Routes */}
      <Route
        path="/center"
        element={
          <ProtectedLayout requiredRoles={["admin", "center"]}>
            <CenterPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/admission-incharge"
        element={
          <ProtectedLayout requiredRoles="admin">
            <AdmissionInchargePage />
          </ProtectedLayout>
        }
      />

      {/* Financial Management Routes */}
      <Route
        path="/expenses-upload"
        element={
          <ProtectedLayout requiredRoles={["admin", "center"]}>
            <ExpensesPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/fee"
        element={
          <ProtectedLayout requiredRoles={["admin", "center"]}>
            <FeePage />
          </ProtectedLayout>
        }
      />

      {/* Business Management Routes */}
      <Route
        path="/enquiry"
        element={
          <ProtectedLayout requiredRoles={["admin", "center"]}>
            <EnquiryPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/stock-management"
        element={
          <ProtectedLayout requiredRoles={["admin", "center"]}>
            <StockManagementPage />
          </ProtectedLayout>
        }
      />

      {/* Admin-only Management Routes */}
      <Route
        path="/center-expenses"
        element={
          <ProtectedLayout requiredRoles="admin">
            <ExpensesPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/icard"
        element={
          <ProtectedLayout requiredRoles="admin">
            <IcardPage />
          </ProtectedLayout>
        }
      />

      {/* Job Management Routes */}
      <Route
        path="/job-category"
        element={
          <ProtectedLayout requiredRoles="admin">
            <JobCategoryPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/jobs"
        element={
          <ProtectedLayout requiredRoles="admin">
            <JobsPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/job-applications"
        element={
          <ProtectedLayout requiredRoles="admin">
            <JobApplicationsListPage />
          </ProtectedLayout>
        }
      />

      <Route
        path="/offline-job-applications"
        element={
          <ProtectedLayout requiredRoles={["admin", "center"]}>
            <JobApplicationsPage />
          </ProtectedLayout>
        }
      />

      {/* Content Management Routes */}
      <Route
        path="/slider"
        element={
          <ProtectedLayout requiredRoles="admin">
            <SliderPage />
          </ProtectedLayout>
        }
      />

      {/* Catch all route - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

