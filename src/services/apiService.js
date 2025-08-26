import { API_BASE_URL, API_ENDPOINTS, getDefaultHeaders, handleApiError } from '../utils/apiConfig';

const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const { body, ...fetchOptions } = options;
    
    const config = {
      headers: getDefaultHeaders(),
      ...fetchOptions,
    };
    
    // Add body if provided
    if (body) {
      config.body = body;
    }
    
    console.log('apiRequest: Making request to:', url);
    console.log('apiRequest: Config:', config);
    
    const response = await fetch(url, config);
    console.log('apiRequest: Response status:', response.status);
    console.log('apiRequest: Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('apiRequest: Response data:', data);
    

    
    // Check if the API response indicates an error
    if (!response.ok) {
      throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }
    
    // Check if the response has an explicit success: false flag
    if (data && data.success === false) {
      throw new Error(data?.message || 'Operation failed');
    }
    
    // Return the data directly since the API already provides the proper structure
    return data;
  } catch (error) {
    const errorInfo = handleApiError(error);
    return { success: false, error: errorInfo };
  }
};

// Helper to normalize auth responses to a consistent shape
const normalizeAuthResponse = (raw) => {
  if (!raw) {
    return { success: false, error: { message: 'Empty response', status: 0, data: null } };
  }
  // If API already uses { success, data } shape, ensure data has token/user
  if (typeof raw.success === 'boolean') {
    if (raw.success) {
      const token = raw?.data?.token ?? raw?.token;
      const user = raw?.data?.user ?? raw?.user;
      return {
        ...raw,
        data: { token, user },
      };
    }
    return raw;
  }

  // Many endpoints return { message, role, token, user } without success flag
  const token = raw?.data?.token ?? raw?.token;
  const user = raw?.data?.user ?? raw?.user;
  const role = raw?.role;
  const message = raw?.message || 'Login successful';

  if (token || user) {
    return { success: true, message, role, data: { token, user } };
  }

  // Fallback: treat as failure with message if provided
  return { success: false, error: { message: raw?.message || 'Login failed', status: 0, data: raw } };
};

// Authentication Services
export const authService = {
  // Admin login
  adminLogin: async (credentials) => {
    const raw = await apiRequest(API_ENDPOINTS.ADMIN_LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return normalizeAuthResponse(raw);
  },

  // Incharge login
  inchargeLogin: async (credentials) => {
    const raw = await apiRequest(API_ENDPOINTS.INCHARGE_LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return normalizeAuthResponse(raw);
  },

  // Center login
  centerLogin: async (credentials) => {
    const raw = await apiRequest(API_ENDPOINTS.CENTER_LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return normalizeAuthResponse(raw);
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get current user data
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
};

// Center Services
export const centerService = {
  createCenter: async (centerData) => {
    return apiRequest(API_ENDPOINTS.CENTER.CREATE, {
      method: 'POST',
      body: JSON.stringify(centerData),
    });
  },

  getCenters: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.CENTER.GET_ALL}?${queryString}` : API_ENDPOINTS.CENTER.GET_ALL;
    console.log('centerService.getCenters: Making request to:', endpoint);
    console.log('centerService.getCenters: Params:', params);
    const result = await apiRequest(endpoint);
    console.log('centerService.getCenters: Response:', result);
    return result;
  },

  getCenterById: async (id) => {
    return apiRequest(API_ENDPOINTS.CENTER.GET_BY_ID(id));
  },

  updateCenter: async (id, centerData) => {
    return apiRequest(API_ENDPOINTS.CENTER.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(centerData),
    });
  },

  deleteCenter: async (id) => {
    return apiRequest(API_ENDPOINTS.CENTER.DELETE(id), {
      method: 'DELETE',
    });
  },
};

// Admission Incharge Services
export const inchargeService = {
  createIncharge: async (inchargeData) => {
    return apiRequest(API_ENDPOINTS.INCHARGE.CREATE, {
      method: 'POST',
      body: JSON.stringify(inchargeData),
    });
  },

  getIncharges: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.INCHARGE.GET_ALL}?${queryString}` : API_ENDPOINTS.INCHARGE.GET_ALL;
    const result = await apiRequest(endpoint);
    return result;
  },

  getInchargeById: async (id) => {
    return apiRequest(API_ENDPOINTS.INCHARGE.GET_BY_ID(id));
  },

  updateIncharge: async (id, inchargeData) => {
    return apiRequest(API_ENDPOINTS.INCHARGE.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(inchargeData),
    });
  },

  deleteIncharge: async (id) => {
    return apiRequest(API_ENDPOINTS.INCHARGE.DELETE(id), {
      method: 'DELETE',
    });
  },

  // Check admission incharge by code
  checkInchargeByCode: async (inchargeCode) => {
    return apiRequest('/check-admissionIncharge', {
      method: 'POST',
      body: JSON.stringify({ incharge_code: inchargeCode }),
    });
  },
};

// Student Services
export const studentService = {
  createStudent: async (studentData) => {

    
    // Handle file upload for image
    if (studentData.image) {
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(studentData).forEach(key => {
        if (key !== 'image') {
          if (typeof studentData[key] === 'object') {
            formData.append(key, JSON.stringify(studentData[key]));
          } else {
            formData.append(key, studentData[key]);
          }
        }
      });
      
      // Add image file
      if (studentData.image instanceof File) {
        formData.append('image', studentData.image);
      }
      
      const result = await apiRequest(API_ENDPOINTS.STUDENT.CREATE, {
        method: 'POST',
        body: formData,
      });
      console.log('Student creation result:', result);
      return result;
    } else {
      // No image, use regular JSON request
      const result = await apiRequest(API_ENDPOINTS.STUDENT.CREATE, {
        method: 'POST',
        body: JSON.stringify(studentData),
      });

      return result;
    }
  },

  getStudents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.STUDENT.GET_ALL}?${queryString}` : API_ENDPOINTS.STUDENT.GET_ALL;
    const result = await apiRequest(endpoint);
    return result;
  },

  getStudentById: async (id) => {
    return apiRequest(API_ENDPOINTS.STUDENT.GET_BY_ID(id));
  },

  updateStudent: async (id, studentData) => {
    return apiRequest(API_ENDPOINTS.STUDENT.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },

  deleteStudent: async (id) => {
    return apiRequest(API_ENDPOINTS.STUDENT.DELETE(id), {
      method: 'DELETE',
    });
  },
};

// Course Services
export const courseService = {
  createCourse: async (courseData) => {

    const result = await apiRequest(API_ENDPOINTS.COURSES.CREATE, {
      method: 'POST',
      body: JSON.stringify(courseData),
    });

    return result;
  },

  getCourses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.COURSES.GET_ALL}?${queryString}` : API_ENDPOINTS.COURSES.GET_ALL;
    const result = await apiRequest(endpoint);
    return result;
  },

  getCourseById: async (id) => {
    return apiRequest(API_ENDPOINTS.COURSES.GET_BY_ID(id));
  },

  updateCourse: async (id, courseData) => {
    return apiRequest(API_ENDPOINTS.COURSES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  deleteCourse: async (id) => {
    return apiRequest(API_ENDPOINTS.COURSES.DELETE(id), {
      method: 'DELETE',
    });
  },
};

// Batch Services
export const batchService = {
  createBatch: async (batchData) => {
    return apiRequest(API_ENDPOINTS.BATCHES.CREATE, {
      method: 'POST',
      body: JSON.stringify(batchData),
    });
  },

  getBatches: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.BATCHES.GET_ALL}?${queryString}` : API_ENDPOINTS.BATCHES.GET_ALL;
    return apiRequest(endpoint);
  },

  getBatchById: async (id) => {
    return apiRequest(API_ENDPOINTS.BATCHES.GET_BY_ID(id));
  },

  updateBatch: async (id, batchData) => {
    return apiRequest(API_ENDPOINTS.BATCHES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(batchData),
    });
  },

  deleteBatch: async (id) => {
    return apiRequest(API_ENDPOINTS.BATCHES.DELETE(id), {
      method: 'DELETE',
    });
  },
};
