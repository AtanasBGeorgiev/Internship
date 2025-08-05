import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import { Arrow, LangSwitcher } from './Common';
import { renderIcon } from '../utils/iconMap';

interface NavbarLinkProps {
    type?: "link" | "tooltipLink" | "logout";
    href?: string;
    icons?: React.ReactNode[];
    text: string;
    tooltipText?: React.ReactNode;
    onClick?: () => void;
    displayIconProps?: string;
};

export const NavbarLink: React.FC<NavbarLinkProps> = ({ type = "link", href = "", icons, text, tooltipText, onClick, displayIconProps }) => {
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
            {icons && icons.map((icon, index) => (
                <span key={index} className={`${displayIconProps} text-gray-700 group-hover:text-blue-800`}>{icon}</span>
            ))}

            {type === "logout" ?
                <Link onClick={onClick} to={href} className={`text-black group-hover:text-blue-800`}>
                    {text}
                </Link> :
                type === "link" ?
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
            <a href={href} className="text-xs sm:text-basic md:text-lg my-1 flex items-center group hover:underline hover:text-blue-800">
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

interface TooltipSectionItem {
    icon: string;
    text: string;
}

interface TooltipSection {
    title: string;
    items: TooltipSectionItem[];
}

interface Tooltip {
    arrowPosition: string;
    bgImage?: string;
    title?: string;
    buttonText?: string;
    buttonHref?: string;
    sections?: TooltipSection[];
}

interface MenuItem {
    type: string;
    text?: string;
    href?: string;
    iconGroup?: string[];
    icons?: string[];
    style?: string;
    tooltipItems?: string[];
    tooltip?: Tooltip;
    items?: Array<{
        text: string;
        icon?: string;
        icons?: string[];
        href?: string;
    }>;

    english?: string;
    bulgarian?: string;

    onClick?: string;
}

interface NavbarContentProps {
    data: MenuItem[];
}

export const NavbarContent: React.FC<NavbarContentProps> = ({ data }) => {
    const { t } = useTranslation();

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
    };

    return (
        <>
            {data.map((item: MenuItem, index) => {
                switch (item.type) {
                    case "langSwitcher":
                        return (
                            <LangSwitcher key={index} english={item.english as string} bulgarian={item.bulgarian as string} />
                        );
                    case "link":
                        return (
                            <NavbarLink key={index} icons={item.icons?.map(icon => renderIcon(icon))}
                                text={t(item.text as string)}
                            />
                        );
                    case "tooltipLink":
                        return (
                            <NavbarLink key={index} icons={item.icons?.map(icon => renderIcon(icon))} text={t(item.text as string)}
                                tooltipText={
                                    item.tooltip && (
                                        <>
                                            <Arrow position={item.tooltip.arrowPosition as string} bgColor={`${item.tooltip.sections ? "bg-white" : "bg-gray-200"}`} />

                                            {item.tooltip.sections ? (
                                                <div className="w-60 text-left">
                                                    {item.tooltip.sections.map((section, sIndex) => (
                                                        <div key={sIndex}
                                                            className={sIndex === 0 ? "border-b-2 border-gray-300 pb-2" : "pt-2"}
                                                        >
                                                            <strong className="pl-2">{t(section.title)}</strong>
                                                            {section.items.map((el, i) => (
                                                                <NavbarHelpContact
                                                                    key={i}
                                                                    icon={renderIcon(el.icon)}
                                                                    text={t(el.text)}
                                                                    fontSize="text-xs"
                                                                />
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="w-60 h-40 text-center flex flex-col justify-between items-center 
                                                    bg-cover bg-center p-2"
                                                    style={{ backgroundImage: `url(${item.tooltip.bgImage})` }}>
                                                    <h1 className="font-bold text-left text-blue-800">
                                                        {t(item.tooltip.title as string)}
                                                    </h1>
                                                    <a href={item.tooltip.buttonHref || "#"}
                                                        className="bg-white text-black p-2 rounded hover:bg-gray-200">
                                                        {t(item.tooltip.buttonText as string)}
                                                    </a>
                                                </div>
                                            )}
                                        </>
                                    )
                                }
                            />
                        );
                    case "logout":
                        return (
                            <NavbarLink key={index} icons={item.icons?.map(icon => renderIcon(icon))} text={t(item.text as string)}
                                onClick={item.onClick ? () => handleLogout() : undefined} href={item.href} type="logout"
                                displayIconProps="-rotate-90"
                            />
                        );

                    default:
                        return null;
                }
            })}
        </>
    );
};

export const NavbarMenu: React.FC<NavbarContentProps> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Бутонът трябва да е винаги наличен */}
            <div className="lg:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-700 hover:text-blue-800 focus:outline-none"
                >
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
                    <NavbarContent data={data} />
                </div>
            )}
        </>
    );
};