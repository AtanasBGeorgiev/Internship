import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiSolidConversation } from 'react-icons/bi';
import { FaPhone, FaEnvelope, FaApple } from 'react-icons/fa';
import { IoDocumentLockOutline, IoDocumentTextSharp, IoTriangle } from 'react-icons/io5';
import { BsQuestionLg, BsInfoLg } from "react-icons/bs";
import { LuMonitor } from "react-icons/lu";
import { TiVendorAndroid } from "react-icons/ti";
import { TbClipboardList } from "react-icons/tb";

interface InputProps {
    id: string;
    label: string;
    type?: string;
    required?: boolean;
    register?: UseFormRegisterReturn;
    error?: FieldError;
    tooltipContent?: React.ReactNode;
};

export const FormField: React.FC<InputProps> = ({ id, label, type = "text", required = true, register, error, tooltipContent }) => {
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
        <>
            <label htmlFor={id}>
                {required && <span className="text-red-500">*</span>}
                {label}
            </label>
            <div className="relative">
                <div className="relative">
                    <input id={id} type={type} required={required} {...register}
                        className={`border-2 p-1 pr-8 rounded-sm w-full focus:outline-none ${error ? "border-red-500" : "border-gray-300 focus:border-blue-800"
                            }`} />

                    {tooltipContent && (
                        <div className={`absolute inset-y-0 right-2 flex items-center ${isMobile ? "" : "group"}`}>
                            <img src="/icon-input-requirments.png" alt="input requirements" className="w-4 h-4 cursor-pointer"
                                onClick={() => isMobile && setShowTooltip((prev) => !prev)} />

                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2  mb-2 bg-white w-60 text-xs 
                        border-2 border-gray-300 rounded p-2 z-10 shadow-lg
                        ${isMobile ? showTooltip ? "block" : "hidden" : "hidden group-hover:block"}`}>
                                {tooltipContent}
                            </div>
                        </div>
                    )}

                    {error && <Arrow position="red" />}
                </div>
                {error && (
                    <div className="text-red-500 text-xs mt-2 text-right">
                        {error.message}
                    </div>
                )}
            </div>
        </>
    );
};

interface ButtonFormProps {
    type?: "submit";
    text: string;
};

export const ButtonForm: React.FC<ButtonFormProps> = ({ type = "submit", text }) => {
    return (
        <button type={type} className="w-full bg-blue-800 text-white p-2 mt-2 mb-4 hover:cursor-pointer text-xssm md:text-basic">{text}</button>
    );
};

interface FormFieldWithIconProps {
    id: string;
    label: string;
    type?: string;
    required?: boolean;
    register?: UseFormRegisterReturn;
    error?: FieldError;
    icon: React.ReactNode;
    isVisible?: string;
};

export const FormFieldWithIcon: React.FC<FormFieldWithIconProps> = ({ id, label, type = "text", required = true, icon,
    isVisible = "hidden", register, error }) => {
    return (
        <>
            <label htmlFor={id} className="text-xs md:text-basic flex items-center w-full">
                <span className="text-red-500">*</span> {label}:
                <span className={`${isVisible} text-xs text-gray-700 ml-auto`}>
                    <span className="text-red-500">*</span> Задължителни полета
                </span>
            </label>


            <div className="relative">
                <input id={id} type={type} required={required} {...register}
                    className={`w-full pl-10 border-2 ${error ? "border-red-500" : "border-gray-300"} rounded-sm p-1 focus:border-blue-800 focus:outline-none mt-1`}
                />
                {icon && <span className="text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4">{icon}</span>}
                {error && <Arrow position="red" />}
            </div>
            {error && (
                <div className="text-red-500 text-xs mt-2 text-right">
                    {error.message}
                </div>
            )}
        </>
    );
};

interface AnnouncmentProps {
    hText: string;
    pText: string;
    aText: string;
    /* със ?, защото нямам конкретни връзки */
    href?: string;
    aDisplayProps?: string;
    borderProp1?: string;
    borderProp2?: string;
};

export const Announcment: React.FC<AnnouncmentProps> = ({ hText, pText, aText, href = "",
    aDisplayProps = "hover:text-blue-800 hover:underline", borderProp1 = "border-b-2", borderProp2 = "border-gray-300" }) => {
    return (
        <div className={`${borderProp1} ${borderProp2} pb-4`}>
            <h3 className="text-base md:text-xl font-bold pt-2">{hText}</h3>
            <p className="text-xs md:text-basic pt-2 pb-2">{pText}</p>
            <a href={href} target="_blank" className={`text-sm md:text-basic text-blue-800 hover:underline ${aDisplayProps}`}>{aText} {'>'}</a>
        </div>
    );
};

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
            <a href={href} target="_blank" className={`${displayProps}`}>{text} {'>'}</a>
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
    return (
        <div className="relative group flex items-center justify-center space-x-1">
            {tooltipText &&
                <div className="absolute top-full z-50 bg-white border-2 border-gray-300 hidden group-hover:block">
                    {tooltipText}
                </div>
            }
            {icon && <span className={`text-gray-700 group-hover:text-blue-800`}>{icon}</span>}
            {icon2 && <span className={`text-gray-700 group-hover:text-blue-800`}>{icon2}</span>}
            <Link className="group-hover:text-blue-800" to={href} target="_blank">{text}</Link>
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
            <a href={href} target="_blank" className="text-xs sm:text-basic md:text-lg my-1 flex items-center group hover:underline hover:text-blue-800">
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
    return (
        <>
            <NavbarLink text="English" />
            <NavbarLink icon={<LuMonitor />} text="Към сайта" />
            <NavbarLink icon={<FaApple />} icon2={<TiVendorAndroid />} text="Мобилно приложение"
                tooltipText={
                    <>
                        <Arrow position="top" />

                        <div className="bg-gradient-to-b from-blue-700 to-white w-60 text-center flex flex-col items-center">
                            <h1 className="font-bold self-start text-left p-1">Банкирай навсякъде, по всяко време</h1>
                            <img src="/icon-bashar.jpg" alt="bashar" className="w-20 h-20 my-2" />
                            <a href="" className="bg-white text-black p-2 m-4 rounded hover:bg-gray-200">
                                НАУЧЕТЕ ПОВЕЧЕ
                            </a>
                        </div>
                    </>
                }
            />
            <NavbarLink icon={<TbClipboardList />} text="Промени в ОУ и тарифа" />
            <NavbarLink icon={<BsInfoLg />} text="Помощ"
                tooltipText={
                    <>
                        <Arrow position="top" />

                        <div className="w-60 text-left">
                            <div className="border-b-2 border-gray-300 pb-2">
                                <strong className="pl-2">Информация</strong>
                                <NavbarHelpContact icon={<IoDocumentTextSharp />} text="Помощни статии" fontSize="text-xs" />
                                <NavbarHelpContact icon={<BsQuestionLg />} text="Често задавани въпроси" fontSize="text-xs" />
                                <NavbarHelpContact icon={<IoDocumentLockOutline />} text="Съвети за сигурност" fontSize="text-xs" />
                            </div>
                            <div className="pt-2">
                                <strong className="pl-2">Връзка с нас</strong>
                                <NavbarHelpContact icon={<FaPhone />} text="0700 12 777" fontSize="text-xs" />
                                <NavbarHelpContact icon={<FaEnvelope />} text="help@fibank.bg" fontSize="text-xs" />
                                <NavbarHelpContact icon={<BiSolidConversation />} text="Онлайн чат" fontSize="text-xs" />
                            </div>
                        </div>
                    </>
                } />
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

export function hideMessag(setMessage: (message: string | null) => void, setMessageType: (type: 'success' | 'error' | null) => void) {
    setTimeout(() => {
        setMessage(null);
        setMessageType(null);
    }, 7000);
};

interface MessageProps {
    message: string | null;
    messageType: "success" | "error" | null;
}
export const ShowMessage: React.FC<MessageProps> = ({ message, messageType }) => {
    if (message) {
        return (
            <p className={`text-sm md:text-basic text-center p-4 ${messageType === "success" ? "text-green-600 md:font-bold" : "text-red-500"}`}>
                {message}
            </p>
        );
    }
};

interface DashboardTopNavbarLinkProps {
    href?: string;
    text: string;
    displayIconProps?: string;
    tooltipText?: React.ReactNode;
    icon?: React.ReactNode;
    icon2?: React.ReactNode;
    fontSize?: string;
    onClick?: () => void;
    hover?: string;
    position?: string;
    displayArrow?: string;
};

export const DashboardTopNavbarLink: React.FC<DashboardTopNavbarLinkProps> = ({ href = "", text, displayIconProps = "unhidden",
    tooltipText, icon, icon2, fontSize = "text-lg", onClick, hover = "hover:bg-gray-200", position = "top-full", displayArrow = "hidden" }) => {
    return (

        <div className={`w-full relative group flex items-center justify-between py-2 px-2 lg:px-3 ${hover}`}>
            <div className="flex items-center space-x-2">
                {tooltipText && (
                    <div className={`absolute ${position} z-50 bg-white border-2 border-gray-300 hidden group-hover:block`}>
                        {tooltipText}
                    </div>
                )}

                {icon && (<span className={`${displayIconProps} flex text-gray-500 group-hover:text-blue-800`}>
                    {icon} {icon2}</span>)}

                <Link onClick={onClick} to={href} target="_blank" className={`${fontSize} text-black group-hover:text-blue-800`}>
                    {text}
                </Link>
            </div>

            <IoTriangle className={`text-gray-400 rotate-90 ${displayArrow}`} />
        </div>

    );
};

interface DashboardMoreInfoProps {
    pText: string;
    tooltip: React.ReactNode;
};
export const DashboardMoreInfo: React.FC<DashboardMoreInfoProps> = ({ pText, tooltip }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <p onClick={() => setIsOpen(!isOpen)} className="w-full py-1 flex items-center justify-between pl-3 text-sm text-gray-700 hover:cursor-pointer relative">{pText}
                <IoTriangle className={`text-gray-400 ${isOpen ? "rotate-180" : "rotate-90"}`} />
            </p>
            {isOpen && (
                <>
                    {tooltip}
                </>
            )}
        </>
    );
};

interface SectionToolTipProps {
    title: string;
    contacts: React.ReactNode;
};
export const SectionToolTip: React.FC<SectionToolTipProps> = ({ title, contacts }) => {
    return (
        <div>
            <h1 className="text-sm p-2 text-gray-500">{title}</h1>
            {contacts}
        </div>
    );
};

interface ArrowProps {
    position: string;
};
export const Arrow: React.FC<ArrowProps> = ({ position }) => {
    if (position === "left") {
        return (
            <div className="absolute -left-2 top-3 w-4 h-4 bg-white border-l-2 border-b-2 border-gray-300 rotate-45 z-[-1]"></div>
        );
    }
    if (position === "top") {
        return (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l-2 border-t-2 
            border-gray-300 rotate-45 z-[-1]"></div>
        );
    }
    if (position === "bottom") {
        return (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border-r-2 border-b-2 
            border-gray-300 rotate-45 z-[-1]"></div>
        );
    }
    if (position === "red") {
        return (
            <div className="absolute bottom-0 right-1/20 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white border-r-2 border-b-2 
            border-red-500 rotate-45 z-10"></div>
        );
    }
};