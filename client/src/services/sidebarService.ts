import { protectedFetch } from "./authService";

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