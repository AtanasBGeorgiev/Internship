import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { showGlobalError, handleAuthError } from "../utils/errorHandler";

interface JwtPayload {
    userId: string;
    userName: string;
    role: string;
    exp: number;
}

//Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    //All requests will be in JSON format
    headers: {
        'Content-Type': 'application/json',
    },
});

//Request interceptor
//(config) - callback function that accepts the config object and returns a new config object
//config contains url,method,headers,data,etc
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp && decoded.exp < currentTime) {
                // Token expired - handle automatic logout
                handleAuthError("Token expired. Please login again.");
                return Promise.reject(new Error("TOKEN_EXPIRED"));
            }

            //add token to headers in config
            config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            // Invalid token format - handle automatic logout
            handleAuthError("Invalid token. Please login again.");
            return Promise.reject(new Error("INVALID_TOKEN"));
        }
    }

    return config;
},
    (error) => {
        showGlobalError("Error in request interceptor");
        return Promise.reject(error);
    }
);

//Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Axios error:', error.response || error.message);

        // Handle authentication errors
        if (error.response?.status === 401) {
            handleAuthError("Unauthorized. Please login again.");
            return Promise.reject(error);
        }

        if (error.response?.status === 403) {
            handleAuthError("Access forbidden. Please login again.");
            return Promise.reject(error);
        }

        // Handle token expired errors from server
        if (error.response?.data?.message?.toLowerCase().includes('expired') || 
            error.response?.data?.message?.toLowerCase().includes('invalid token')) {
            handleAuthError("Session expired. Please login again.");
            return Promise.reject(error);
        }

        // Handle other errors
        const message = error.response?.data?.message || "Unexpected error occurred";
        showGlobalError(message);

        return Promise.reject(error);
    }
);

export default api;