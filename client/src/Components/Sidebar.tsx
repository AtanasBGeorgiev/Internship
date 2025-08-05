import React, { useState } from 'react';
import menu from '../data/sidebar.json';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { renderIcon } from "../utils/iconMap";
import { NavbarHelpContact } from './Navbar';
import { Arrow } from './Common';
import { IoTriangle } from 'react-icons/io5';

// Type definitions for better type safety
interface MenuItem {
    type: string;
    label: string;
    path?: string;
    iconGroup?: string[];
    icons?: string[];
    style?: string;
    tooltipItems?: string[];
    sections?: Array<{
        title: string;
        items: string[];
    }>;
    items?: Array<{
        label: string;
        icon?: string;
        icons?: string[];
        path?: string;
    }>;
}

interface SectionToolTipProps {
    title: string;
    contacts: React.ReactNode;
}

// CSS class whitelist for security
const allowedStyles = new Set([
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-gray-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
]);

const sanitizeStyle = (style?: string): string => {
    if (!style || !allowedStyles.has(style)) {
        return 'bg-red-500'; // Default fallback
    }
    return style;
};

const SectionToolTip: React.FC<SectionToolTipProps> = ({ title, contacts }) => {
    return (
        <div>
            <h1 className="text-sm p-2 text-gray-500">{title}</h1>
            {contacts}
        </div>
    );
};

interface DashboardMoreInfoProps {
    pText: string;
    tooltip: React.ReactNode;
}

const DashboardMoreInfo: React.FC<DashboardMoreInfoProps> = ({ pText, tooltip }) => {
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

interface SidebardNavLinkProps {
    href?: string;
    text: string;
    displayIconProps?: string;
    tooltipText?: React.ReactNode;
    icons?: React.ReactNode[];
    fontSize?: string;
    onClick?: () => void;
    hover?: string;
    position?: string;
    displayArrow?: string;
};

export const SidebardNavLink: React.FC<SidebardNavLinkProps> = ({ href = "", text, displayIconProps = "unhidden",
    tooltipText, icons, fontSize = "text-lg", onClick, hover = "hover:bg-gray-200", position = "top-full", displayArrow = "hidden" }) => {
    return (

        <div className={`w-full relative group flex items-center justify-between py-2 px-2 lg:px-3 ${hover}`}>
            <div className="flex items-center space-x-2">
                {tooltipText && (
                    <div className={`absolute ${position} z-50 bg-white border-2 border-gray-300 hidden group-hover:block`}>
                        {tooltipText}
                    </div>
                )}

                {icons && (<span className={`${displayIconProps} flex text-gray-500 group-hover:text-blue-800`}>
                    {icons.map((icon, index) => (
                        <span key={index}>{icon}</span>
                    ))}
                </span>)}

                <Link onClick={onClick} to={href} className={`${fontSize} text-black group-hover:text-blue-800`}>
                    {text}
                </Link>
            </div>

            <IoTriangle className={`text-gray-400 rotate-90 ${displayArrow}`} />
        </div>

    );
};

export const SidebarMenu: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="col-span-2 border-x-2 border-gray-300 bg-white">
            <div className="py-2 flex flex-col items-start justify-center">
                {menu.map((item: MenuItem, index) => {
                    const itemKey = `${item.type}-${item.label}-${index}`;

                    switch (item.type) {
                        case "button":
                            return (
                                <div key={itemKey} className={`flex items-center flex-row gap-3 justify-center w-4/5
                            mx-auto my-3 font-bold text-center p-2 ${sanitizeStyle(item.style)} text-white rounded-s`}>
                                    <div>
                                        {item.iconGroup?.map((icon: string, i: number) => (
                                            <span key={`${itemKey}-icon-${i}`}>{renderIcon(icon)}</span>
                                        ))}
                                    </div>
                                    <Link to={item?.path || ""}>{t(item.label)}</Link>
                                </div>
                            );
                        case "link":
                            return (
                                <SidebardNavLink key={itemKey} text={t(item.label)}
                                    icons={item.icons?.map((iconName: string) => renderIcon(iconName)) ?? []} href={item.path} />
                            );
                        case "tooltip":
                            return (
                                <SidebardNavLink key={itemKey} text={t(item.label)}
                                    icons={item.icons?.map((iconName: string) => renderIcon(iconName)) ?? []} displayArrow="block"
                                    position="left-full top-0"
                                    tooltipText={
                                        <>
                                            <Arrow position="left" />
                                            <div className="w-70">
                                                {item.tooltipItems?.map((txt: string, i: number) => (
                                                    <NavbarHelpContact key={`${itemKey}-tooltip-${i}`} text={t(txt)} />
                                                ))}
                                            </div>
                                        </>
                                    } />
                            );
                        case "tooltip-sections":
                            return (
                                <SidebardNavLink key={itemKey} text={t(item.label)}
                                    icons={item.icons?.map((iconName: string) => renderIcon(iconName)) ?? []} displayArrow="block"
                                    position="left-full top-0"
                                    tooltipText={
                                        <>
                                            <Arrow position="left" />
                                            <div className="w-70">
                                                {item.sections?.map((section, i: number) => (
                                                    <SectionToolTip key={`${itemKey}-section-${i}`} title={t(section.title)}
                                                        contacts={section.items.map((txt: string, j: number) => (
                                                            <NavbarHelpContact key={`${itemKey}-section-${i}-item-${j}`} text={t(txt)} />
                                                        ))}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    } />
                            );
                        case "collapsible":
                            return (
                                <div className="w-full py-2 flex flex-col items-start justify-center border-t-2 border-gray-300">
                                    <DashboardMoreInfo key={itemKey} pText={t(item.label)}
                                        tooltip={
                                            <div className="w-full">
                                                {item.items?.map((child, i: number) => (
                                                    <SidebardNavLink key={`${itemKey}-child-${i}`} text={t(child.label)}
                                                        icons={child.icons?.map((iconName: string) => renderIcon(iconName)) ?? []}
                                                        href={child.path} />
                                                ))}
                                            </div>
                                        } />
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </div>
        </div>
    );
};