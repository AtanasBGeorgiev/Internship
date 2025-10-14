import api from "../api/axiosInstance";

import type { User } from "../Components/ModelTypes";
import { protectedFetch } from "./authService";
import { showGlobalError } from "../utils/errorHandler";

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