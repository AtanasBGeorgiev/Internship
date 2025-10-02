import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { showGlobalError, handleAuthError } from "../utils/errorHandler";
import i18n from '../i18n';

interface JwtPayload {
    id: string;
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
    const currentLanguage = i18n.language || 'bg';

    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp && decoded.exp < currentTime) {
                // Token expired - handle automatic logout
                handleAuthError("errors.tokenExpired");
                return Promise.reject(new Error("TOKEN_EXPIRED"));
            }

            //add token to headers in config with language preference
            config.headers.Authorization = `Bearer ${token}`;
            config.headers['Accept-Language'] = currentLanguage;
        } catch (error) {
            // Invalid token format - handle automatic logout
            handleAuthError("errors.invalidToken");
            return Promise.reject(new Error("INVALID_TOKEN"));
        }
    } else {
        // Even without token, send language preference
        config.headers['Accept-Language'] = currentLanguage;
    }

    return config;
},
    (error) => {
        showGlobalError("errors.requestInterceptorError");
        return Promise.reject(error);
    }
);

//Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't log cancellation errors - they're expected when using AbortController
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        console.error('Axios error:', error.response || error.message);

       
        if (error.response?.status === 403) {
            handleAuthError("errors.accessForbidden");
            return Promise.reject(error);
        }

        // Handle token expired errors from server
        if (error.response?.data?.message?.toLowerCase().includes('expired') || 
            error.response?.data?.message?.toLowerCase().includes('invalid token')) {
            handleAuthError("errors.sessionExpired");
            return Promise.reject(error);
        }

        // Handle other errors
        const message = error.response?.data?.message;
        showGlobalError(message);

        return Promise.reject(error);
    }
);

export default api;

// Function to update language preference in axios instance
export const updateLanguagePreference = (language: string) => {
    // Update the default headers for future requests
    api.defaults.headers.common['Accept-Language'] = language;
};

// Function to get current language preference
export const getCurrentLanguage = () => {
    return i18n.language || 'bg';
};