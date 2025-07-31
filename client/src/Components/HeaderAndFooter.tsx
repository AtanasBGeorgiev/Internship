import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { BiSolidConversation } from 'react-icons/bi';
import { FaPhone, FaEnvelope, FaApple } from 'react-icons/fa';
import { IoDocumentLockOutline, IoDocumentTextSharp } from 'react-icons/io5';
import { BsQuestionLg, BsInfoLg } from "react-icons/bs";
import { LuMonitor } from "react-icons/lu";
import { TiVendorAndroid } from "react-icons/ti";
import { TbClipboardList } from "react-icons/tb";

import { Arrow, LangSwitcher } from './Common';

interface FooterLinkProps {
    href?: string;
    displayProps?: string;
    icon?: React.ReactNode;
    text: string;
};

export const FooterLink: React.FC<FooterLinkProps> = ({ href = "", displayProps = "pt-2 pb-2 pr-2 pl-2 border-r-1 border-gray-400 hover:underline",
    icon, text }) => {
    return (
        <div className={`relative group flex items-center justify-center py-2 px-2 lg:px-3`}>
            {icon && <span className={`mx-2 text-xl text-gray-700 group-hover:text-blue-800`}>{icon}</span>}
            <a href={href}  className={`${displayProps}`}>{text} {'>'}</a>
        </div>
    );
};

interface NavbarLinkProps {
    href?: string;
    icon?: React.ReactNode;
    icon2?: React.ReactNode;
    text: string;
    tooltipText?: React.ReactNode;
};

export const NavbarLink: React.FC<NavbarLinkProps> = ({ href = "", icon, icon2, text, tooltipText }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        //media query = true if the screen is less than 1024px
        const mediaQuery = window.matchMedia("(max-width: 1024px)");
        setIsMobile(mediaQuery.matches);

        //listener for the changes of the screen width
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);

        //clear the listener
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return (
        <div onClick={() => isMobile && setShowTooltip((prev) => !prev)} className="relative group flex items-center justify-center space-x-1">
            {tooltipText &&
                <div className={`absolute top-full z-50 bg-white border-2 border-gray-300 ${isMobile ? showTooltip ? "block" : "hidden" : "hidden group-hover:block"}`}>
                    {tooltipText}
                </div>
            }
            {icon && <span className={`text-gray-700 group-hover:text-blue-800`}>{icon}</span>}
            {icon2 && <span className={`text-gray-700 group-hover:text-blue-800`}>{icon2}</span>}

            {tooltipText ?
                <Link className="group-hover:text-blue-800" to={""}>{text}</Link>
                :
                <Link className="group-hover:text-blue-800" to={href} >{text}</Link>
            }
        </div>
    );
};

interface ContactInfoProps {
    icon?: React.ReactNode;
    text: string;
    spanText?: string;
    moreText?: string;
    isLink?: boolean;
    href?: string;
    fontSize?: string;
};

export const ContactInfo: React.FC<ContactInfoProps> = ({ icon, text, spanText, moreText = "", isLink = false, href = "" }) => {
    if (isLink === true) {
        return (
            <a href={href}  className="text-xs sm:text-basic md:text-lg my-1 flex items-center group hover:underline hover:text-blue-800">
                {icon && <span className={`mx-2 text-basic md:text-xl text-gray-700 group-hover:text-blue-800`}>{icon}</span>}
                {text}:<span className="text-blue-800 font-bold ml-1"> {spanText}</span> {moreText}
            </a>
        );
    }
    else {
        return (
            <p className="my-1 pr-10 flex items-center">
                {icon && <span className={`mx-2 text-basic md:text-xl text-gray-700 group-hover:text-blue-800`}>{icon}</span>}
                {text}: <span className="text-blue-800 font-bold mx-1">{spanText}</span> {moreText}
            </p>
        );
    }
};

export const NavbarHelpContact: React.FC<ContactInfoProps> = ({ icon, text, spanText = "", moreText = "", isLink = false, href = "", fontSize = "text-basic" }) => {
    return (
        <p className={`pl-2 w-full flex items-center py-2 ${fontSize} text-gray-700 font-bold hover:text-blue-800 hover:bg-gray-200`}>
            {icon && <span className={`mx-2 text-basic md:text-xl`}>{icon}</span>}
            {text}
        </p>
    );
};

export const AllNavbarLinks: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <LangSwitcher english="English" bulgarian="Български" />

            <NavbarLink icon={<LuMonitor />} text={t('Към сайта')} />

            <NavbarLink
                icon={<FaApple />}
                icon2={<TiVendorAndroid />}
                text={t('Мобилно приложение')}
                tooltipText={
                    <>
                        <Arrow position="top" bgColor="bg-gray-200" />

                        <div className="w-60 h-40 text-center flex flex-col justify-between items-center bg-[url('/bashar.jpg')] bg-cover bg-center p-2">
                            <h1 className="font-bold text-left text-blue-800">
                                {t('Банкирай навсякъде, по всяко време')}
                            </h1>

                            <a href="" className="bg-white text-black p-2 rounded hover:bg-gray-200">
                                {t('НАУЧЕТЕ ПОВЕЧЕ')}
                            </a>
                        </div>
                    </>
                }
            />

            <NavbarLink icon={<TbClipboardList />} text={t('Промени в ОУ и тарифа')} />

            <NavbarLink
                icon={<BsInfoLg />}
                text={t('Помощ')}
                tooltipText={
                    <>
                        <Arrow position="top" />

                        <div className="w-60 text-left">
                            <div className="border-b-2 border-gray-300 pb-2">
                                <strong className="pl-2">{t('Информация')}</strong>
                                <NavbarHelpContact icon={<IoDocumentTextSharp />} text={t('Помощни статии')} fontSize="text-xs" />
                                <NavbarHelpContact icon={<BsQuestionLg />} text={t('Често задавани въпроси')} fontSize="text-xs" />
                                <NavbarHelpContact icon={<IoDocumentLockOutline />} text={t('Съвети за сигурност')} fontSize="text-xs" />
                            </div>
                            <div className="pt-2">
                                <strong className="pl-2">{t('Връзка с нас')}</strong>
                                <NavbarHelpContact icon={<FaPhone />} text={t('0700 12 777')} fontSize="text-xs" />
                                <NavbarHelpContact icon={<FaEnvelope />} text={t('help@fibank.bg')} fontSize="text-xs" />
                                <NavbarHelpContact icon={<BiSolidConversation />} text={t('Онлайн чат')} fontSize="text-xs" />
                            </div>
                        </div>
                    </>
                }
            />
        </>
    );
};

export const NavbarMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="lg:hidden">
                <button onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-700 hover:text-blue-800 focus:outline-none">
                    {/* viewBox="0 0 24 24" - coordinates of the svg */}
                    {/* d="M6 18L18 6M6 6l12 12" - drawing the lines */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white z-50 px-4 pb-4 space-y-2 shadow-lg">
                    <AllNavbarLinks />
                </div>
            )}
        </>
    );
};