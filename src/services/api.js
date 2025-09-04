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
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token from localStorage
  removeToken() {
    localStorage.removeItem('token');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Make authenticated requests
  async authenticatedRequest(url, options = {}) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    return fetch(url, {
      ...options,
      headers
    });
  }

  // Auth endpoints
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      this.setToken(data.token);
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
      this.setToken(data.token);
    }
    
    return { response, data };
  }

  async logout() {
    this.removeToken();
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
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
