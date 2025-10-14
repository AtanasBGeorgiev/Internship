import api from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import axios, { type AxiosRequestConfig } from 'axios';

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
    userId: string;
    role: string;
    exp: number;
    username: string;
    nameCyrillic: string;
    nameLatin: string;
}

export const getUserData = async (): Promise<string[]> => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        handleAuthError('errors.authenticationRequired');
        throw new Error('No token!');
    }

    try {
        const decodedToken = jwtDecode<JWTPayload>(token);

        if (decodedToken.exp < Date.now() / 1000) {
            handleAuthError('errors.sessionExpiredLoginAgain');
            throw new Error('Token expired!');
        }

        if (!decodedToken.role) {
            handleAuthError('errors.invalidTokenLoginAgain');
            throw new Error('Invalid token!');
        }
        const data = [decodedToken.userId, decodedToken.role, decodedToken.username, decodedToken.nameCyrillic, decodedToken.nameLatin];
        return data;
    } catch (error) {
        handleAuthError('errors.invalidTokenFormat');
        throw new Error('Invalid token format!');
    }
};

//fetch data of each type
export const protectedFetch = async<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        handleAuthError('errors.authenticationRequired');
        throw new Error('No token!');
    }

    try {
        const response = await api.get<T>(endpoint, config);
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log("The request was canceled.");
            throw error;
        }
        showGlobalError('errors.failedToFetchData');
        // Let the axios interceptor handle the error
        throw error;
    }
};