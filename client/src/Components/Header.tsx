import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { NavbarLink, NavbarMenu, NavbarHelpContact } from "./Navbar";
import { Arrow, LangSwitcher } from "./Common";
import { renderIcon } from "../utils/iconMap";

const Content: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <LangSwitcher english={"English"} bulgarian={"Български"} />
            <NavbarLink icons={["LuMonitor"].map(icon => renderIcon(icon))} text={t("Към сайта")} />
            <NavbarLink icons={["FaApple", "TiVendorAndroid"].map(icon => renderIcon(icon))} text={t("Мобилно приложение")}
                tooltipText={
                    <>
                        <Arrow position={"top"} bgColor={"bg-gray-200"} />
                        <div className="w-60 h-40 text-center flex flex-col justify-between items-center 
                                                bg-cover bg-center p-2"
                            style={{ backgroundImage: `url(/bashar.jpg)` }}>
                            <h1 className="font-bold text-left text-blue-800">
                                {t("Банкирай навсякъде, по всяко време")}
                            </h1>
                            <a href="#" className="bg-white text-black p-2 rounded hover:bg-gray-200">
                                {t("НАУЧЕТЕ ПОВЕЧЕ")}
                            </a>
                        </div>
                    </>
                }
            />
            <NavbarLink icons={["TbClipboardList"].map(icon => renderIcon(icon))} text={t("Промени в ОУ и тарифа")} />
            <NavbarLink icons={["BsInfoLg"].map(icon => renderIcon(icon))} text={t("Помощ")}
                tooltipText={
                    <>
                        <Arrow position={"top"} bgColor={"bg-white"} />
                        <div className="w-60 text-left">
                            <div className="border-b-2 border-gray-300 pb-2">
                                <strong className="pl-2">{t("Информация")}</strong>
                                <NavbarHelpContact icon={renderIcon("IoDocumentTextSharp")} text={t("Помощни статии")} fontSize="text-xs" />
                                <NavbarHelpContact icon={renderIcon("BsQuestionLg")} text={t("Често задавани въпроси")} fontSize="text-xs" />
                                <NavbarHelpContact icon={renderIcon("IoDocumentLockOutline")} text={t("Съвети за сигурност")} fontSize="text-xs" />
                            </div>
                            <div className="pt-2">
                                <strong className="pl-2">{t("Връзка с нас")}</strong>
                                <NavbarHelpContact icon={renderIcon("FaPhone")} text={t("0700 12 777")} fontSize="text-xs" />
                                <NavbarHelpContact icon={renderIcon("FaEnvelope")} text={t("help@fibank.bg")} fontSize="text-xs" />
                                <NavbarHelpContact icon={renderIcon("BiSolidConversation")} text={t("Онлайн чат")} fontSize="text-xs" />
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
};
export const Header: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="h-20 mb-2 border-b-2 border-gray-300 lg:h-15">
            <nav className="text-center h-20 p-2 lg:h-15">
                <div className="h-full flex items-center justify-between relative">
                    <img src="icon-fibank-logo3.jpg" alt="logo" className="w-24 h-6 sm:w-40 sm:h-10 ml-5" />

                    <div className="hidden lg:flex items-center justify-between lg:justify-center space-x-5">
                        <Content />
                    </div>

                    <NavbarMenu content={<Content />} hideBreakpoint="lg" />

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