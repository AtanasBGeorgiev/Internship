import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useTranslation } from "react-i18next";

import { RiBankCardLine } from "react-icons/ri";
import { FaMoneyBillAlt, FaUniversity, FaChartLine, FaRegNewspaper, FaTag, FaApple, FaArchive } from "react-icons/fa";
import { MdMessage, MdEditDocument, MdEditNote } from "react-icons/md";
import { IoMdLogOut, IoIosListBox, IoMdList, } from "react-icons/io";
import { IoNotificationsSharp, IoSettingsSharp } from "react-icons/io5";
import { FaPenClip } from "react-icons/fa6";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BiSolidWallet } from "react-icons/bi";
import { GrAtm } from "react-icons/gr";
import { AiFillPieChart } from "react-icons/ai";
import { BsInfoLg, BsSafeFill } from "react-icons/bs";
import { LuMonitor } from "react-icons/lu";
import { TiVendorAndroid } from "react-icons/ti";
import { PiCoinsFill } from "react-icons/pi";
import { FaArrowUpLong } from "react-icons/fa6";

import { DashboardNavbarLink, DashboardMoreInfo, SectionToolTip } from "./Components/Dashboard";
import { NavbarHelpContact } from "./Components/HeaderAndFooter";
import { Arrow, LangSwitcher } from "./Components/Common";

const handleLogout = () => {
    localStorage.removeItem('jwtToken');
};

const DashboardHeader: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="h-20 border-b-2 border-gray-300 lg:h-15">
            <nav className="text-center h-20 px-2 lg:h-15">
                <div className="h-full flex items-center justify-between relative">
                    <img src="icon-fibank-logo3.jpg" alt="logo" className="w-24 h-6 sm:w-40 sm:h-10 ml-5" />

                    <div className="flex items-center justify-between justify-center space-x-5">
                        <LangSwitcher english="ENGLISH" bulgarian="БЪЛГАРСКИ" />
                        <DashboardNavbarLink text={t("СЪОБЩЕНИЯ")} icon={<MdMessage />} hover="" />
                        <DashboardNavbarLink text={t("ИЗВЕСТИЯ")} icon={<IoNotificationsSharp />} hover="" />
                        <DashboardNavbarLink text={t("НАСТРОЙКИ")} icon={<IoSettingsSharp />} hover="" />
                        <DashboardNavbarLink text={t("ИЗХОД")} displayIconProps="-rotate-90" icon={<IoMdLogOut />} onClick={handleLogout} href="/Login" hover="" />
                    </div>
                </div>
            </nav>
        </div>
    );
}

type jwtPayload = {
    exp: number;//expiration date of the token
};
export function Dashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    //array with dependencies [navigate] - if navigate changes, the useEffect will run again
    //useEffect runs when the component is executed
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            navigate("/Login");
            return;
        }

        try {
            //jwtDecode- reads the content of the token without verifying it's signature
            const decoded = jwtDecode<jwtPayload>(token);//reads content of the token without verifying it's signature

            const currentTime = Date.now() / 1000;//current time in seconds
            if (currentTime > decoded.exp) {
                localStorage.removeItem('jwtToken');
                navigate('/Login');
            }

            //sends a request to the server
            axios.get(`${import.meta.env.VITE_API_URL}/Dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                //checks the server response and if the request is successful, the user is logged in
                .then((res) => {
                    console.log("Server confirmed access");
                })
                //if the request is not successful, the user is logged out
                .catch((err) => {
                    console.error("The token is invalid on the server");
                    localStorage.removeItem('jwtToken');
                    navigate('/Login');
                });
        }
        //if the token is not valid, the user is logged out
        catch (error) {
            console.error("Token decoding error");
            localStorage.removeItem('jwtToken');
            navigate('/Login');
        }
    }, [navigate]);
    return (
        <>
            <DashboardHeader />
            <div id="wrapper" className="grid grid-cols-12 bg-gray-100 p-5">
                <div id="sitdeNavbar" className="col-span-2 border-x-2 border-gray-300 bg-white">
                    <div id="userActions" className="py-2 flex flex-col items-start justify-center">
                        <div id="redButton" className="flex items-center flex-row gap-3 justify-center w-4/5 mx-auto my-3 font-bold text-center p-2 bg-red-600 text-white rounded-s">
                            <div>
                                <FaArrowUpLong />
                                <PiCoinsFill />
                            </div>
                            <Link to="">
                                {t("НОВ ПРЕВОД")}
                            </Link>
                        </div>

                        <DashboardNavbarLink text={t("Начало")} icon={<AiFillPieChart />} />
                        <DashboardNavbarLink text={t("Справки")} icon={<IoMdList />} displayArrow="block" position="left-full top-0"
                            tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <NavbarHelpContact text={t("ПОС транзакции - по групи")} />
                                        <NavbarHelpContact text={t("ПОС транзакции за период")} />
                                        <NavbarHelpContact text={t("Салда по всички сметки SSO")} />
                                        <NavbarHelpContact text={t("Дневен отчет за бюдж. разпоредител")} />
                                        <NavbarHelpContact text={t("Извършени услуги за клиент")} />
                                        <hr className="border-b-2 border-gray-300" />
                                        <NavbarHelpContact text={t("Изпратени SMS нотификации")} />
                                        <NavbarHelpContact text={t("Дължими суми от такси")} />
                                        <NavbarHelpContact text={t("Преводи по SWIFT")} />
                                        <NavbarHelpContact text={t("Сесии")} />
                                    </div>
                                </>
                            } />
                        <DashboardNavbarLink text={t("Плащания")} icon={<FaMoneyBillAlt />} displayArrow="block" position="left-full top-0"
                            tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <SectionToolTip title="ПРЕВОД" contacts={
                                            <>
                                                <NavbarHelpContact text={t("Нов кредитен превод")} />
                                                <NavbarHelpContact text={t("Плащане от/към бюджета")} />
                                                <NavbarHelpContact text={t("Директен дебит")} />
                                                <NavbarHelpContact text={t("Масов превод")} />
                                                <NavbarHelpContact text={t("Преводи от файл")} />
                                                <NavbarHelpContact text={t("Нов периодичен превод")} />
                                                <NavbarHelpContact text={t("Плащания към СЕБРА")} />
                                                <NavbarHelpContact text={t("Кредитен превод CY")} />
                                                <NavbarHelpContact text={t("Вътрешноклонов превод CY")} />
                                            </>
                                        } />
                                        <hr className="border-b-1 border-gray-300" />
                                        <SectionToolTip title={t("ПОКУПКА/ПРОДАЖБА НА ВАЛУТА")} contacts={
                                            <>
                                                <NavbarHelpContact text={t("Покупка/продажба на валута")} />
                                                <NavbarHelpContact text={t("Договаряне на курс")} />
                                            </>
                                        } />
                                        <hr className="border-b-1 border-gray-300" />
                                        <SectionToolTip title={t("РЕГИСТРИ")} contacts={
                                            <>
                                                <NavbarHelpContact text={t("Регистър на пер. преводи")} />
                                                <NavbarHelpContact text={t("Получатели за преводи")} />
                                            </>
                                        } />
                                    </div>
                                </>
                            } />

                        <DashboardNavbarLink text={t("Извлечения")} icon={<FaArchive />} displayIconProps="rotate-180"
                            position="left-full top-0"
                            displayArrow="block" tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <NavbarHelpContact text={t("Извлечения сметка")} fontSize="text-basic" />
                                        <NavbarHelpContact text={t("Извлечения по кредитна карта")} fontSize="text-basic" />
                                    </div>
                                </>
                            } />
                        <DashboardNavbarLink text={t("Сметки")} icon={<IoIosListBox />} />
                        <DashboardNavbarLink text={t("Депозити")} icon={<BsSafeFill />} />
                        <DashboardNavbarLink text={t("Карти")} icon={<RiBankCardLine />} />
                        <DashboardNavbarLink text={t("Преводи за подпис")} icon={<FaPenClip />} />
                        <DashboardNavbarLink text={t("Наредени документи")} icon={<MdEditNote />} />
                        <DashboardNavbarLink text={t("Услуги")} icon={<SlEnvolopeLetter />} position="left-full top-0" displayArrow="block"
                            tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <NavbarHelpContact text={t("Отчети по e-mail за сметки")} fontSize="text-basic" />
                                        <NavbarHelpContact text={t("Извлечения по e-mail за карти")} fontSize="text-basic" />
                                        <NavbarHelpContact text={t("Картови авторизации по e-mail")} fontSize="text-basic" />
                                        <NavbarHelpContact text={t("Преводи по SWIFT по e-mail")} fontSize="text-basic" />
                                    </div>
                                </>
                            } />
                        <DashboardNavbarLink text={t("Комунални услуги")} icon={<BiSolidWallet />} position="left-full top-0" displayArrow="block"
                            tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <SectionToolTip
                                            title={t("ПЛАЩАНЕ НА ЗАДЪЛЖЕНИЯ")}
                                            contacts={
                                                <>
                                                    <NavbarHelpContact text={t("Задължения, очакващи плащане")} />
                                                    <NavbarHelpContact text={t("Плащане на задължения")} />
                                                    <NavbarHelpContact text={t("Плащае на общински данъци и такси")} />
                                                    <NavbarHelpContact text={t("Еднократно плащане")} />
                                                </>
                                            }
                                        />
                                        <hr className="border-b-1 border-gray-300" />

                                        <SectionToolTip
                                            title={t("АБОНАТНИ СМЕТКИ")}
                                            contacts={
                                                <>
                                                    <NavbarHelpContact text={t("Добавяне на абонатна сметка")} />
                                                    <NavbarHelpContact text={t("Регистрерани абонатни сметки")} />
                                                </>
                                            }
                                        />
                                        <hr className="border-b-1 border-gray-300" />

                                        <SectionToolTip
                                            title={t("ДРУГИ")}
                                            contacts={
                                                <>
                                                    <NavbarHelpContact text={t("Известия по e-mail")} fontSize="text-basic" />
                                                    <NavbarHelpContact text={t("История на плащанията")} fontSize="text-basic" />
                                                </>
                                            }
                                        />
                                    </div>
                                </>
                            } />
                        <DashboardNavbarLink text={t("Декларации")} icon={<MdEditDocument />} position="left-full top-0" displayArrow="block"
                            tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70 z-50">
                                        <NavbarHelpContact text={t("Декларация НОИ")} fontSize="text-basic" />
                                        <NavbarHelpContact text={t("Статистическа форма 100 000 лв.")} fontSize="text-basic" />
                                        <NavbarHelpContact text={t("Декларация за произход на средствата")} fontSize="text-basic" />
                                        <NavbarHelpContact text={t("Декларация за презгранични преводи")} fontSize="text-basic" />
                                    </div>
                                </>
                            } />
                    </div>
                    <div id="aboutFibank" className="py-2 flex flex-col items-start justify-center border-y-2 border-gray-300">
                        <DashboardMoreInfo pText={t("ИНФОРМАЦИЯ ЗА FIBANK")} tooltip={
                            <>
                                <DashboardNavbarLink text={t("Клонове")} icon={<FaUniversity />} />
                                <DashboardNavbarLink text={t("Банкомати")} icon={<GrAtm />} />
                                <DashboardNavbarLink text={t("Валутни курсове")} icon={<FaChartLine />} />
                                <DashboardNavbarLink text={t("Новини")} icon={<FaRegNewspaper />} />
                                <DashboardNavbarLink text={t("Промоции")} icon={<FaTag />} />
                            </>
                        } />
                    </div>

                    <div id="more" className="py-2 flex flex-col items-start justify-center">
                        <DashboardMoreInfo pText={t("ДОПЪЛНИТЕЛНО")} tooltip={
                            <>
                                <DashboardNavbarLink text={t("Помощ")} icon={<BsInfoLg />} />
                                <DashboardNavbarLink text={t("Към сайта")} icon={<LuMonitor />} />
                                <DashboardNavbarLink text={t("Мобилно приложение")} icon={<TiVendorAndroid />} icon2={<FaApple />} />
                            </>
                        } />
                    </div>
                </div>
                <div id="mainContent" className="col-span-10 bg-white border-r-2 border-gray-300">
                    <h1 className="text-lg text-gray-500 border-b-2 border-gray-300 p-2">{t("Начало")}</h1>
                </div>
            </div>
        </>
    );
};