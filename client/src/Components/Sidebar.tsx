import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { renderIcon } from '../utils/iconMap';
import { useTranslation } from 'react-i18next';

import { FaEnvelope, FaPhone } from "react-icons/fa";
import { IoMdChatboxes } from 'react-icons/io';

import { type MenuItem, MoreInfo, sanitizeStyle, MultiLevelSidebar } from './RecursiveSidebarComp';
import { showGlobalError } from '../utils/errorHandler';
import { fetchSidebarMenu, getUserData } from '../services/authService';
import { UserAndClient } from './ProfileMenuBusiness';
import { useClientContext } from '../context/ClientContext';
import { usePosition } from '../context/PositionContext';
import { NavbarHelpContact } from './Navbar';

interface RenderSidebarComponentProps {
    item: MenuItem;
    itemKey: string;
};

const RenderButton: React.FC<RenderSidebarComponentProps> = ({ item, itemKey }) => {
    const { t } = useTranslation();

    const { setPosition } = usePosition();
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            setPosition("button", {
                top: rect.top,
                left: rect.left,
                right: rect.right,
                bottom: rect.bottom
            });
        }
    }, [iconRef.current]);

    return (
        <div ref={iconRef} key={itemKey} className={`text-xs xl:text-base flex items-center flex-row gap-3 justify-center w-4/5
        mx-auto my-3 font-bold text-center p-2 ${sanitizeStyle(item.buttonItem?.style)} text-white rounded-s`}>
            <div>
                {item.buttonItem?.icons?.map((icon, i) => (
                    <span key={`${itemKey}-icon-${i}`}>{renderIcon(icon)}</span>
                ))}
            </div>
            <Link to={item?.buttonItem?.href || ""}>{t(item.buttonItem?.label as string)}</Link>
        </div>
    );
};

const RenderCollapsible: React.FC<RenderSidebarComponentProps> = ({ item, itemKey }) => {
    const { t } = useTranslation();

    return (
        <div key={itemKey} className="w-full py-2 flex flex-col items-start justify-center border-t-2 border-gray-300">
            <MoreInfo
                pText={t(item.titleCollapse as string)}
                tooltip={
                    <div className="w-full">
                        {item.collapsibleItem?.map((child, i: number) => (
                            <MultiLevelSidebar key={`${itemKey}-child-${i}`} label={t(child.label)}
                                icons={child.icons} href={child.href} title={t(child.title as string)}
                                nextLevel={child.nextLevel} level={0}
                            />
                        ))}
                    </div>
                }
            />
        </div>
    );
};

const RenderMultiLevel: React.FC<RenderSidebarComponentProps> = ({ item, itemKey }) => {
    const { t } = useTranslation();

const RenderMultiLevel: React.FC<RenderSidebarComponentProps> = ({ item, itemKey }) => {
    return (
        <>
            {item.multiLevelItems?.map((child, i: number) => (
                <MultiLevelSidebar key={`${itemKey}-child-${i}`} label={child.label}
                    icons={child.icons} href={child.href} title={t(child.title as string)}
                    nextLevel={child.nextLevel} level={0}
                />
            ))}
        </>
    );
};

interface RecursiveMenuProps {
    items: MenuItem[];
}

const RecursiveMenu: React.FC<RecursiveMenuProps> = ({ items }) => {
    return (
        <>
            {items?.map((item, index) => {
                const itemKey = `${item.type}-${index}`;

                switch (item.type) {
                    case "button":
                        return <RenderButton item={item} itemKey={itemKey} />;
                    case "multi-level":
                        return <RenderMultiLevel item={item} itemKey={itemKey} />;
                    case "collapsible":
                        return <RenderCollapsible item={item} itemKey={itemKey} />;
                    default:
                        return null;
                }
            })}
        </>
    );
};

// Main Sidebar component
export const SidebarMenu: React.FC = () => {
    const [menu, setMenu] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userNames, setUserNames] = useState<string>("");
    const { selectedClient } = useClientContext();

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                setError(null);

                const menuData = await fetchSidebarMenu();
                setMenu(menuData);
                const userRoleData = await getUserData();
                setUserRole(userRoleData[1]);
                setUserNames(userRoleData[3]);
            } catch (err) {
                console.error('Error fetching sidebar menu:', err);
                setError('Failed to load menu');
                showGlobalError('Failed to load sidebar menu');
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    if (loading) {
        return (
            <div className="border-x-2 border-gray-300 bg-white">
                <div className="p-4 text-center text-gray-600">Зареждане...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="hidden xl:block border-x-2 border-gray-300 bg-white xl:col-span-2">
                <div className="p-4 text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="xl:block border-x-2 border-gray-300 bg-white xl:col-span-2">
            <div className="py-2 flex flex-col items-start justify-center">
                {userRole === "user" && <p className='text-xs xl:text-sm text-gray-600 p-2'>Счетоводна дата: 10/Сеп/2025</p>}
                {userRole === "user" ? <UserAndClient userNames={userNames} selectedclient={selectedClient?.name || ""} displaySideIcon={true} getPosition={true} /> : null}
                <RecursiveMenu items={menu} />
                <SidebarHelpSection />
            </div>
        </div>
    );
};

const SidebarHelpSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="border-y-2 border-gray-300 xl:hidden text-left text-sm relative">
            <div className="flex-1">
                <h3 className='font-bold px-3'>{t("Имате въпроси и нужда от помощ?")}</h3>
                <NavbarHelpContact icon={<FaPhone />} text="0700 12 7777" fontSize="text-sm" />
                <NavbarHelpContact icon={<FaEnvelope />} text="e-bank@fibank.bg" fontSize="text-sm" />
                <button className='flex items-center justify-center space-x-2 p-2 ml-2 mb-2 text-black font-bold border-2 border-gray-300 rounded-md hover:cursor-pointer'>
                    <IoMdChatboxes />
                    <p>{t("Онлайн чат")}</p>
                </button>
            </div>

                <img
                    src="icon-call-center.png"
                    alt="Help illustration"
                    className="absolute bottom-0 right-0 w-18 h-27"
                />
        </div>
    );
};