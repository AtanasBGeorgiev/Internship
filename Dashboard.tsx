import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

type jwtPayload = {
    exp: number
};
export function Dashboard() {
    const navigate = useNavigate();

    //array with dependencies [navigate] - if navigate changes, the useEffect will run again
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            navigate("/Login");
            return;
        }

        try {
            const decoded = jwtDecode<jwtPayload>(token);//reads content of the token without verifying it'signature
            const currentTime = Date.now() / 1000;//current time in seconds

            if (currentTime > decoded.exp) {
                localStorage.removeItem('jwtToken');
                navigate('/Login');
            }

            axios.get(`${import.meta.env.VITE_API_URL}/Dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    console.log("Достъп потвърден от сървъра");
                })
                .catch((err) => {
                    console.error("Токенът е невалиден на сървъра");
                    localStorage.removeItem('jwtToken');
                    navigate('/Login');
                });
        }
        catch (error) {
            console.error("Грешка при декодиране на токена");
            localStorage.removeItem('jwtToken');
            navigate('/Login');
        }
    }, [navigate]);
    return (
        <h1>Dashboard</h1>
    );
};