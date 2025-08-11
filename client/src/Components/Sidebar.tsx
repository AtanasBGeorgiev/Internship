import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { renderIcon } from '../utils/iconMap';
import { useTranslation } from 'react-i18next';
import { type MenuItem, MoreInfo, sanitizeStyle } from './RecursiveSidebarComp';
import { MultiLevelSidebar } from './RecursiveSidebarComp';
import { showGlobalError } from '../utils/errorHandler';
import { fetchSidebarMenu } from '../services/authService';

interface RenderSidebarComponentProps {
    item: MenuItem;
    itemKey: string;
};

const RenderButton: React.FC<RenderSidebarComponentProps> = ({ item, itemKey }) => {
    const { t } = useTranslation();

    return (
        <div key={itemKey} className={`flex items-center flex-row gap-3 justify-center w-4/5
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
                                icons={child.icons} href={child.href} title={child.title}
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
    return (
        <>
            {item.multiLevelItems?.map((child, i: number) => (
                <MultiLevelSidebar key={`${itemKey}-child-${i}`} label={child.label}
                    icons={child.icons} href={child.href} title={child.title}
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

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                setLoading(true);
                setError(null);

                const menuData = await fetchSidebarMenu();
                setMenu(menuData);
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
            <div className="col-span-2 border-x-2 border-gray-300 bg-white">
                <div className="p-4 text-center text-gray-600">Зареждане...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="col-span-2 border-x-2 border-gray-300 bg-white">
                <div className="p-4 text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="col-span-2 border-x-2 border-gray-300 bg-white">
            <div className="py-2 flex flex-col items-start justify-center">
                <RecursiveMenu items={menu} />
            </div>
        </div>
    );
};