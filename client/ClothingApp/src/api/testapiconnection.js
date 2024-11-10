import apiClient from './api';

export const testConnection = async () => {
    try {
        const response = await apiClient.get('/todos/1'); // Example endpoint
        console.log("Public API Response:", response.data);
    } catch (error) {
        console.error("Error reaching public API:", error);
    }
};

// verified that app can connect to public API