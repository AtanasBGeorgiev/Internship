import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { SidebarMenu } from "./Components/Sidebar";
import { UserDashboard } from "./Components/UserDashboard";
import { DashboardHeader } from "./Components/Header";
import { useScreenHeight } from "./context/ScreenHeightContext";

export function Dashboard() {
    const { t } = useTranslation();

    const { height, setHeight } = useScreenHeight();

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current)
            return;
        hasRun.current = true;

        //412 is the height of the footer	
        const height = document.documentElement.scrollHeight;
        setHeight(height);
        console.log("Height1", height);

    }, []);

    return (
        <>
            {<DashboardHeader />}
            <div id="wrapper" className="grid grid-cols-12 bg-gray-100 py-5 xl:p-5">
                <div className="hidden xl:block xl:col-span-2">
                    <SidebarMenu />
                </div>

                <div id="mainContent" className="col-span-12 bg-white border-r-2 border-gray-300 col-span-10 xl:col-span-10">
                    <h1 className="text-lg text-gray-500 border-b-2 border-gray-300 p-2">{t("Начало")}</h1>

                    <UserDashboard />

                </div>
            </div>
        </>
    );
}