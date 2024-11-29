import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: User;
}

export const setAuthToken = async (token: string) => {
    await AsyncStorage.setItem('userToken', token);
};

export const getAuthToken = async () => {
    return await AsyncStorage.getItem('userToken');
};

export const removeAuthToken = async () => {
    await AsyncStorage.removeItem('userToken');
};

export const validateToken = async (): Promise<{ isValid: boolean; user?: User }> => {
    try {
        const token = await getAuthToken();
        if (!token) return { isValid: false };

        const response = await fetch(`${API_URL}/validate-token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            await removeAuthToken(); // Clear invalid token
            return { isValid: false };
        }

        const data = await response.json();
        return { isValid: true, user: data.user };
    } catch (error) {
        console.error('Token validation error:', error);
        return { isValid: false };
    }
};
