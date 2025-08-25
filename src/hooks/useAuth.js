import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/apiService';

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Admin login mutation
  const adminLoginMutation = useMutation({
    mutationFn: authService.adminLogin,
    onSuccess: (response) => {
      if (response.success) {
        const { token, user } = response.data;
        
        // Store user data and token
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('userRole', 'admin');
        
        // Invalidate and refetch queries
        queryClient.invalidateQueries();
      }
    },
  });

  // Incharge login mutation
  const inchargeLoginMutation = useMutation({
    mutationFn: authService.inchargeLogin,
    onSuccess: (response) => {
      if (response.success) {
        const { token, user } = response.data;
        
        // Store user data and token
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('userRole', 'incharge');
        
        // Invalidate and refetch queries
        queryClient.invalidateQueries();
      }
    },
  });

  // Center login mutation
  const centerLoginMutation = useMutation({
    mutationFn: authService.centerLogin,
    onSuccess: (response) => {
      if (response.success) {
        const { token, user } = response.data;
        
        // Store user data and token
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        localStorage.setItem('userRole', 'center');
        
        // Invalidate and refetch queries
        queryClient.invalidateQueries();
      }
    },
  });

  // Generic login function that determines the type based on credentials
  const login = async (credentials, options = {}) => {
    const { onSuccess, onError } = options;
    
    try {
      let response;
      
      // Determine login type based on credentials
      if (credentials.email && credentials.password && !credentials.centerCode) {
        // Admin login
        response = await adminLoginMutation.mutateAsync(credentials);
      } else if (credentials.centerCode && credentials.password && !credentials.email) {
        // Center login - using centerCode and password
        response = await centerLoginMutation.mutateAsync(credentials);
      } else if (credentials.email && credentials.password) {
        // Admin login (fallback)
        response = await adminLoginMutation.mutateAsync(credentials);
      } else {
        throw new Error('Invalid credentials format');
      }

      if (response.success && onSuccess) {
        onSuccess(response);
      } else if (!response.success && onError) {
        // Call onError if the response indicates failure
        onError(response.error || new Error('Login failed'));
      }
      
      return response;
    } catch (error) {
      if (onError) {
        onError(error);
      }
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    queryClient.clear();
  };

  // Check authentication status
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  // Get current user
  const getCurrentUser = () => {
    return authService.getCurrentUser();
  };

  // Get current user role
  const getCurrentUserRole = () => {
    return localStorage.getItem('userRole');
  };

  return {
    // Login functions
    login,
    adminLogin: adminLoginMutation.mutateAsync,
    inchargeLogin: inchargeLoginMutation.mutateAsync,
    centerLogin: centerLoginMutation.mutateAsync,
    
    // Loading states
    isLoggingIn: adminLoginMutation.isPending || inchargeLoginMutation.isPending || centerLoginMutation.isPending,
    
    // Error states
    loginError: adminLoginMutation.error || inchargeLoginMutation.error || centerLoginMutation.error,
    
    // Other functions
    logout,
    isAuthenticated,
    getCurrentUser,
    getCurrentUserRole,
  };
};
