import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        const storedRole = localStorage.getItem('userRole');
        
        if (token && userData && storedRole) {
          try {
            const user = JSON.parse(userData);
            setCurrentUser(user);
            setUserRole(storedRole);
            setIsAuthenticated(true);
          } catch (error) {
            logout();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (userData, token, role) => {
    setCurrentUser(userData);
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userRole', role);
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
  };

  // Helper function to check if user has required role
  const hasRole = (requiredRole) => {
    if (!requiredRole) return true;
    return userRole === requiredRole;
  };

  // Helper function to check if user has any of the required roles
  const hasAnyRole = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(userRole);
  };

  const value = {
    userRole,
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
