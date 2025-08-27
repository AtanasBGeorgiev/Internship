import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { updateLanguagePreference } from "../api/axiosInstance";
import { saveLanguagePreference } from "../i18n";

interface LangSwitcherProps {
    fontSize?: string;
    english: string;
    bulgarian: string;
}

export const LangSwitcher: React.FC<LangSwitcherProps> = ({ fontSize = "text-lg", english, bulgarian }) => {
    const { i18n } = useTranslation();
    const [lang, setLang] = useState(i18n.language || 'bg');

    // switches the language
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        // Update API headers with new language preference
        updateLanguagePreference(lng);
        // Save language preference to localStorage
        saveLanguagePreference(lng);
    };

    //switches the language if globally is switched
    useEffect(() => {
        //switcher
        const onLangChanged = (lng: string) => {
            setLang(lng);
            // Update API headers when language changes globally
            updateLanguagePreference(lng);
            // Save language preference to localStorage
            saveLanguagePreference(lng);
        };
        //event listener for changes
        i18n.on('languageChanged', onLangChanged);

        return () => {
            //clears the listener
            i18n.off('languageChanged', onLangChanged);
        };
    }, [i18n]);

    return (
        <div className="relative items-center">
            <button
                onClick={() => changeLanguage(lang === 'bg' ? 'en' : 'bg')}
                className={`${fontSize} text-sm lg:text-base text-black hover:text-blue-800`}
            >
                {lang === 'bg' ? `${english}` : `${bulgarian}`}
            </button>
        </div>
    );
};

interface AnnouncmentProps {
    hText: string;
    pText: string;
    aText: string;
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
            <p className="text-xs md:text-base pt-2 pb-2">{pText}</p>
            <a href={href} className={`text-sm md:text-base text-blue-800 hover:underline ${aDisplayProps}`}>{aText} {'>'}</a>
        </div>
    );
};

export function hideMessage(setMessage: (message: string | null) => void, setMessageType: (type: 'success' | 'error' | null) => void) {
    setTimeout(() => {
        setMessage(null);
        setMessageType(null);
    }, 7000);
};

interface MessageProps {
    message: string | null;
    messageType: "success" | "error" | null;
}
interface SetMessageProps {
    message: string | null;
    messageType: "success" | "error" | null;
    setMessage: (message: string | null) => void;
    setMessageType: (messageType: "success" | "error" | null) => void;
};
export function SetMessage({ message, messageType, setMessage, setMessageType }: SetMessageProps) {
    setMessage(message);
    setMessageType(messageType);
    hideMessage(setMessage, setMessageType);
};
export const ShowMessage: React.FC<MessageProps> = ({ message, messageType }) => {
    if (message) {
        return (
            <div className={`p-3 m-3 rounded ${messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                {message}
            </div>
        );
    }
};
interface ErrorMessageProps {
    message: string;
};
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (message) {
        return (
            <div className="p-4 text-red-600 bg-red-100 rounded">
                {message}
            </div>
        );
    }
};

interface ArrowProps {
    bgColor?: string;
    borderColor?: string;
    position: string;
    display?: string;
};
export const Arrow: React.FC<ArrowProps> = ({ bgColor = "bg-white", borderColor = "border-gray-300", position, display }) => {
    if (position === "left") {
        return (
            <div className={`absolute -left-2 ${display ? display : "top-3"} w-4 h-4 ${bgColor} border-l-2 border-b-2 ${borderColor} rotate-45 z-[10]`}></div>
        );
    }
    if (position === "right") {
        return (
            <div className={`absolute -right-2 ${display ? display : "top-3"} w-4 h-4 ${bgColor} border-r-2 border-t-2 ${borderColor} rotate-45 z-[10]`}></div>
        );
    }
    if (position === "top") {
        return (
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 ${bgColor} border-l-2 border-t-2 
            ${borderColor} rotate-45 z-[10]`}></div>
        );
    }
    if (position === "bottom") {
        return (
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 ${bgColor} border-r-2 border-b-2 
            ${borderColor} rotate-45 z-[10]`}></div>
        );
    }
    if (position === "redBottom") {
        return (
            <div className={`absolute bottom-0 right-1/20 -translate-x-1/2 translate-y-1/2 w-3 h-3 ${bgColor} border-r-2 border-b-2 
            border-red-500 rotate-45 z-10`}></div>
        );
    }
};

export const Loading: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="w-120 p-2 text-left">
            <p className="text-gray-500 pl-2">{t("Зарежданe...")}</p>
        </div>
    );
};

