import api from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { showGlobalError, handleAuthError } from "../utils/errorHandler";

export interface loginData {
    username: string;
    password: string;
};
export interface LoginResponse {
    token: string;
};
//Promise- is a way to handle asynchronous operations in JavaScript.
export const login = async (data: loginData): Promise<LoginResponse> => {
    const response = await api.post('/login/Login', data);
    return response.data;
};


export interface RegisterData {
    egn: string;
    passport: string;
    nameCyrillic: string;
    nameLatin: string;
    email: string;
    phone: string;
    address: string;
    username: string;
    password: string;
    confirmPassword: string;
}
export interface RegisterResponse {
    message: string;
};
export const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await api.post('/register/RegisterUser', data);
    return response.data;
};

interface JWTPayload {
    id: string;
    role: string;
    exp: number;
}

export const getUserRole = async (): Promise<string> => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        handleAuthError('Authentication required. Please log in.');
        throw new Error('No token!');
    }

    try {
        const decodedToken = jwtDecode<JWTPayload>(token);

        if (decodedToken.exp < Date.now() / 1000) {
            handleAuthError('Your session has expired. Please log in again.');
            throw new Error('Token expired!');
        }

        if (!decodedToken.role) {
            handleAuthError('Invalid token. Please log in again.');
            throw new Error('Invalid token!');
        }

        return decodedToken.role as string;
    } catch (error) {
        handleAuthError('Invalid token format. Please log in again.');
        throw new Error('Invalid token format!');
    }
};

//fetch data of each type
export const protectedFetch = async<T>(endpoint: string): Promise<T> => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        handleAuthError('Authentication required. Please log in.');
        throw new Error('No token!');
    }
    
    try {
        const response = await api.get<T>(endpoint);
        return response.data;
    } catch (error) {
        showGlobalError('Failed to fetch data');
        // Let the axios interceptor handle the error
        throw error;
    }
};

// Sidebar service
export interface SidebarResponse {
    success: boolean;
    message: string;
    data: any[];
}

export const fetchSidebarMenu = async (): Promise<any[]> => {
    try {
        const response = await api.get<SidebarResponse>('/api/sidebar');

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch sidebar menu');
        }
    } catch (error) {
        showGlobalError('Failed to fetch sidebar menu');
        // Let the axios interceptor handle the error
        throw error;
    }
};

interface CurrencyResponse {
    data: Record<string, number>;
};
export const getCurrencies = async (): Promise<CurrencyResponse> => {
    try {
        const response = await api.get<CurrencyResponse>('/api/currency/getAllCurencies');
        return response.data;
    } catch (error) {
        showGlobalError('Failed to fetch currencies');
        throw error;
    }
};
