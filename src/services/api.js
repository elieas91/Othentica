// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production (when deployed), API is on subdomain
  if (import.meta.env.PROD) {
    return 'https://othentica-app.com/api';
  }
  
  // In development, use localhost
  return 'http://localhost:5001/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = null;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Get access token from memory (preferred) or localStorage (fallback)
  getAccessToken() {
    return this.accessToken || localStorage.getItem('accessToken');
  }

  // Set access token in memory and localStorage
  setAccessToken(token) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  // Remove access token from memory and localStorage
  removeAccessToken() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAccessToken();
  }

  // Process failed requests queue after token refresh
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Refresh access token using refresh token cookie
  async refreshAccessToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        this.setAccessToken(data.accessToken);
        this.processQueue(null, data.accessToken);
        return data.accessToken;
      } else {
        throw new Error(data.error || 'Token refresh failed');
      }
    } catch (error) {
      this.processQueue(error, null);
      this.removeAccessToken();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Make authenticated requests with automatic token refresh
  async authenticatedRequest(url, options = {}) {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // If token expired, try to refresh it
    if (response.status === 401) {
      const errorData = await response.json();
      if (errorData.code === 'TOKEN_EXPIRED') {
        try {
          const newToken = await this.refreshAccessToken();
          // Retry the original request with new token
          const newHeaders = {
            ...headers,
            'Authorization': `Bearer ${newToken}`
          };
          
          return fetch(url, {
            ...options,
            headers: newHeaders
          });
        } catch {
          // Refresh failed, redirect to login
          this.removeAccessToken();
          window.location.href = '/login';
          throw new Error('Session expired. Please login again.');
        }
      }
    }

    return response;
  }

  // Auth endpoints
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      credentials: 'include', // Include cookies for refresh token
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      this.setAccessToken(data.accessToken);
    }
    
    return { response, data };
  }

  async register(name, email, password) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      // Registration doesn't return tokens, user needs to login
      console.log('Registration successful. Please login.');
    }
    
    return { response, data };
  }

  async logout() {
    try {
      // Call server logout to clear refresh token cookie
      await fetch(`${this.baseURL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local access token
      this.removeAccessToken();
    }
  }

  // User endpoints
  async getProfile() {
    const response = await this.authenticatedRequest(`${this.baseURL}/users/profile`);
    return response.json();
  }

  async updateProfile(userData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/users/profile`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  // Testimonial endpoints
  async getTestimonials() {
    const response = await this.authenticatedRequest(`${this.baseURL}/testimonials`);
    return response.json();
  }

  async getApprovedTestimonials() {
    const response = await fetch(`${this.baseURL}/testimonials/public`);
    return response.json();
  }

  async getTestimonialsByStatus(status) {
    const response = await this.authenticatedRequest(`${this.baseURL}/testimonials/status/${status}`);
    return response.json();
  }

  async getTestimonialById(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/testimonials/${id}`);
    return response.json();
  }

  async createTestimonial(testimonialData) {
    const response = await fetch(`${this.baseURL}/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testimonialData),
    });
    return response.json();
  }

  async updateTestimonial(id, testimonialData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
    return response.json();
  }

  async updateTestimonialStatus(id, status) {
    const response = await this.authenticatedRequest(`${this.baseURL}/testimonials/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  async deleteTestimonial(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/testimonials/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  async getTestimonialsStats() {
    const response = await this.authenticatedRequest(`${this.baseURL}/testimonials/stats`);
    return response.json();
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
