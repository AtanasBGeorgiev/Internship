import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { protectedFetch } from "../services/authService";
import { showGlobalError, logout } from "../utils/errorHandler";

export function useProtectedFetch<T = unknown>(endpoint: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            // Check if endpoint is null or empty
            if (!endpoint) {
                console.log("Endpoint is null or empty, skipping fetch");
                setError(null); // Clear any previous errors
                setData(null); // Clear any previous data
                return;
            }
            else {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    logout();
                    return;
                }

                try {
                    const result = await protectedFetch<T>(endpoint);
                    setData(result);
                }
                catch (err: any) {
                    console.error("Protected fetch error:", err.message);

                    if (err.message === "No token" || err.message === "TOKEN_EXPIRED" || err.message === "INVALID_TOKEN") {
                        // Let the centralized logout handle this
                        logout();
                    } else {
                        setError("Failed to load data. Please try again.");
                        showGlobalError("Failed to load data. Please try again.");
                        console.error("Non-token error:", err);
                    }
                }
            }
        };

        fetchData();
    }, [endpoint, navigate]);

    return { data, error };
};