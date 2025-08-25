import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = null }) => {
  const { isAuthenticated, hasRole, hasAnyRole, userRole, isLoading } = useAuthContext();
  const location = useLocation();



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

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are required and user doesn't have any of them, redirect to dashboard
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and has required role(s) (if any), render children
  return children;
};

export default ProtectedRoute;
