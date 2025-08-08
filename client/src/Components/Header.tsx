import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { NavbarContent, NavbarMenu,  } from "./Navbar";
import navbarData from '../data/mainHeader.json';

export const Header: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="h-20 mb-2 border-b-2 border-gray-300 lg:h-15">
            <nav className="text-center h-20 p-2 lg:h-15">
                <div className="h-full flex items-center justify-between relative">
                    <img src="icon-fibank-logo3.jpg" alt="logo" className="w-24 h-6 sm:w-40 sm:h-10 ml-5" />

                    <div className="hidden lg:flex items-center justify-between lg:justify-center space-x-5">
                        <NavbarContent data={navbarData} />
                    </div>

                    <NavbarMenu data={navbarData} />

                    {(location.pathname === "/Login" || location.pathname === "/") &&
                        <Link to="/Register" className="bg-gray-200 p-2 mx-5 hover:bg-blue-800 hover:text-white hover:cursor-pointer rounded">
                            {t("Регистрация")}
                        </Link>
                    }
                    {location.pathname === "/Register" &&
                        <Link to="/Login" className="bg-blue-800 text-white py-2 px-8 mx-5 hover:cursor-pointer">{t("ВХОД")}</Link>
                    }
                </div>
            </nav>
        </div>
    );
}