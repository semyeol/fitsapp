import apiClient from './api'; // Ensure this points to your configured Axios instance

// Function to create a new user
export const createUser = async (userData) => {
  try {
    console.log("sending user data to server:", userData); // log request
    const response = await apiClient.post('/create_user', userData);
    console.log("user created successfully:", response.data); // log response
    return response.data; // Returns the response from the server
  } catch (error) {
    if (error.response) {
      // request was made and server responded with a status code that falls out of the range of 2xx
      console.error("error response data:", error.response.data);
      console.error("error response status:", error.response.status);
      console.error("error response headers:", error.response.headers);
      // console.error("Error creating user:", error.response.data);
    } else if (error.request) {
      // request was made but no response was received
      console.error("error request:", error.request);
    } else {
      // something happened in setting up the request that triggered an error
      console.error("Error creating user:", error.message);
    }
    // console.error("Error creating user:", error);
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
