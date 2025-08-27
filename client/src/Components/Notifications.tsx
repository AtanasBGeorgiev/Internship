import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

import { MdCreditCard } from "react-icons/md";
import { SiJsonwebtokens } from "react-icons/si";
import { TbBaselineDensityMedium, TbXboxXFilled } from "react-icons/tb";

import { getNotifications, getUserData, RemoveNotification } from "../services/authService";
import { type Notification } from "./ModelTypes";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { Arrow, ErrorMessage, Loading } from "./Common";

interface NotificationProps {
    notifiaction: Notification;
    onRemove: (id: string) => void;
};

const Notifiation: React.FC<NotificationProps> = ({ notifiaction, onRemove }) => {
    const { t } = useTranslation();

    let icon: React.ReactNode;
    const color = notifiaction.isRead ? "bg-gray-500 rounded-full text-white" : "bg-blue-800 rounded-full text-white";
    const divBg = notifiaction.isRead ? "bg-white" : "bg-gray-100";

    switch (notifiaction.type) {
        case "card":
            icon = <MdCreditCard className={color} />;
            break;
        case "failedTransaction":
            icon = <TbXboxXFilled className={color} />;
            break;
        case "token":
            icon = <SiJsonwebtokens className={color} />;
            break;
        case "credit":
            icon = <FaHandHoldingDollar className={`transform scale-x-[-1] ${color}`} />;
            break;
        default:
            icon = <TbBaselineDensityMedium className={color} />;
            break;
    }

    useEffect(() => {
        const styleId = 'notification-button-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .read-group:hover .read-group-hover\\:visible {
                    visibility: visible !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    useEffect(() => {
        const styleId = 'button-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .button-group:hover .button-group-hover\\:visible {
                    visibility: visible !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    return (
        <div className={`relative flex space-x-2 m-2 border-2 border-gray-300 rounded-md p-1 ${divBg} hover:bg-gray-300 button-group`}>
            <div className={`text-2xl pt-2`}>{icon}</div>
            <div className="text-gray-700">
                <h3 className="text-black text-base">{notifiaction.title}</h3>
                <p className="text-sm">{notifiaction.message}</p>
                <p className="text-xs">{notifiaction.date}</p>
            </div>
            <div className="absolute right-2 top-2 flex space-x-2 text-sm text-gray-700 font-bold invisible button-group-hover:visible">
                <button className="read-group relative">
                    <TbBaselineDensityMedium className="skew-x-36 transform scale-x-[-1] hover:text-blue-800 hover:cursor-pointer" />
                    <div className="invisible read-group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 bg-white text-black text-xs rounded p-2 border-2 border-gray-300 shadow-lg z-10 min-w-max">
                        <Arrow position="bottom" />
                        <p>{notifiaction.isRead ? t("ПРОЧЕТЕНО") : t("НЕПРОЧЕТЕНО")}</p>
                    </div>
                </button>
                <button className="read-group relative" onClick={() => onRemove(notifiaction.id)}>
                    <p className="hover:text-blue-800 hover:cursor-pointer">X</p>
                    <div className="invisible read-group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 bg-white text-black text-xs rounded p-2 border-2 border-gray-300 shadow-lg z-10 min-w-max">
                        <Arrow position="bottom" />
                        <p>{t("ПРЕМАХНИ")}</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

export const NotificationsMenu: React.FC = () => {
    const { t } = useTranslation();
    const [userID, setUserID] = useState<string>("");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [countUnread, setCountUnread] = useState<number>(0);

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const data = await getUserData();
                setUserID(data[0]);//data[0] is the userID
            } catch (error) {
                setError(t("errors.failedToFetchUserData"));
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserRole();
    }, []);

    useEffect(() => {
        if (!userID) return;

        const fetchNotifications = async () => {
            setIsLoading(true);
            try {
                const data = await getNotifications(userID);
                setNotifications(data.notifications);
                setCountUnread(data.countUnread);
            } catch (error) {
                setError(t("errors.failedToFetchNotificationsLocal"));
                console.error("Error fetching notifications:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifications();
    }, [userID, i18n.language]);

    const handleremoveNotification = async (id: string) => {
        try {
            await RemoveNotification(id);
            setNotifications(notifications.filter(notif => notif.id !== id));
        } catch (error) {
            console.error("Error removing notification:", error);
        }
    };

    error && <ErrorMessage message={error} />

    isLoading && <Loading />;

    return (
        <div className="w-120 p-2 text-left">
            <h2 className="pl-2 font-bold">{t("Имате")} <span className="text-blue-800"> {countUnread} {t("нови")} </span> {t("известия")}</h2>
            {notifications.map(notif => {
                return <Notifiation key={notif.id} notifiaction={notif} onRemove={handleremoveNotification} />
            })}
            <p className="pl-2 text-blue-800 hover:cursor-pointer hover:underline">{t("Вижте всички известия")}{" >"}</p>
        </div>
    );
};