import axios from 'axios';
import { API_BASE_URL } from '@env';

const apiClient = axios.create({
    // baseURL: 'http://localhost:5000/api',
    baseURL: API_BASE_URL,
    withCredentials: false,
});

export default apiClient;


