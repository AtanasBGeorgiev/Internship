import api from "../api/axiosInstance";

import { protectedFetch } from "./authService";
import { showGlobalError } from "../utils/errorHandler";
import type { TableModel, TableNames } from "../Components/ModelTypes";
import type { AxiosRequestConfig } from "axios";


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