import api from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { showGlobalError } from "../utils/errorHandler";

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
        showGlobalError('Authentication required. Please log in.');
        throw new Error('No token!');
    }

    const decodedToken = jwtDecode<JWTPayload>(token);

    if (decodedToken.exp < Date.now() / 1000) {
        showGlobalError('Your session has expired. Please log in again.');
        throw new Error('Token expired!');
    }

    if (!decodedToken.role) {
        showGlobalError('Invalid token. Please log in again.');
        throw new Error('Invalid token!');
    }

    return decodedToken.role as string;
};

interface Currency {
    currency: string;
    reverseRate: number;
};
export const getCurrencies = async (): Promise<Currency[]> => {
    try {
        const response = await api.get<Currency[]>('/currency/getAllCurencies');
        return response.data;
    } catch (error) {
        showGlobalError('Failed to fetch currencies');
        throw error;
    }
};

//fetch data of each type
export const protectedFetch = async<T>(endpoint: string): Promise<T> => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        showGlobalError('Authentication required. Please log in.');
        throw new Error('No token!');
    }
    const response = await api.get<T>(endpoint);

    return response.data;
};

// Sidebar service
export interface SidebarResponse {
    success: boolean;
    message: string;
    data: any[];
}

export const fetchSidebarMenu = async (): Promise<any[]> => {
    const response = await api.get<SidebarResponse>('/api/sidebar');

    if (response.data.success) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || 'Failed to fetch sidebar menu');
    }
};