import { API_BASE_URL } from '../config/api';

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

    // Check if body is FormData to avoid setting Content-Type header
    const isFormData = options.body instanceof FormData;
    
    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            'Authorization': `Bearer ${newToken}`,
            ...options.headers
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
  async getTestimonials(category = null) {
    const url = category 
      ? `${this.baseURL}/testimonials?category=${category}`
      : `${this.baseURL}/testimonials`;
    const response = await this.authenticatedRequest(url);
    return response.json();
  }

  async getApprovedTestimonials(category = null) {
    const url = category 
      ? `${this.baseURL}/testimonials/public?category=${category}`
      : `${this.baseURL}/testimonials/public`;
    const response = await fetch(url);
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
    // Check if testimonialData contains a file (FormData)
    const isFormData = testimonialData instanceof FormData;
    
    const response = await fetch(`${this.baseURL}/testimonials`, {
      method: 'POST',
      headers: isFormData ? {} : {
        'Content-Type': 'application/json',
      },
      body: isFormData ? testimonialData : JSON.stringify(testimonialData),
    });
    return response.json();
  }

  async updateTestimonial(id, testimonialData) {
    // Check if testimonialData contains a file (FormData)
    const isFormData = testimonialData instanceof FormData;
    
    const response = await this.authenticatedRequest(`${this.baseURL}/testimonials/${id}`, {
      method: 'PUT',
      headers: isFormData ? {} : {
        'Content-Type': 'application/json',
      },
      body: isFormData ? testimonialData : JSON.stringify(testimonialData),
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

  async getTestimonialsCountByCategory() {
    const response = await fetch(`${this.baseURL}/testimonials/counts`);
    return response.json();
  }

  // Opt-in endpoints
  async optIn(formData) {
    const response = await fetch(`${this.baseURL}/optin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    return { response, data };
  }

  // Admin opt-in management endpoints
  async getAllOptinUsers() {
    const response = await this.authenticatedRequest(`${this.baseURL}/optin`);
    return response.json();
  }

  async getOptinUserById(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/optin/${id}`);
    return response.json();
  }

  async getOptinUsersByCountry(country) {
    const response = await this.authenticatedRequest(`${this.baseURL}/optin/country/${country}`);
    return response.json();
  }

  async updateOptinUser(id, userData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/optin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  async deleteOptinUser(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/optin/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  async getOptinStats() {
    const response = await this.authenticatedRequest(`${this.baseURL}/optin/stats`);
    return response.json();
  }

  async checkEmailExists(email) {
    const response = await fetch(`${this.baseURL}/optin/check-email/${email}`);
    return response.json();
  }

  async getOptinCount() {
    const response = await fetch(`${this.baseURL}/optin/count`);
    return response.json();
  }

  // Blog endpoints
  async getAllBlogs() {
    const response = await fetch(`${this.baseURL}/blogs`);
    return response.json();
  }

  async getBlogById(id) {
    const response = await fetch(`${this.baseURL}/blogs/${id}`);
    return response.json();
  }

  async createBlog(blogData) {
    // Check if blogData contains a file (FormData)
    const isFormData = blogData instanceof FormData;
    
    const response = await this.authenticatedRequest(`${this.baseURL}/blogs`, {
      method: 'POST',
      body: isFormData ? blogData : JSON.stringify(blogData),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    });
    return response.json();
  }

  async updateBlog(id, blogData) {
    // Check if blogData contains a file (FormData)
    const isFormData = blogData instanceof FormData;
    
    const response = await this.authenticatedRequest(`${this.baseURL}/blogs/${id}`, {
      method: 'PUT',
      body: isFormData ? blogData : JSON.stringify(blogData),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    });
    return response.json();
  }

  async deleteBlog(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/blogs/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Content Management endpoints
  // Homepage Sections
  async getHomepageSections() {
    const response = await fetch(`${this.baseURL}/content/homepage-sections`);
    return response.json();
  }

  async getHomepageSectionByKey(sectionKey) {
    const response = await fetch(`${this.baseURL}/content/homepage-sections/${sectionKey}`);
    return response.json();
  }

  // About Page
  async getAboutPage() {
    const response = await fetch(`${this.baseURL}/content/about`);
    return response.json();
  }

  async upsertAboutPage(formData) {
    const token = this.getToken();
    const response = await fetch(`${this.baseURL}/content/about`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    return response.json();
  }

  // About Sections (by section_key)
  async getAboutSectionByKey(sectionKey) {
    const response = await fetch(`${this.baseURL}/content/about-sections/${sectionKey}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { success: false, status: response.status, message: 'Non-JSON response' };
    }
    const data = await response.json();
    return data;
  }

  async upsertAboutSection(formData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/about-sections`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  async upsertHomepageSection(sectionData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/homepage-sections`, {
      method: 'POST',
      body: sectionData, // Send FormData directly, don't stringify
    });
    return response.json();
  }

  // Services
  async getServices() {
    const response = await fetch(`${this.baseURL}/content/services`);
    return response.json();
  }

  async getServiceById(id) {
    const response = await fetch(`${this.baseURL}/content/services/${id}`);
    return response.json();
  }

  async createService(serviceData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/services`, {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
    return response.json();
  }

  async updateService(id, serviceData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
    return response.json();
  }

  async deleteService(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/services/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Clients
  async getClients() {
    const response = await fetch(`${this.baseURL}/content/clients`);
    return response.json();
  }

  async createClient(clientData) {
    // Check if there's a file upload
    const hasFile = clientData.logo instanceof File;
    
    if (hasFile) {
      // If there's a file, send as FormData
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(clientData).forEach(key => {
        if (clientData[key] !== null && clientData[key] !== undefined) {
          formData.append(key, clientData[key]);
        }
      });

      const response = await this.authenticatedRequest(`${this.baseURL}/content/clients`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    } else {
      // If no file, send as JSON
      const response = await this.authenticatedRequest(`${this.baseURL}/content/clients`, {
        method: 'POST',
        body: JSON.stringify(clientData),
      });
      return response.json();
    }
  }

  async updateClient(id, clientData) {
    // Check if there's a file upload
    const hasFile = clientData.logo instanceof File;
    
    if (hasFile) {
      // If there's a file, send as FormData
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(clientData).forEach(key => {
        if (clientData[key] !== null && clientData[key] !== undefined) {
          formData.append(key, clientData[key]);
        }
      });

      const response = await this.authenticatedRequest(`${this.baseURL}/content/clients/${id}`, {
        method: 'PUT',
        body: formData,
      });
      return response.json();
    } else {
      // If no file, send as JSON
      const response = await this.authenticatedRequest(`${this.baseURL}/content/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(clientData),
      });
      return response.json();
    }
  }

  async deleteClient(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/clients/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Clients Management (Admin)
  async getAllClientsAdmin() {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/clients`, {
      method: 'GET',
    });
    return response.json();
  }

  async getClientByIdAdmin(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/clients/${id}`, {
      method: 'GET',
    });
    return response.json();
  }

  async createClientAdmin(clientData) {
    // Check if there's a file upload
    const hasFile = clientData.logo instanceof File;
    
    if (hasFile) {
      // If there's a file, send as FormData
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(clientData).forEach(key => {
        if (clientData[key] !== null && clientData[key] !== undefined) {
          formData.append(key, clientData[key]);
        }
      });

      const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/clients`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    } else {
      // If no file, send as JSON
      const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/clients`, {
        method: 'POST',
        body: JSON.stringify(clientData),
      });
      return response.json();
    }
  }

  async updateClientAdmin(id, clientData) {
    // Check if there's a file upload
    const hasFile = clientData.logo instanceof File;
    
    if (hasFile) {
      // If there's a file, send as FormData
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(clientData).forEach(key => {
        if (clientData[key] !== null && clientData[key] !== undefined) {
          formData.append(key, clientData[key]);
        }
      });

      const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/clients/${id}`, {
        method: 'PUT',
        body: formData,
      });
      return response.json();
    } else {
      // If no file, send as JSON
      const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(clientData),
      });
      return response.json();
    }
  }

  async deleteClientAdmin(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/clients/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // App Features
  async getAppFeatures() {
    const response = await fetch(`${this.baseURL}/content/app-features`);
    return response.json();
  }

  async createAppFeature(featureData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/app-features`, {
      method: 'POST',
      body: JSON.stringify(featureData),
    });
    return response.json();
  }

  async updateAppFeature(id, featureData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/app-features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(featureData),
    });
    return response.json();
  }

  async deleteAppFeature(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/app-features/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // App Benefits
  async getAppBenefits() {
    const response = await fetch(`${this.baseURL}/content/app-benefits`);
    return response.json();
  }

  async createAppBenefit(benefitData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/app-benefits`, {
      method: 'POST',
      body: JSON.stringify(benefitData),
    });
    return response.json();
  }

  async updateAppBenefit(id, benefitData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/app-benefits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(benefitData),
    });
    return response.json();
  }

  async deleteAppBenefit(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/app-benefits/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Security Features
  async getSecurityFeatures() {
    const response = await fetch(`${this.baseURL}/content/security-features`);
    return response.json();
  }

  async createSecurityFeature(featureData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/security-features`, {
      method: 'POST',
      body: JSON.stringify(featureData),
    });
    return response.json();
  }

  async updateSecurityFeature(id, featureData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/security-features/${id}`, {
      method: 'PUT',
      body: JSON.stringify(featureData),
    });
    return response.json();
  }

  async deleteSecurityFeature(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/security-features/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Mobile Showcase
  async getMobileShowcaseItems() {
    const response = await fetch(`${this.baseURL}/content/mobile-showcase`);
    return response.json();
  }

  async createMobileShowcaseItem(itemData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/mobile-showcase`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
    return response.json();
  }

  async updateMobileShowcaseItem(id, itemData) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/mobile-showcase/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
    return response.json();
  }

  async deleteMobileShowcaseItem(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/mobile-showcase/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Mobile Showcase Images
  async getMobileShowcaseImages() {
    const response = await fetch(`${this.baseURL}/content/mobile-showcase-images`);
    return response.json();
  }

  async getAllMobileShowcaseImages() {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/mobile-showcase-images`, {
      method: 'GET',
    });
    return response.json();
  }

  async getMobileShowcaseImageById(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/mobile-showcase-images/${id}`, {
      method: 'GET',
    });
    return response.json();
  }

  async createMobileShowcaseImage(imageData) {
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(imageData).forEach(key => {
      if (imageData[key] !== null && imageData[key] !== undefined) {
        // Convert boolean to string for FormData
        const value = typeof imageData[key] === 'boolean' ? imageData[key].toString() : imageData[key];
        formData.append(key, value);
      }
    });

    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/mobile-showcase-images`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }

  async updateMobileShowcaseImage(id, imageData) {
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(imageData).forEach(key => {
      if (imageData[key] !== null && imageData[key] !== undefined) {
        // Convert boolean to string for FormData
        const value = typeof imageData[key] === 'boolean' ? imageData[key].toString() : imageData[key];
        formData.append(key, value);
      }
    });

    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/mobile-showcase-images/${id}`, {
      method: 'PUT',
      body: formData
    });
    return response.json();
  }

  async deleteMobileShowcaseImage(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/mobile-showcase-images/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  async getCardData() {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/card-data`, {
      method: 'GET',
    });
    return response.json();
  }

  // Services Management (Admin)
  async getAllServicesAdmin() {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services`, {
      method: 'GET',
    });
    return response.json();
  }

  // Services Banner Images (public)
  async getServicesBannerImages() {
    const response = await fetch(`${this.baseURL}/content/services-banner-images`);
    return response.json();
  }

  // Services Banner Images (admin)
  async getAllServicesBannerImagesAdmin() {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services-banner-images`, { method: 'GET' });
    return response.json();
  }
  async getServicesBannerImageByIdAdmin(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services-banner-images/${id}`, { method: 'GET' });
    return response.json();
  }
  async createServicesBannerImageAdmin(imageData) {
    const formData = new FormData();
    Object.keys(imageData).forEach(key => {
      if (imageData[key] !== null && imageData[key] !== undefined) {
        formData.append(key, imageData[key]);
      }
    });
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services-banner-images`, { method: 'POST', body: formData });
    return response.json();
  }
  async updateServicesBannerImageAdmin(id, imageData) {
    const formData = new FormData();
    Object.keys(imageData).forEach(key => {
      if (imageData[key] !== null && imageData[key] !== undefined) {
        formData.append(key, imageData[key]);
      }
    });
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services-banner-images/${id}`, { method: 'PUT', body: formData });
    return response.json();
  }
  async deleteServicesBannerImageAdmin(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services-banner-images/${id}`, { method: 'DELETE' });
    return response.json();
  }

  async getServiceByIdAdmin(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services/${id}`, {
      method: 'GET',
    });
    return response.json();
  }

  async createServiceAdmin(serviceData) {
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(serviceData).forEach(key => {
      if (serviceData[key] !== null && serviceData[key] !== undefined) {
        if (key.includes('_bullet_points') && Array.isArray(serviceData[key])) {
          formData.append(key, JSON.stringify(serviceData[key]));
        } else {
          formData.append(key, serviceData[key]);
        }
      }
    });

    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  async updateServiceAdmin(id, serviceData) {
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(serviceData).forEach(key => {
      if (serviceData[key] !== null && serviceData[key] !== undefined) {
        if (key.includes('_bullet_points') && Array.isArray(serviceData[key])) {
          formData.append(key, JSON.stringify(serviceData[key]));
        } else {
          formData.append(key, serviceData[key]);
        }
      }
    });

    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services/${id}`, {
      method: 'PUT',
      body: formData,
    });
    return response.json();
  }

  async deleteServiceAdmin(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/services/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Security Features Management (Admin)
  async getAllSecurityFeaturesAdmin() {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/security-features`, {
      method: 'GET',
    });
    return response.json();
  }

  async getSecurityFeatureByIdAdmin(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/security-features/${id}`, {
      method: 'GET',
    });
    return response.json();
  }

  async createSecurityFeatureAdmin(featureData) {
    // Check if there's a file upload
    const hasFile = featureData.icon instanceof File;
    
    if (hasFile) {
      // If there's a file, send as FormData
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(featureData).forEach(key => {
        if (featureData[key] !== null && featureData[key] !== undefined) {
          formData.append(key, featureData[key]);
        }
      });

      const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/security-features`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    } else {
      // If no file, send as JSON
      const jsonData = { ...featureData };
      delete jsonData.icon; // Remove the null icon field

      const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/security-features`, {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.json();
    }
  }

  async updateSecurityFeatureAdmin(id, featureData) {
    // Check if there's a file upload
    const hasFile = featureData.icon instanceof File;
    
    if (hasFile) {
      // If there's a file, send as FormData
      const formData = new FormData();
      
      // Append all form fields
      Object.keys(featureData).forEach(key => {
        if (featureData[key] !== null && featureData[key] !== undefined) {
          formData.append(key, featureData[key]);
        }
      });

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/security-features/${id}`, {
        method: 'PUT',
        body: formData,
      });
      return response.json();
    } else {
      // If no file, send as JSON
      const jsonData = { ...featureData };
      delete jsonData.icon; // Remove the null icon field
      
      console.log('JSON data contents:', jsonData);

      const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/security-features/${id}`, {
        method: 'PUT',
        body: JSON.stringify(jsonData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.json();
    }
  }

  async deleteSecurityFeatureAdmin(id) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/admin/security-features/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Content Analytics
  async trackContentEvent(sectionKey, contentId, eventType) {
    const response = await fetch(`${this.baseURL}/content/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sectionKey, contentId, eventType }),
    });
    return response.json();
  }

  async getSectionAnalytics(sectionKey, days = 30) {
    const response = await this.authenticatedRequest(`${this.baseURL}/content/analytics/${sectionKey}?days=${days}`);
    return response.json();
  }

  // Mobile Showcase Card API methods
  async getMobileShowcaseCards() {
    try {
      const response = await fetch(`${this.baseURL}/mobile-showcase-cards`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching mobile showcase cards:', error);
      throw error;
    }
  }

  async getMobileShowcaseCardById(id) {
    try {
      const response = await fetch(`${this.baseURL}/mobile-showcase-cards/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching mobile showcase card:', error);
      throw error;
    }
  }

  async getFirstMobileShowcaseCard() {
    try {
      const response = await fetch(`${this.baseURL}/mobile-showcase-cards/first`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching first mobile showcase card:', error);
      throw error;
    }
  }

  async createMobileShowcaseCard(data) {
    try {
      const response = await this.authenticatedRequest(`${this.baseURL}/mobile-showcase-cards`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating mobile showcase card:', error);
      throw error;
    }
  }

  async updateMobileShowcaseCard(id, data) {
    try {
      const response = await this.authenticatedRequest(`${this.baseURL}/mobile-showcase-cards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating mobile showcase card:', error);
      throw error;
    }
  }

  async deleteMobileShowcaseCard(id) {
    try {
      const response = await this.authenticatedRequest(`${this.baseURL}/mobile-showcase-cards/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting mobile showcase card:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
