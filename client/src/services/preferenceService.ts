import api from "../api/axiosInstance";
import { showGlobalError } from "../utils/errorHandler";

export const postPreference = async (userId: string, itemsID: string[], itemType: string) => {
    try {
        const response = await api.post(`/api/preferences/postPreferrence/${itemType}`, { userId, itemsID });
        return response.data;
    } catch (error) {
        showGlobalError('errors.failedToPostPreference');
        throw error;
    }
};