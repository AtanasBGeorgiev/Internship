import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

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
    };

    //switches the language if globally is switched
    useEffect(() => {
        //switcher
        const onLangChanged = (lng: string) => setLang(lng);
        //event listener for changes
        i18n.on('languageChanged', onLangChanged);

        return () => {
            //clears the listener
            i18n.off('languageChanged', onLangChanged);
        };
    }, [i18n]);

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={() => changeLanguage(lang === 'bg' ? 'en' : 'bg')}
                className={`${fontSize} text-black hover:text-blue-800`}
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
            <a href={href}  className={`text-sm md:text-basic text-blue-800 hover:underline ${aDisplayProps}`}>{aText} {'>'}</a>
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
export const ShowMessage: React.FC<MessageProps> = ({ message, messageType }) => {
    if (message) {
        return (
            <p className={`text-sm md:text-basic text-center p-4 ${messageType === "success" ? "text-green-600 md:font-bold" : "text-red-500"}`}>
                {message}
            </p>
        );
    }
};

interface ArrowProps {
    bgColor?: string;
    borderColor?: string;
    position: string;
};
export const Arrow: React.FC<ArrowProps> = ({ bgColor = "bg-white", borderColor = "border-gray-300", position }) => {
    if (position === "left") {
        return (
            <div className={`absolute -left-2 top-3 w-4 h-4 ${bgColor} border-l-2 border-b-2 ${borderColor} rotate-45 z-[-1]`}></div>
        );
    }
    if (position === "top") {
        return (
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 ${bgColor} border-l-2 border-t-2 
            ${borderColor} rotate-45 z-[-1]`}></div>
        );
    }
    if (position === "bottom") {
        return (
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 ${bgColor} border-r-2 border-b-2 
            ${borderColor} rotate-45 z-[-1]`}></div>
        );
    }
    if (position === "redBottom") {
        return (
            <div className={`absolute bottom-0 right-1/20 -translate-x-1/2 translate-y-1/2 w-3 h-3 ${bgColor} border-r-2 border-b-2 
            border-red-500 rotate-45 z-10`}></div>
        );
    }
};
