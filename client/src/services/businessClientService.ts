import type { BusinessClient } from "../Components/ModelTypes";
import { protectedFetch } from "./authService";
import type { AxiosRequestConfig } from "axios";

export const fetchBusinessClients = async (config: AxiosRequestConfig = {}): Promise<BusinessClient[]> => {
    return await protectedFetch<BusinessClient[]>('/api/businessClient/getBusinessClients', config);
};