import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add a request interceptor for authentication
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
    response => response,
    /**
     * Interceptor to handle responses with error status.
     * Specifically, it catches 401 Unauthorized errors, removes the stored token,
     * and lets the components handle navigation. Other errors are simply rejected.
     */
    async error => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            await AsyncStorage.removeItem('token');
            // Navigation will be handled by the components
        }
        return Promise.reject(error);
    }
);

export default apiClient;
