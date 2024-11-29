import apiClient from './api'; // Ensure this points to your configured Axios instance

interface UserData {
  email: string;
  password: string;
  username: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface PasswordData {
  token: string;
  password: string;
}

// Function to create a new user
export const createUser = async (userData: UserData) => {
  try {
    console.log("sending user data to server:", userData); // log request
    const response = await apiClient.post('/user/create_user', userData);  // Updated path
    console.log("user created successfully:", response.data); // log response
    return response.data; // Returns the response from the server
  } catch (error: any) {
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

export const verifyUser = async (credentials: { email: string, code: string }) => {
  try {
    const response = await apiClient.post('/user/verify_user', credentials);  // Updated path
    return response.data;
  } catch (error: any) {
    console.error("Error verifying user:", error);
    throw error;
  }
}

export const resendVerificationEmail = async (email: string) => {
  try {
    const response = await apiClient.post('/user/resend_verification_email', { email });  // Updated path
    return response.data;
  } catch (error: any) {
    console.error("Error resending verification email:", error);
    throw error;
  }
}

export const loginUser = async (credentials: Credentials) => {
  try {
    const response = await apiClient.post('/user/login_user', credentials);  // Updated path
    return response.data;
  } catch (error: any) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export const logoutUser = async () => {
  try {
    const response = await apiClient.post('/user/logout_user');  // Updated path
    return response.data;
  } catch (error: any) {
    console.error("Error logging out user:", error);
    throw error;
  }
}

export const resetPassword = async (email: string) => {
  try {
    const response = await apiClient.post('/user/reset_password_link', { email });  // Updated path
    return response.data;
  } catch (error: any) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

export const setNewPassword = async (passwordData: PasswordData) => { 
  try {
    const response = await apiClient.post('/user/set_new_password', passwordData);  // Updated path
    return response.data;
  } catch (error: any) {
    console.error("Error setting new password:", error);
    throw error;
  }
}

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
