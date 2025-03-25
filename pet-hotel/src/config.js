// API configuration for different environments
const config = {
  // Development API URL (local)
  development: {
    apiUrl: 'http://localhost:5001'
  },
  // Production API URL (Render.com deployed backend)
  production: {
    apiUrl: 'https://baguio-pet-boarding-api.onrender.com'
  }
};

// Determine current environment
const environment = process.env.NODE_ENV || 'development';

// Export the API URL based on current environment
export const API_URL = config[environment].apiUrl;