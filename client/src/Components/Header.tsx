import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import { FaPenNib, FaUserAlt } from "react-icons/fa";
import { IoIosListBox, IoMdPhonePortrait } from "react-icons/io";
import { FaPencil } from "react-icons/fa6";
import { BsSafeFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa6";
import { FaRegNewspaper } from "react-icons/fa";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { RiBankCardLine } from "react-icons/ri";
import { CiShoppingTag } from "react-icons/ci";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdMenuBook } from "react-icons/md";

import { NavbarLink, NavbarMenu, NavbarHelpContact } from "./Navbar";
import { Arrow, LangSwitcher } from "./Common";
import { renderIcon } from "../utils/iconMap";
import { getUserData, getNotifications } from "../services/authService";
import { logout } from "../utils/errorHandler";
import { ModuleManaging } from "./ModuleManaging";
import { Tutorial } from "./Tutorial";
import { ProfileMenuBusiness } from "./ProfileMenuBusiness";
import { NotificationsMenu } from "./Notifications";
import { SidebarMenu } from "./Sidebar";
import { NavProfile } from "./Navbar";

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

                    <NavbarMenu content={<Content />} hideBreakpoint="lg" opacityClass="bg-white/100" />

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

export const DashboardHeader: React.FC = () => {
    const { t } = useTranslation();

    const [moduleManaging, setModuleManaging] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [countNotif, setCountNotif] = useState<number>(0);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

    useEffect(() => {
        const fetchCountNotif = async () => {
            try {
                setIsLoadingNotifications(true);
                const userData = await getUserData();
                const data = await getNotifications(userData[0]);
                console.log("countUnread", data.countUnread);
                setCountNotif(data.countUnread);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                setCountNotif(0);
            } finally {
                setIsLoadingNotifications(false);
            }
        }
        fetchCountNotif();
    }, []);

    const handleLogout = () => {
        logout();
    };

    const onCloseModuleManaging = () => {
        setModuleManaging(false);
    };

    const onCloseTutorial = () => {
        setShowTutorial(false);
    };

    return (
        <>
            {moduleManaging && <ModuleManaging onClose={onCloseModuleManaging} />}
            {showTutorial && <Tutorial onClose={onCloseTutorial} />}

            <div className="h-20 border-b-2 border-gray-300 lg:h-15">
                <nav className="text-center h-20 px-2 lg:h-15">
                    <div className="h-full flex items-center justify-center space-x-2 xl:space-x-0 xl:justify-between relative">
                        <NavbarMenu text={t("МЕНЮ")} hideBreakpoint="xl" opacityClass="bg-white/80" content={
                            <div className="w-1/5">
                                <SidebarMenu />
                            </div>
                        } />

                        <img src="icon-fibank-logo3.jpg" alt="logo" className="w-24 h-6 xl:w-40 xl:h-10 ml-5" />
                        <div className="flex items-center justify-between justify-center space-x-5">
                            <LangSwitcher english={"ENGLISH"} bulgarian={"БЪЛГАРСКИ"} />
                            <NavbarLink icons={["MdMessage"].map(icon => renderIcon(icon))} text={t("СЪОБЩЕНИЯ")}
                                displayIconProps="text-2xl" count={2} />
                            <NavbarLink icons={["IoNotificationsSharp"].map(icon => renderIcon(icon))} text={t("ИЗВЕСТИЯ")}
                                displayIconProps="text-2xl" count={isLoadingNotifications ? 0 : countNotif}
                                tooltipText={
                                    <div>
                                        <Arrow position="top" />
                                        <NotificationsMenu />
                                    </div>
                                }
                            />
                            <NavbarLink icons={["IoSettingsSharp"].map(icon => renderIcon(icon))} text={t("НАСТРОЙКИ")} width="min-w-70"
                                tooltipText={
                                    <div className="max-h-70 overflow-y-auto scrollbar-thin">
                                        <Arrow position="top" />
                                        <NavbarHelpContact text={t("Упътване")} icon={<MdMenuBook />} onClick={() => setShowTutorial(true)} />
                                        <NavbarHelpContact text={t("Лични данни")} icon={<FaUserAlt />} />
                                        <NavbarHelpContact text={t("Общи настройки")} icon={<FaPencil />} />
                                        <NavbarHelpContact text={t("Управление на модули")} icon={<FaPencil />} onClick={() => setModuleManaging(true)} />
                                        <NavbarHelpContact text={t("Настройки на сметка")} icon={<IoIosListBox />} />
                                        <NavbarHelpContact text={t("Настройки на депозит")} icon={<BsSafeFill />} />
                                        <NavbarHelpContact text={t("Настройки на карта")} icon={<RiBankCardLine />} />
                                        <NavbarHelpContact text={t("3D сигурност на карти")} icon={<RiBankCardLine />} />
                                        <NavbarHelpContact text={t("Промяна на парола")} icon={<FaLock />} />
                                        <NavbarHelpContact text={t("Регистриране на сертификат")} icon={<FaRegNewspaper />} />
                                        <NavbarHelpContact text={t("Регистрирани на КЕП")} icon={<FaPenNib />} />
                                        <hr></hr>
                                        <NavbarHelpContact text={t("Деблокиране на Token")} icon={<FaUnlockKeyhole />} />
                                        <NavbarHelpContact text={t("Промяна ПИН Token")} icon={<CiShoppingTag />} />
                                        <NavbarHelpContact text={t("E-mail и SMS известяване")} icon={<IoNotificationsSharp />} />
                                        <NavbarHelpContact text={t("SMS известяване за карти")} icon={<RiBankCardLine />} />
                                        <NavbarHelpContact text={t("Мобилно приложение Fibank")} icon={<IoMdPhonePortrait />} />
                                    </div>
                                } />
                            <NavProfile img="profile-picture.jpg" tooltip={
                                <ProfileMenuBusiness />
                            } />
                            <NavbarLink icons={["IoMdLogOut"].map(icon => renderIcon(icon))} text={t("ИЗХОД")}
                                onClick={() => handleLogout()} href={"/Login"} type="logout" displayIconProps="-rotate-90" />
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}