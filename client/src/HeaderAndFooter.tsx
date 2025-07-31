import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { FooterLink, NavbarMenu, AllNavbarLinks } from "./Components/HeaderAndFooter";

export const Header: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="h-20 mb-2 border-b-2 border-gray-300 lg:h-15">
            <nav className="text-center h-20 p-2 lg:h-15">
                <div className="h-full flex items-center justify-between relative">
                    <img src="icon-fibank-logo3.jpg" alt="logo" className="w-24 h-6 sm:w-40 sm:h-10 ml-5" />

                    <div className="hidden lg:flex items-center justify-between lg:justify-center space-x-5">
                        <AllNavbarLinks />
                    </div>

                    <NavbarMenu />

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

export const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div id="footer" className="text-sm w-full text-gray-600 bg-gray-100 p-3 text-center md:text-base">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex items-center justify-center pb-4">
                <FooterLink text={t("Как да добавя сметка")} />
                <FooterLink text={t("Всичко с един потребител (SSO)")} />
                <FooterLink text={t("Процес на регистрация")} />
                <FooterLink text={t("Електронен подпис")} />
                <FooterLink text={t("Такси и комисионни")} />
                <FooterLink displayProps="pl-2 hover:underline" text={t("Документи")} />
            </div>
            <p>© {t("Първа инвестиционна банка 2009-2015")}.</p>
        </div>
    );
}
