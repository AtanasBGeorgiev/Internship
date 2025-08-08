import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useError } from '../context/ErrorContext';
import { showGlobalError } from "../utils/errorHandler";

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
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
            // Remove token and throw error - let the component handle navigation
            localStorage.removeItem("jwtToken");
            return Promise.reject(new Error("TOKEN_EXPIRED"));
        }

        //add token to headers in config
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
},
    (error) => Promise.reject(error)
);

//Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Axios error:', error.response || error.message)

        const message = error.response?.data?.message || "Unexpected error occured";
        showGlobalError(message);

        return Promise.reject(error);
    }
);

export default api;