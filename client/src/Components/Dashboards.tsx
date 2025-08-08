import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoTriangle } from 'react-icons/io5';

interface DashboardNavbarLinkProps {
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

export const DashboardNavbarLink: React.FC<DashboardNavbarLinkProps> = ({ href = "", text, displayIconProps = "unhidden",
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

                <Link onClick={onClick} to={href} className={`${fontSize} text-black group-hover:text-blue-800`}>
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