import api from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import axios, { type AxiosRequestConfig } from 'axios';

import { showGlobalError, handleAuthError } from "../utils/errorHandler";
import { type BusinessClient, type NotificationResponse, type TableModel, type TableNames, type User } from "../Components/ModelTypes";
import i18n from "../i18n";

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

// Sidebar service
export interface SidebarResponse {
    success: boolean;
    message: string;
    data: any[];
}

interface SignalProp {
    signal?: AbortSignal
};

export const fetchSidebarMenu = async ({ signal }: SignalProp = {}): Promise<any[]> => {
    const response = await protectedFetch<SidebarResponse>('/api/sidebar', { signal });

    if (response.success) {
        return response.data;
    } else {
        throw new Error(response.message || 'errors.failedToFetchSidebarMenu');
    }
};

interface CurrencyResponse {
    data: Record<string, number>;
};
export const getCurrencies = async (): Promise<CurrencyResponse> => {
    return await protectedFetch<CurrencyResponse>('/api/currency/getAllCurencies');
};

export const postPreferrence = async (userId: string, itemsID: string[], itemType: string) => {
    try {
        const response = await api.post(`/api/preferences/postPreferrence/${itemType}`, { userId, itemsID });
        return response.data;
    } catch (error) {
        showGlobalError('errors.failedToPostPreference');
        throw error;
    }
};

export const fetchBusinessClients = async (config: AxiosRequestConfig = {}): Promise<BusinessClient[]> => {
    return await protectedFetch<BusinessClient[]>('/api/businessClient/getBusinessClients', config);
};

export const getNotifications = async (userId: string, config: AxiosRequestConfig = {}): Promise<NotificationResponse> => {
    return await protectedFetch<NotificationResponse>(`/api/notification/getNotifications?userId=${userId}`, config);
};

export const RemoveNotification = async (notificationId: string) => {
    try {
        const response = await api.put(`/api/notification/update/${notificationId}`);
        return response.data;
    } catch (error) {
        showGlobalError('errors.failedToRemoveNotification');
        throw error;
    }
};

export const fetchUsers = async (): Promise<User[]> => {
    return await protectedFetch<User[]>('/api/admin/getUsers');
};

export const updateRole = async (ids: string[]) => {
    try {
        const response = await api.put('/api/admin/updateRole', ids);
        return response.data;
    } catch (error) {
        showGlobalError('errors.failedToUpdateRole');
        throw error;
    }
};

export const fetchTables = async (role: string): Promise<TableModel[]> => {
    return await protectedFetch<TableModel[]>(`/api/table/get?role=${role}`);
};

export const postPreferredTable = async (userId: string, tables: string[]) => {
    try {
        // Transform tables array to match schema: [{ tableId: string }]
        const tablesData = tables.map(tableId => ({ tableId }));
        const response = await api.post('/api/preferences/postPreferredTable', { userId, tables: tablesData });
        return response.data;
    } catch (error) {
        showGlobalError('errors.failedToPostPreferredTable');
        throw error;
    }
};

export const fetchPreferredTables = async (userId: string, config: AxiosRequestConfig = {}): Promise<{ message: string; tableNames: TableNames[] }> => {
    return await protectedFetch<{ message: string; tableNames: TableNames[] }>(`/api/preferences/getPreferredTables?userId=${userId}`, config);
};

export const updateTableOrder = async (userId: string, tables: { id: string, order: number }[]) => {
    try {
        const response = await api.put('/api/table/updatePreferredOrder', { userId, tables });
        return response.data;
    } catch (error) {
        showGlobalError('errors.failedToUpdateTableOrder');
        throw error;
    }
};

export const getTableOrder = async (userId: string): Promise<{ tableId: string, order: number }[]> => {
    return await protectedFetch<{ tableId: string; order: number }[]>(`/api/table/getPreferredOrder/${userId}`);
};

export const getUserNamesByLanguage = (userRoleData: string[], language: string): string => {
    if (language === 'bg') {
        return userRoleData[3]; // nameCyrillic (Bulgarian)
    } else {
        return userRoleData[4]; // nameLatin (English)
    }
};

export const updateUserNames = async (setUserNames: (names: string) => void) => {
    try {
        const names = await getUserData();
        const currentLanguage = i18n.language || 'bg';
        setUserNames(getUserNamesByLanguage(names, currentLanguage));
    } catch (err) {
        console.error('Error updating user names:', err);
    }
};