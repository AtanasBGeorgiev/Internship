import axios from 'axios';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        
        if (token) {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp && decoded.exp < currentTime) {
                // Само изтриваме токена и отбелязваме грешка
                localStorage.removeItem("jwtToken");
                return Promise.reject(new Error("TOKEN_EXPIRED"));
            }

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
        return Promise.reject(error);
    }
);

export default api;
