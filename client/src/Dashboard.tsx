import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { SidebarMenu } from "./Components/Sidebar";
import { getUserData } from "./services/authService";
import { UserDashboard, UserDashboardHeader } from "./Components/UserDashboard";
import { useScreenHeight } from "./context/ScreenHeightContext";

export function Dashboard() {
    const { t } = useTranslation();

    const [userRole, setUserRole] = useState<string | null>(null);
    const { height, setHeight } = useScreenHeight();

    useEffect(() => {
        //412 is the height of the footer	
        const height = document.documentElement.scrollHeight;
        setHeight(height);
    }, [height]);

    console.log("height", height);

    useEffect(() => {
        const fetchUserRole = async () => {
            const data = await getUserData();
            setUserRole(data[1]);//data[1] is the role
        };
        fetchUserRole();
    }, []);

    console.log(userRole);
    return (
        <>
            {userRole === "user" ? <UserDashboardHeader /> : null}
            <div id="wrapper" className="grid grid-cols-12 bg-gray-100 py-5 xl:p-5">
                <div className="hidden xl:block xl:col-span-2">
                    <SidebarMenu />
                </div>

                <div id="mainContent" className="col-span-12 bg-white border-r-2 border-gray-300 col-span-10 xl:col-span-10">
                    <h1 className="text-lg text-gray-500 border-b-2 border-gray-300 p-2">{t("Начало")}</h1>

                    {userRole === "user" ? <UserDashboard /> : null}

                </div>
            </div>
        </>
    );
}