// API Configuration
// Use environment variable or fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.alleventpictures.com/';

export const API_ENDPOINTS = {
  baseUrl: API_BASE_URL,
  v1: `${API_BASE_URL}/api/v1`,
};

export default API_BASE_URL;
