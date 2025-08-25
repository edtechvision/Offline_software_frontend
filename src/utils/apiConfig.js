// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://seashell-app-vgu3a.ondigitalocean.app/api/v1';

// Log the API base URL for debugging


// Default headers for API requests
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  ADMIN_LOGIN: '/admin/login',
  INCHARGE_LOGIN: '/incharge/login',
  CENTER_LOGIN: '/center/login',
  
  // Center management
  CENTER: {
    CREATE: '/center/create',
    GET_ALL: '/center/get',
    GET_BY_ID: (id) => `/center/${id}`,
    UPDATE: (id) => `/center/${id}`,
    DELETE: (id) => `/center/${id}`,
  },
  
  // Admission Incharge management
  INCHARGE: {
    CREATE: '/admissionIncharge/create',
    GET_ALL: '/admissionIncharge/get',
    GET_BY_ID: (id) => `/admissionIncharge/${id}`,
    UPDATE: (id) => `/admissionIncharge/${id}`,
    DELETE: (id) => `/admissionIncharge/${id}`,
  },
  
  // Course management
  COURSES: {
    CREATE: '/courses',
    GET_ALL: '/courses',
    GET_BY_ID: (id) => `/courses/${id}`,
    UPDATE: (id) => `/courses/${id}`,
    DELETE: (id) => `/courses/${id}`,
  },

  // Batch management
  BATCHES: {
    CREATE: '/batches',
    GET_ALL: '/batches',
    GET_BY_ID: (id) => `/batches/${id}`,
    UPDATE: (id) => `/batches/${id}`,
    DELETE: (id) => `/batches/${id}`,
  },

  // Student management
  STUDENT: {
    CREATE: '/students',
    GET_ALL: '/students',
    GET_BY_ID: (id) => `/students/${id}`,
    UPDATE: (id) => `/students/${id}`,
    DELETE: (id) => `/students/${id}`,
  },
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    return {
      message: data?.message || `HTTP Error ${status}`,
      status,
      data: data?.data || null,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
      data: null,
    };
  } else {
    // Other errors
    return {
      message: error.message || 'An unexpected error occurred.',
      status: 0,
      data: null,
    };
  }
};
