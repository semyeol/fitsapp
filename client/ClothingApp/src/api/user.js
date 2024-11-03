import apiClient from './api'; // Ensure this points to your configured Axios instance

// Function to create a new user
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/create_user', userData);
    return response.data; // Returns the response from the server
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Function to get all users
/*
export const getUsers = async () => {
  try {
    const response = await apiClient.get('/api/get_users');
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
*/
