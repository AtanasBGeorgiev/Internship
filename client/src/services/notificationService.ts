import type { AxiosRequestConfig } from "axios";
import api from "../api/axiosInstance";

import { showGlobalError } from "../utils/errorHandler";
import type { NotificationResponse } from "../Components/ModelTypes";
import { protectedFetch } from "./authService";

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