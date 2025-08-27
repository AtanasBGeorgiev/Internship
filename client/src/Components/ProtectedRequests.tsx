import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { protectedFetch } from "../services/authService";
import { showGlobalError, logout } from "../utils/errorHandler";

export function useProtectedFetch<T = unknown>(endpoint: string | null, dependencies: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            // Check if endpoint is null or empty
            if (!endpoint) {
                console.log("Endpoint is null or empty, skipping fetch");
                setError(null); // Clear any previous errors
                setData(null); // Clear any previous data
                setIsLoading(false);
                return;
            }
            else {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    logout();
                    return;
                }

                try {
                    setIsLoading(true);
                    setError(null);
                    const result = await protectedFetch<T>(endpoint);
                    setData(result);
                }
                catch (err: any) {
                    console.error("Protected fetch error:", err.message);

                    if (err.message === "No token" || err.message === "TOKEN_EXPIRED" || err.message === "INVALID_TOKEN") {
                        // Let the centralized logout handle this
                        logout();
                    } else {
                        setError(t("errors.failedToLoadData"));
                        showGlobalError("errors.failedToLoadData");
                        console.error("Non-token error:", err);
                    }
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [endpoint, navigate, ...dependencies]);

    return { data, error, isLoading };
};