import { Link } from "react-router-dom";
import { renderIcon } from "../utils/iconMap";
import { IoTriangle } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface SectionToolTipProps {
    title: string;
    contacts: React.ReactNode;
}

export const SectionToolTip: React.FC<SectionToolTipProps> = ({ title, contacts }) => {
    const { t } = useTranslation();
    
    return (
        <div>
            <h1 className="text-sm p-2 text-gray-500">{t(title)}</h1>
            {contacts}
        </div>
    );
};

interface MoreInfoProps {
    pText: string;
    tooltip: React.ReactNode;
}

export const MoreInfo: React.FC<MoreInfoProps> = ({ pText, tooltip }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <p onClick={() => setIsOpen(!isOpen)} className="text-xs xl:text-base w-full py-1 flex items-center justify-between pl-3 text-sm text-gray-700 hover:cursor-pointer relative">{t(pText)}
                <IoTriangle className={`text-sm xl:text-base text-gray-400 ${isOpen ? "rotate-180" : "rotate-90"}`} />
            </p>
            {isOpen && (
                <>
                    {tooltip}
                </>
            )}
        </>
    );
};

// CSS class whitelist for security
const allowedStyles = new Set([
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-gray-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
]);

export const sanitizeStyle = (style?: string): string => {
    if (!style || !allowedStyles.has(style)) {
        return 'bg-red-500'; // Default fallback
    }
    return style;
};

// Reusable hook for dynamic CSS injection
export const useDynamicStyles = (level: number) => {
    useEffect(() => {
        const styleId = `group-level-${level}-styles`;
        if (!document.getElementById(styleId)) {
            //new css style element
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .group-level-${level}:hover .group-level-${level}-hover\\:block {
                    display: block !important;
                }
                .group-level-${level}:hover .group-level-${level}-hover\\:text-blue-800 {
                    color: #1e40af !important;
                }
            `;
            //add new <style> into <head> tag
            document.head.appendChild(style);
        }
    }, [level]);
};

interface Button {
    href: string;
    icons: string[];
    label: string;
    style?: string;
};
interface MultiLevelSidebarProps {
    href?: string;
    title?: string;
    label: string;
    icons?: string[];
    fontSize?: string;
    onClick?: () => void;
    hover?: string;
    position?: string;
    groupClass?: string;
    level?: number;
    nextLevel?: MultiLevelSidebarProps[];
};
export interface MenuItem {
    type: "button" | "collapsible" | "multi-level";
    titleCollapse?: string;
    collapsibleItem?: MultiLevelSidebarProps[];
    multiLevelItems?: MultiLevelSidebarProps[];
    buttonItem?: Button;
}

export const MultiLevelSidebar: React.FC<MultiLevelSidebarProps> = ({ href = "", title, label, icons, fontSize = "text-lg", onClick,
    hover = "hover:bg-gray-200", position = "left-full top-0", groupClass = "group", level = 0, nextLevel }) => {

    const { t } = useTranslation();

    groupClass = `group-level-${level}`;

    // Reusable hook for dynamic styles
    //At every level adds new style into <head> which is read below
    useDynamicStyles(level);

    return (
        <>
            {title && (
                <h1 className="text-xs xl:text-sm p-2 text-gray-500">{t(title)}</h1>
            )}

            <div className={`text-sm xl:text-base w-full relative ${groupClass} flex items-center justify-between space-x-2 py-2 px-3 ${hover}`}>
                <div className="flex items-center space-x-2">
                    {nextLevel && nextLevel.length > 0 && (
                        <div className={`absolute ${position} z-50 bg-white border-2 border-gray-300 hidden ${groupClass}-hover:block min-w-70 shadow-lg rounded-md`}>
                            {nextLevel.map((child, index) => (
                                <MultiLevelSidebar key={index} href={child.href} title={child.title} label={child.label}
                                    icons={child.icons} level={level + 1} nextLevel={child.nextLevel} />
                            ))}
                        </div>
                    )}

                    {icons && (
                        <span className={`flex text-gray-500 ${groupClass}-hover:text-blue-800`}>
                            {icons?.map((icon, index) => (
                                <span key={index}>
                                    {typeof icon === 'string' ? renderIcon(icon) : icon}
                                </span>
                            ))}
                        </span>)}

                    <Link onClick={onClick} to={href} className={`text-sm xl:text-lg text-black ${groupClass}-hover:text-blue-800`}>
                        {t(label)}
                    </Link>
                </div>

                {(nextLevel && nextLevel.length > 0) && (
                    <IoTriangle className={`text-gray-400 rotate-90 block`} />
                )}
            </div>
        </>
    );
};