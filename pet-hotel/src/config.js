// API configuration
const config = {
  // Local development API URL
  apiUrl: 'http://localhost:5001',
  // Production API URL (Render.com deployed backend)
  productionApiUrl: 'https://baguio-pet-boarding-api.onrender.com'
};

// Export the API URL based on environment
// When deployed on GitHub Pages, use the production URL
// Otherwise, use the local development URL
const isProduction = window.location.hostname !== 'localhost';
export const API_URL = isProduction ? config.productionApiUrl : config.apiUrl;