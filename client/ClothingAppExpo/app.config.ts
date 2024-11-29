export default {
  name: 'ClothingApp',
  version: '1.0.0',
  extra: {
    apiBaseUrl: process.env.API_BASE_URL || 'http://192.168.0.21:5000',  // Removed /api since it's in the routes
    isDevelopment: process.env.NODE_ENV === 'development',
  },
};
