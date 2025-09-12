// API Configuration
export const getApiUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production, use production domain
  if (import.meta.env.PROD) {
    return 'https://othentica-app.com';
  }
  
  // In development, use localhost
  return 'http://localhost:5001';
};

export const getApiBaseUrl = () => {
  // If environment variable is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production, use production domain
  if (import.meta.env.PROD) {
    return 'https://othentica-app.com/api';
  }
  
  // In development, use localhost
  return 'http://localhost:5001/api';
};

export const API_URL = getApiUrl();
export const API_BASE_URL = getApiBaseUrl();
