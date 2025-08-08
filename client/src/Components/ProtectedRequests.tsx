import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface JwtPayload {
    exp: number;
}

export function useProtectedFetch<T = unknown>(endpoint: string) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                navigate("/Login");
                return;
            }

            try {
                const decoded = jwtDecode<JwtPayload>(token);

                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    localStorage.removeItem("jwtToken");
                    navigate("/Login");
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setData(response.data);
            }
            catch (err: any) {
                console.error("Protected fetch error:",)
                localStorage.removeItem("jwtToken");
                setError("Failed to load data. Please login again.");
                navigate("/Login");
            }
        };

        fetchData();
    }, [endpoint, navigate]);

    return { data, error };
};