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
      
      // If body is FormData, don't set Content-Type header (let browser set it with boundary)
      if (body instanceof FormData) {
        delete config.headers['Content-Type'];
        console.log('FormData detected, removed Content-Type header');
      }
    }
    
    console.log('apiRequest: Making request to:', url);
    console.log('apiRequest: Config:', config);
    console.log('apiRequest: Headers:', config.headers);
    console.log('apiRequest: Body type:', body instanceof FormData ? 'FormData' : typeof body);
    console.log('apiRequest: Body:', body);
    
    const response = await fetch(url, config);
    console.log('apiRequest: Response status:', response.status);
    console.log('apiRequest: Response status text:', response.statusText);
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
    console.error('API Request Error:', error);
    // Re-throw the error so mutation hooks can handle it properly
    throw error;
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

  // Block/Unblock center
  blockCenter: async (id, block) => {
    console.log('Blocking center:', { id, block });
    console.log('Endpoint:', API_ENDPOINTS.CENTER.BLOCK(id));
    console.log('Request body:', JSON.stringify({ block }));
    
    const result = await apiRequest(API_ENDPOINTS.CENTER.BLOCK(id), {
      method: 'POST',
      body: JSON.stringify({ block }),
    });
    
    console.log('Block result:', result);
    return result;
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

  // Block/Unblock admission incharge
  blockIncharge: async (id, block) => {
    try {
      console.log('Blocking incharge:', { id, block });
      console.log('Endpoint:', API_ENDPOINTS.INCHARGE.BLOCK(id));
      console.log('Full URL:', `${API_BASE_URL}${API_ENDPOINTS.INCHARGE.BLOCK(id)}`);
      console.log('Request body:', JSON.stringify({ block }));
      
      const result = await apiRequest(API_ENDPOINTS.INCHARGE.BLOCK(id), {
        method: 'POST',
        body: JSON.stringify({ block }),
      });
      
      console.log('Block result:', result);
      return result;
    } catch (error) {
      console.error('Block incharge error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        endpoint: API_ENDPOINTS.INCHARGE.BLOCK(id),
        fullUrl: `${API_BASE_URL}${API_ENDPOINTS.INCHARGE.BLOCK(id)}`,
        requestBody: { block }
      });
      throw error;
    }
  },
};

// Student Services
export const studentService = {
  createStudent: async (studentData) => {
    console.log('Creating student with data:', studentData);
    
    // Check if we have an image file
    const hasImageFile = studentData instanceof FormData && studentData.has('image');
    
    if (hasImageFile) {
      // FormData already prepared, use as is
      console.log('Using FormData for student creation');
      const result = await apiRequest(API_ENDPOINTS.STUDENT.CREATE, {
        method: 'POST',
        body: studentData,
      });
      console.log('Student creation result:', result);
      return result;
    } else {
      // No image, use regular JSON request
      console.log('Using JSON for student creation');
      const result = await apiRequest(API_ENDPOINTS.STUDENT.CREATE, {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
      console.log('Student creation result:', result);
      return result;
    }
  },

  getStudents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.STUDENT.GET_ALL}?${queryString}` : API_ENDPOINTS.STUDENT.GET_ALL;
    console.log('studentService.getStudents: Making request to:', endpoint);
    console.log('studentService.getStudents: Params:', params);
    const result = await apiRequest(endpoint);
    console.log('studentService.getStudents: Response:', result);
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

  activateStudent: (studentId) => 
    apiRequest(`/students/${studentId}/activate`, {
      method: 'PUT',
    }),
  
  deactivateStudent: (studentId) => 
    apiRequest(`/students/${studentId}/deactivate`, {
      method: 'PUT',
    }),
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

  toggleActive: async (id, active) => {
    return apiRequest(API_ENDPOINTS.COURSES.TOGGLE_ACTIVE(id), {
      method: 'POST',
      body: JSON.stringify({ active }),
    });
  },
};

// Additional Course Services
export const additionalCourseService = {
  createAdditionalCourse: async (courseData) => {
    const result = await apiRequest(API_ENDPOINTS.ADDITIONAL_COURSES.CREATE, {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
    return result;
  },

  getAdditionalCourses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.ADDITIONAL_COURSES.GET_ALL}?${queryString}` : API_ENDPOINTS.ADDITIONAL_COURSES.GET_ALL;
    const result = await apiRequest(endpoint);
    return result;
  },

  getAdditionalCourseById: async (id) => {
    return apiRequest(API_ENDPOINTS.ADDITIONAL_COURSES.GET_BY_ID(id));
  },

  updateAdditionalCourse: async (id, courseData) => {
    return apiRequest(API_ENDPOINTS.ADDITIONAL_COURSES.UPDATE(id), {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  deleteAdditionalCourse: async (id) => {
    return apiRequest(API_ENDPOINTS.ADDITIONAL_COURSES.DELETE(id), {
      method: 'DELETE',
    });
  },

  toggleActive: async (id, active) => {
    return apiRequest(API_ENDPOINTS.ADDITIONAL_COURSES.TOGGLE_ACTIVE(id), {
      method: 'PUT',
      body: JSON.stringify({ active }),
    });
  },

  getAdditionalCoursesByIncharge: async (inchargeId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.ADDITIONAL_COURSES.GET_BY_INCHARGE(inchargeId)}?${queryString}` : API_ENDPOINTS.ADDITIONAL_COURSES.GET_BY_INCHARGE(inchargeId);
    const result = await apiRequest(endpoint);
    return result;
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

  toggleStatus: async (id, isActive) => {
    return apiRequest(API_ENDPOINTS.BATCHES.TOGGLE_STATUS(id), {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },
};

// Collect Fees Services
export const collectFeesService = {
  getStudentsForFeeCollection: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/students-collect-fees?${queryString}` : '/students-collect-fees';
    return apiRequest(endpoint);
  },
  
  collectPayment: async (paymentData) => {
    const formData = new FormData();
    
    // Add required fields
    formData.append('feeId', paymentData.feeId);
    formData.append('amount', paymentData.amount);
    formData.append('paymentMode', paymentData.paymentMode);
    
    // Add optional fields if provided
    if (paymentData.transactionId) {
      formData.append('transactionId', paymentData.transactionId);
    }
    if (paymentData.remarks) {
      formData.append('remarks', paymentData.remarks);
    }
    if (paymentData.paymentDate) {
      formData.append('paymentDate', paymentData.paymentDate);
    }
    if (paymentData.discountCode) {
      formData.append('discountCode', paymentData.discountCode);
    }
    if (paymentData.discountAmount) {
      formData.append('discountAmount', paymentData.discountAmount);
    }
    if (paymentData.fine) {
      formData.append('fine', paymentData.fine);
    }
    if (paymentData.discountFile) {
      formData.append('discountFile', paymentData.discountFile);
    }
    if (paymentData.inchargeCode) {
      formData.append('inchargeCode', paymentData.inchargeCode);
    }
    if (paymentData.collectedBy) {
      formData.append('collectedBy', paymentData.collectedBy);
    }
    if (paymentData.nextPaymentDueDate) {
      formData.append('nextPaymentDueDate', paymentData.nextPaymentDueDate);
    }
    
    return apiRequest('/fees/collect-payment', {
      method: 'POST',
      body: formData
    });
  },
  
  revertPayment: async (revertData) => {
    return apiRequest('/fees/revert-payment', {
      method: 'POST',
      body: JSON.stringify(revertData)
    });
  },
};

// Student Fees Services
export const studentFeesService = {
  getFeesByStudent: async (studentId) => {
    return apiRequest(`/fees-by-student/${studentId}`);
  },
};

// Pending Fees Services
export const pendingFeesService = {
  getPendingFees: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/fees/pending?${queryString}` : '/fees/pending';
    return apiRequest(endpoint);
  },
};

// Fee History Services
export const feeHistoryService = {
  getAllPayments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/fees/all-payments?${queryString}` : '/fees/all-payments';
    return apiRequest(endpoint);
  },
};

// Fee Discount Services
export const feeDiscountService = {
  createDiscount: async (discountData) => {
    return apiRequest('/fees-discounts', {
      method: 'POST',
      body: JSON.stringify(discountData),
    });
  },

  getDiscounts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/fees-discounts?${queryString}` : '/fees-discounts';
    return apiRequest(endpoint);
  },

  getDiscountById: async (id) => {
    return apiRequest(`/fees-discounts/${id}`);
  },

  updateDiscount: async (id, discountData) => {
    return apiRequest(`/fees-discounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(discountData),
    });
  },

  deleteDiscount: async (id) => {
    return apiRequest(`/fees-discounts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Inquiry Services
export const inquiryService = {
  createInquiry: async (inquiryData) => {
    return apiRequest(API_ENDPOINTS.INQUIRIES.CREATE, {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  },

  getInquiries: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `${API_ENDPOINTS.INQUIRIES.GET_ALL}?${queryString}` : API_ENDPOINTS.INQUIRIES.GET_ALL;
    return apiRequest(endpoint);
  },

  deleteInquiry: async (id) => {
    return apiRequest(API_ENDPOINTS.INQUIRIES.DELETE(id), {
      method: 'DELETE',
    });
  },
};

// Expense Services
export const expenseService = {
  createExpense: async (expenseData) => {
    // Check if we have a file to upload
    const hasFile = expenseData instanceof FormData && expenseData.has('file');
    
    if (hasFile) {
      // FormData already prepared, use as is
      return apiRequest('/expenses', {
        method: 'POST',
        body: expenseData,
      });
    } else {
      // No file, use regular JSON request
      return apiRequest('/expenses', {
        method: 'POST',
        body: JSON.stringify(expenseData),
      });
    }
  },

  getExpenses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/expenses?${queryString}` : '/expenses';
    return apiRequest(endpoint);
  },

  getExpenseById: async (id) => {
    return apiRequest(`/expenses/${id}`);
  },

  updateExpense: async (id, expenseData) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expenseData),
    });
  },

  deleteExpense: async (id) => {
    return apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  updateExpenseStatus: async (id, status, paidDate = null) => {
    const body = { status };
    if (paidDate) {
      body.paidDate = paidDate;
    }
    
    return apiRequest(`/expenses/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  toggleExpenseApproval: async (id) => {
    return apiRequest(`/expenses/${id}/toggle-approval`, {
      method: 'PUT',
    });
  },
};

// Logs Services
export const logsService = {
  getLogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/get-logs?${queryString}` : '/get-logs';
    return apiRequest(endpoint);
  },

  getLogById: async (id) => {
    return apiRequest(`/get-logs/${id}`);
  },
};
