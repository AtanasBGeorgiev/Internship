import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { DashboardTopNavbarLink, DashboardMoreInfo, NavbarHelpContact, SectionToolTip, Arrow } from "./Components";
import { RiBankCardLine } from "react-icons/ri";
import { FaMoneyBillAlt, FaUniversity, FaChartLine, FaRegNewspaper, FaTag, FaApple, FaArchive } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoNotificationsSharp, IoSettingsSharp } from "react-icons/io5";
import { IoMdLogOut, IoIosListBox, IoMdList, } from "react-icons/io";
import { FaPenClip } from "react-icons/fa6";
import { MdEditDocument, MdEditNote } from "react-icons/md";
import { SlEnvolopeLetter } from "react-icons/sl";
import { BiSolidWallet } from "react-icons/bi";
import { GrAtm } from "react-icons/gr";
import { AiFillPieChart } from "react-icons/ai";
import { BsInfoLg, BsSafeFill } from "react-icons/bs";
import { LuMonitor } from "react-icons/lu";
import { TiVendorAndroid } from "react-icons/ti";
import { PiCoinsFill } from "react-icons/pi";
import { FaArrowUpLong } from "react-icons/fa6";

const handleLogout = () => {
    localStorage.removeItem('jwtToken');
};

const DashboardHeader: React.FC = () => {
    return (
        <div className="h-20 border-b-2 border-gray-300 lg:h-15">
            <nav className="text-center h-20 px-2 lg:h-15">
                <div className="h-full flex items-center justify-between relative">
                    <img src="icon-fibank-logo3.jpg" alt="logo" className="w-24 h-6 sm:w-40 sm:h-10 ml-5" />

                    <div className="flex items-center justify-between justify-center space-x-5">
                        <DashboardTopNavbarLink text="ENGLISH" displayIconProps="hidden" hover="" />
                        <DashboardTopNavbarLink text="СЪОБЩЕНИЯ" icon={<MdMessage />} hover="" />
                        <DashboardTopNavbarLink text="ИЗВЕСТИЯ" icon={<IoNotificationsSharp />} hover="" />
                        <DashboardTopNavbarLink text="НАСТРОЙКИ" icon={<IoSettingsSharp />} hover="" />
                        <DashboardTopNavbarLink text="ИЗХОД" displayIconProps="-rotate-90" icon={<IoMdLogOut />} onClick={handleLogout} hover="" />
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
            const decoded = jwtDecode<jwtPayload>(token);//reads content of the token without verifying it'signature

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
                    console.log("Достъп потвърден от сървъра");
                })
                //if the request is not successful, the user is logged out
                .catch((err) => {
                    console.error("Токенът е невалиден на сървъра");
                    localStorage.removeItem('jwtToken');
                    navigate('/Login');
                });
        }
        //if the token is not valid, the user is logged out
        catch (error) {
            console.error("Грешка при декодиране на токена");
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
                                НОВ ПРЕВОД
                            </Link>
                        </div>

                        <DashboardTopNavbarLink text="Начало" icon={<AiFillPieChart />} />
                        <DashboardTopNavbarLink text="Справки" icon={<IoMdList />} displayArrow="block" position="left-full top-0"
                            tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <NavbarHelpContact text="ПОС транзакции - по групи" />
                                        <NavbarHelpContact text="ПОС транзакции за период" />
                                        <NavbarHelpContact text="Салда по всички сметки SSO" />
                                        <NavbarHelpContact text="Дневен отчет за бюдж. разпоредител" />
                                        <NavbarHelpContact text="Извършени услуги за клиент" />
                                        <hr className="border-b-2 border-gray-300" />
                                        <NavbarHelpContact text="Изпратени SMS нотификации" />
                                        <NavbarHelpContact text="Дължими суми от такси" />
                                        <NavbarHelpContact text="Преводи по SWIFT" />
                                        <NavbarHelpContact text="Сесии" />
                                    </div>
                                </>
                            } />
                        <DashboardTopNavbarLink text="Плащания" icon={<FaMoneyBillAlt />} displayArrow="block" position="left-full top-0"
                            tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <SectionToolTip title="ПРЕВОД" contacts={
                                            <>
                                                <NavbarHelpContact text="Нов кредитен превод" />
                                                <NavbarHelpContact text="Плащане от/към бюджета" />
                                                <NavbarHelpContact text="Директен дебит" />
                                                <NavbarHelpContact text="Масов превод" />
                                                <NavbarHelpContact text="Преводи от файл" />
                                                <NavbarHelpContact text="Нов периодичен превод" />
                                                <NavbarHelpContact text="Плащания към СЕБРА" />
                                                <NavbarHelpContact text="Кредитен превод CY" />
                                                <NavbarHelpContact text="Вътрешноклонов превод CY" />
                                            </>
                                        } />
                                        <hr className="border-b-1 border-gray-300" />
                                        <SectionToolTip title="ПОКУПКА/ПРОДАЖБА НА ВАЛУТА" contacts={
                                            <>
                                                <NavbarHelpContact text="Покупка/продажба на валута" />
                                                <NavbarHelpContact text="Договаряне на курс" />
                                            </>
                                        } />
                                        <hr className="border-b-1 border-gray-300" />
                                        <SectionToolTip title="РЕГИСТРИ" contacts={
                                            <>
                                                <NavbarHelpContact text="Регистър на пер. преводи" />
                                                <NavbarHelpContact text="Получатели за преводи" />
                                            </>
                                        } />
                                    </div>
                                </>
                            } />

                        <DashboardTopNavbarLink text="Извлечения" icon={<FaArchive />} displayIconProps="rotate-180" position="left-full top-0"
                            displayArrow="block" tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <NavbarHelpContact text="Извлечения сметка" fontSize="text-basic" />
                                        <NavbarHelpContact text="Извлечения по кредитна карта" fontSize="text-basic" />
                                    </div>
                                </>
                            } />
                        <DashboardTopNavbarLink text="Сметки" icon={<IoIosListBox />} />
                        <DashboardTopNavbarLink text="Депозити" icon={<BsSafeFill />} />
                        <DashboardTopNavbarLink text="Карти" icon={<RiBankCardLine />} />
                        <DashboardTopNavbarLink text="Преводи за подпис" icon={<FaPenClip />} />
                        <DashboardTopNavbarLink text="Наредени документи" icon={<MdEditNote />} />
                        <DashboardTopNavbarLink text="Услуги" icon={<SlEnvolopeLetter />} position="left-full top-0" displayArrow="block"
                            tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <NavbarHelpContact text="Отчети по e-mail за сметки" fontSize="text-basic" />
                                        <NavbarHelpContact text="Извлечения по e-mail за карти" fontSize="text-basic" />
                                        <NavbarHelpContact text="Картови авторизации по e-mail" fontSize="text-basic" />
                                        <NavbarHelpContact text="Преводи по SWIFT по e-mail" fontSize="text-basic" />
                                    </div>
                                </>
                            } />
                        <DashboardTopNavbarLink text="Комунални услуги" icon={<BiSolidWallet />} position="left-full top-0" displayArrow="block"
                            tooltipText={
                                <>
                                    <Arrow position="left" />

                                    <div className="w-70">
                                        <SectionToolTip title="ПЛАЩАНЕ НА ЗАДЪЛЖЕНИЯ" contacts={
                                            <>
                                                <NavbarHelpContact text="Задължения, очакващи плащане" />
                                                <NavbarHelpContact text="Плащане на задължения" />
                                                <NavbarHelpContact text="Плащае на общински данъци и такси" />
                                                <NavbarHelpContact text="Еднократно плащане" />
                                            </>
                                        } />
                                        <hr className="border-b-1 border-gray-300" />
                                        <SectionToolTip title="АБОНАТНИ СМЕТКИ" contacts={
                                            <>
                                                <NavbarHelpContact text="Добавяне на абонатна сметка" />
                                                <NavbarHelpContact text="Регистрерани абонатни сметки" />
                                            </>
                                        } />
                                        <hr className="border-b-1 border-gray-300" />
                                        <SectionToolTip title="ДРУГИ" contacts={
                                            <>
                                                <NavbarHelpContact text="Известия по e-mail" fontSize="text-basic" />
                                                <NavbarHelpContact text="История на плащанията" fontSize="text-basic" />
                                            </>
                                        } />
                                    </div>
                                </>
                            } />
                        <DashboardTopNavbarLink text="Декларации" icon={<MdEditDocument />} position="left-full top-0" displayArrow="block"
                            tooltipText={
                                <>
                                        <Arrow position="left" />

                                    <div className="w-70 z-50">
                                        <NavbarHelpContact text="Декларация НОИ" fontSize="text-basic" />
                                        <NavbarHelpContact text="Статистическа форма 100 000 лв." fontSize="text-basic" />
                                        <NavbarHelpContact text="Декларация за произход на средствата" fontSize="text-basic" />
                                        <NavbarHelpContact text="Декларация за презгранични преводи" fontSize="text-basic" />
                                    </div>
                                </>
                            } />
                    </div>
                    <div id="aboutFibank" className="py-2 flex flex-col items-start justify-center border-y-2 border-gray-300">
                        <DashboardMoreInfo pText="ИНФОРМАЦИЯ ЗА FIBANK" tooltip={
                            <>
                                <DashboardTopNavbarLink text="Клонове" icon={<FaUniversity />} />
                                <DashboardTopNavbarLink text="Банкомати" icon={<GrAtm />} />
                                <DashboardTopNavbarLink text="Валутни курсове" icon={<FaChartLine />} />
                                <DashboardTopNavbarLink text="Новини" icon={<FaRegNewspaper />} />
                                <DashboardTopNavbarLink text="Промоции" icon={<FaTag />} />
                            </>
                        } />
                    </div>
                    <div id="more" className="py-2 flex flex-col items-start justify-center">
                        <DashboardMoreInfo pText="ДОПЪЛНИТЕЛНО" tooltip={
                            <>
                                <DashboardTopNavbarLink text="Помощ" icon={<BsInfoLg />} />
                                <DashboardTopNavbarLink text="Към сайта" icon={<LuMonitor />} />
                                <DashboardTopNavbarLink text="Мобилно приложение" icon={<TiVendorAndroid />} icon2={<FaApple />} />
                            </>
                        } />
                    </div>
                </div>
                <div id="mainContent" className="col-span-10 bg-white border-r-2 border-gray-300">
                    <h1 className="text-lg text-gray-500 border-b-2 border-gray-300 p-2">Начало</h1>
                </div>
            </div>
        </>
    );
};