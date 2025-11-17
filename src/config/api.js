// API Configuration
const isProd = import.meta.env.PROD === true;
const DEFAULT_API_URL = isProd ? 'https://othentica-app.com' : 'http://localhost:5001';
const DEFAULT_API_BASE_URL = `${DEFAULT_API_URL}/api`;

export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || DEFAULT_API_URL;
};

export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
};

export const API_URL = getApiUrl();
export const API_BASE_URL = getApiBaseUrl();

// Normalize any stored/uploaded image URL to the correct host for the current env
// - Accepts absolute URLs, "/uploads/..." paths, or bare filenames
// - Rewrites any localhost/127.* absolute URL to the current API host
// - If only a filename is provided, constructs: `${API_URL}/uploads/${folder}/${filename}`
export const normalizeUploadUrl = (maybeUrl, folderName) => {
  if (!maybeUrl) return null;

  const apiUrl = getApiUrl();

  // Already absolute URL
  if (typeof maybeUrl === 'string' && maybeUrl.startsWith('http')) {
    // Rewrite localhost/127.* to current API host
    if (maybeUrl.includes('localhost') || maybeUrl.includes('127.0.0.1')) {
      const filename = maybeUrl.split('/').pop();
      return `${apiUrl}/uploads/${folderName}/${filename}`;
    }
    // Keep other absolute URLs as-is
    return maybeUrl;
  }

  // If it includes a /uploads/ path, normalize host and keep path
  if (typeof maybeUrl === 'string' && maybeUrl.includes('/uploads/')) {
    const pathAfterUploads = maybeUrl.split('/uploads/')[1];
    return `${apiUrl}/uploads/${pathAfterUploads}`;
  }

  // Treat as a filename
  const filename = String(maybeUrl).split('/').pop();
  return `${apiUrl}/uploads/${folderName}/${filename}`;
};
