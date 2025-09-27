// API Configuration and Base Setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Mock authentication for development
const MOCK_AUTH = {
  enabled: import.meta.env.VITE_NODE_ENV === 'development' || !import.meta.env.VITE_API_URL, // Enable if in dev or no API URL set
  get users() {
    // Get users from localStorage or use defaults
    const stored = localStorage.getItem('mock_auth_users');
    if (stored) {
      return JSON.parse(stored);
    }
    return [
      {
        id: '1',
        email: 'admin@saralveseva.gov.in',
        phone: '9876543210',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      {
        id: '2', 
        email: 'user@example.com',
        phone: '9876543211',
        password: 'user123',
        firstName: 'Rahul',
        lastName: 'Kumar',
        role: 'user'
      }
    ];
  },
  set users(value) {
    // Save users to localStorage
    localStorage.setItem('mock_auth_users', JSON.stringify(value));
  }
};

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('authToken');
  }

  // Mock authentication helper
  mockAuth(credentials, isLogin = true) {
    if (!MOCK_AUTH.enabled) return null;

    console.log('MockAuth called with:', { credentials, isLogin });
    console.log('Available users:', MOCK_AUTH.users);

    if (isLogin) {
      const user = MOCK_AUTH.users.find(u => 
        (u.email === credentials.identifier || u.phone === credentials.identifier) &&
        u.password === credentials.password
      );
      
      console.log('Looking for user with identifier:', credentials.identifier);
      console.log('Looking for user with password:', credentials.password);
      console.log('Found user:', user);
      
      if (user) {
        const token = `mock_token_${user.id}_${Date.now()}`;
        return {
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
              role: user.role
            }
          }
        };
      }
      throw new Error('Invalid credentials');
    } else {
      // Registration
      const currentUsers = MOCK_AUTH.users;
      const newUser = {
        id: String(currentUsers.length + 1),
        ...credentials,
        role: 'user'
      };
      currentUsers.push(newUser);
      MOCK_AUTH.users = currentUsers; // This will save to localStorage
      const token = `mock_token_${newUser.id}_${Date.now()}`;
      return {
        success: true,
        data: {
          token,
          user: {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role
          }
        }
      };
    }
  }

  async request(endpoint, options = {}) {
    // If mock auth is enabled and it's an auth endpoint, use mock
    if (MOCK_AUTH.enabled && endpoint.startsWith('/auth/')) {
      try {
        if (endpoint === '/auth/login' && options.method === 'POST') {
          const credentials = JSON.parse(options.body);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
          return this.mockAuth(credentials, true);
        }
        if (endpoint === '/auth/register' && options.method === 'POST') {
          const userData = JSON.parse(options.body);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
          return this.mockAuth(userData, false);
        }
        if (endpoint === '/users/profile' && options.method === 'GET') {
          const token = this.getToken();
          console.log('Profile endpoint - token:', token);
          if (token && token.startsWith('mock_token_')) {
            const tokenParts = token.split('_');
            const userId = tokenParts[2]; // mock_token_ID_timestamp
            console.log('Profile endpoint - userId extracted:', userId);
            console.log('Profile endpoint - available users:', MOCK_AUTH.users);
            const user = MOCK_AUTH.users.find(u => u.id === userId);
            console.log('Profile endpoint - found user:', user);
            if (user) {
              return {
                success: true,
                data: {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phone: user.phone,
                  role: user.role
                }
              };
            }
          }
          console.log('Profile endpoint - throwing Unauthorized error');
          throw new Error('Unauthorized');
        }
        if (endpoint === '/debug/users' && options.method === 'GET') {
          // Debug endpoint to check what users are available
          return {
            success: true,
            data: MOCK_AUTH.users.map(u => ({
              id: u.id,
              email: u.email,
              firstName: u.firstName,
              lastName: u.lastName,
              role: u.role
            }))
          };
        }
      } catch (error) {
        throw error;
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle auth errors
        if (response.status === 401) {
          this.setToken(null);
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}) {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('file', file);

    // Add additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const config = {
      method: 'POST',
      headers: {},
      body: formData,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export specific API functions
export const api = {
  // Authentication
  auth: {
    register: (data) => apiClient.post('/auth/register', data),
    login: (data) => apiClient.post('/auth/login', data),
    logout: () => apiClient.post('/auth/logout'),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (data) => apiClient.post('/auth/reset-password', data),
    verifyOTP: (data) => apiClient.post('/auth/verify-otp', data),
  },

  // User Management
  users: {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data) => apiClient.put('/users/profile', data),
    uploadAvatar: (file) => apiClient.uploadFile('/users/avatar', file),
    getBookmarks: () => apiClient.get('/users/bookmarks'),
    addBookmark: (data) => apiClient.post('/users/bookmarks', data),
    removeBookmark: (id) => apiClient.delete(`/users/bookmarks/${id}`),
    updatePreferences: (data) => apiClient.put('/users/preferences', data),
  },

  // Schemes
  schemes: {
    getAll: (params) => apiClient.get('/schemes', params),
    getById: (id) => apiClient.get(`/schemes/${id}`),
    getRecommended: () => apiClient.get('/schemes/recommend'),
    checkEligibility: (id) => apiClient.post(`/schemes/${id}/eligibility`),
  },

  // Events
  events: {
    getAll: (params) => apiClient.get('/events', params),
    getById: (id) => apiClient.get(`/events/${id}`),
    register: (id) => apiClient.post(`/events/${id}/register`),
    unregister: (id) => apiClient.delete(`/events/${id}/register`),
    getRegistered: () => apiClient.get('/events/registered'),
  },

  // Complaints
  complaints: {
    getAll: (params) => apiClient.get('/complaints', params),
    getById: (id) => apiClient.get(`/complaints/${id}`),
    create: (data) => apiClient.post('/complaints', data),
    update: (id, data) => apiClient.put(`/complaints/${id}`, data),
    uploadEvidence: (id, file) => apiClient.uploadFile(`/complaints/${id}/evidence`, file),
  },

  // Documents
  documents: {
    getAll: () => apiClient.get('/documents'),
    upload: (file, documentType) => apiClient.uploadFile('/documents/upload', file, { documentType }),
    getVerificationStatus: (id) => apiClient.get(`/documents/${id}/status`),
    download: (id) => apiClient.get(`/documents/${id}/download`),
  },

  // Locations
  locations: {
    getAll: (params) => apiClient.get('/locations', params),
    getNearby: (lat, lng, radius) => apiClient.get('/locations/nearby', { lat, lng, radius }),
    getById: (id) => apiClient.get(`/locations/${id}`),
  },

  // Notifications
  notifications: {
    getAll: () => apiClient.get('/notifications'),
    markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.put('/notifications/read-all'),
    getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  },

  // Dashboard
  dashboard: {
    getStats: () => apiClient.get('/dashboard/stats'),
    getRecentActivity: () => apiClient.get('/dashboard/recent'),
  },

  // Chatbot
  chatbot: {
    sendMessage: (message) => apiClient.post('/chatbot', { message }),
  },
};

// Debug function - you can call this from browser console
window.debugAuth = {
  getUsers: () => {
    const stored = localStorage.getItem('mock_auth_users');
    console.log('Raw localStorage data:', stored);
    if (stored) {
      const users = JSON.parse(stored);
      console.log('Parsed users:', users);
      return users;
    }
    console.log('No users in localStorage, returning defaults');
    // Access the getter directly
    const defaultUsers = [
      {
        id: '1',
        email: 'admin@saralveseva.gov.in',
        phone: '9876543210',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      {
        id: '2', 
        email: 'user@example.com',
        phone: '9876543211',
        password: 'user123',
        firstName: 'Rahul',
        lastName: 'Kumar',
        role: 'user'
      }
    ];
    return defaultUsers;
  },
  getCurrentToken: () => {
    const token = localStorage.getItem('authToken');
    console.log('Current auth token:', token);
    return token;
  },
  parseToken: (token) => {
    if (token && token.startsWith('mock_token_')) {
      const parts = token.split('_');
      const result = {
        type: parts[0],
        prefix: parts[1],
        userId: parts[2],
        timestamp: parts[3]
      };
      console.log('Parsed token:', result);
      return result;
    }
    return null;
  },
  testTokenValidation: () => {
    const token = window.debugAuth.getCurrentToken();
    if (!token) {
      console.log('No token found');
      return false;
    }
    const parsed = window.debugAuth.parseToken(token);
    if (!parsed) {
      console.log('Invalid token format');
      return false;
    }
    const users = window.debugAuth.getUsers();
    const user = users.find(u => u.id === parsed.userId);
    console.log('Token validation result:', user ? 'VALID' : 'INVALID');
    console.log('User found:', user);
    return !!user;
  },
  clearUsers: () => {
    localStorage.removeItem('mock_auth_users');
    console.log('Cleared user data');
  },
  clearToken: () => {
    localStorage.removeItem('authToken');
    console.log('Cleared auth token');
  },
  clearAll: () => {
    window.debugAuth.clearUsers();
    window.debugAuth.clearToken();
    console.log('Cleared all auth data');
  },
  testLogin: (email, password) => {
    const users = window.debugAuth.getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    console.log('Test login result:', found);
    return found;
  }
};

// Utility functions
export const setAuthToken = (token) => {
  apiClient.setToken(token);
};

export const clearAuthToken = () => {
  apiClient.setToken(null);
};

export const isAuthenticated = () => {
  return !!apiClient.getToken();
};