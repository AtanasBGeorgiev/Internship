import { protectedFetch } from "./authService";

interface CurrencyResponse {
    data: Record<string, number>;
};
export const getCurrencies = async (): Promise<CurrencyResponse> => {
    return await protectedFetch<CurrencyResponse>('/api/currency/getAllCurencies');
};