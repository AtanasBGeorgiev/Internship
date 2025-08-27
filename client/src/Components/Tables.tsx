import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import Decimal from "decimal.js";

import { MdSettingsSuggest } from "react-icons/md";
import { FaCreditCard, FaPlug, FaTemperatureFull } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CiDroplet } from "react-icons/ci";
import { IoMdPhonePortrait } from "react-icons/io";

import { Arrow } from "./Common";
import { formatNumberWithSpaces } from "./Calculations";
import { getRemainingDays, getStrengthColorDate } from "./RemainingTime";
import { usePosition } from "../context/PositionContext";

interface SectionHeadProps {
    title: string;
    onClick?: () => void;
    getPosition?: boolean;
};
export const SectionHead: React.FC<SectionHeadProps> = ({ title, onClick, getPosition = false }) => {
    const { t } = useTranslation();

    const { setPosition } = usePosition();

    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (iconRef.current && getPosition) {
            const rect = iconRef.current.getBoundingClientRect();
            setPosition("iconSettings", {
                top: rect.top,
                left: rect.left,
                right: rect.right,
                bottom: rect.bottom
            });
        }
    }, [iconRef.current]);

    return (
        <div className="mt-5 border-x-2 border-t-2 border-gray-300 w-full">
            <div id="section" className="pl-3 flex items-center justify-between">
                <h2 className="px-4 py-2 font-bold text-base xl:text-lg">{title}</h2>

                <div className="flex items-center justify-center">
                    <p className="text-sm xl:text-base border-x-2 border-gray-300 p-2 hover:underline hover:text-blue-800">{t("Вижте всички")} {`>`}</p>

                    <div ref={iconRef} className="hover:text-blue-800 relative p-2 group" onClick={onClick}>
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border-2 border-gray-300 rounded 
                        p-2 z-10 text-center text-sm w-30 font-bold text-black hidden group-hover:block`}>
                            <Arrow position="bottom" />
                            <p>{t("НАСТРОЙКИ")}</p>
                        </div>
                        <div>
                            <MdSettingsSuggest className="text-base xl:text-xl" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

type withId = {
    id: string;
};
type TableProps<T extends withId> = {
    tableHead: React.ReactNode;
    items: T[];
    tableData: (item: T) => React.ReactNode;
}

interface TableDataProps {
    type?: "th" | "td" | "cardImg" | "security" | "accountInfo" | "actions" | "payment" | "transferParticipant" |
    "transferAmount" | "bill" | "transaction" | "currency";
    display?: string;
    text?: string;
    cardNum?: string;
    isActive?: "true" | "false";
    alignment?: "left" | "center" | "right";
    actions?: React.ReactNode;
    checkbox?: React.ReactNode;
    paymentType?: string;
    names?: string;
    bankAccount?: string;
    amount?: string;
    currency?: string;
    iconType?: string;
    isBoolean?: "true" | "false" | "null";
    typeTransaction?: "income" | "expense";
    icon?: React.ReactNode;
    document?: string;
    reference?: string;
    showRate?: boolean;
    isDate?: boolean;
    baseDays?: number;
    isDeposit?: boolean;
    nationalFlag?: string;
}
export const TableData: React.FC<TableDataProps> = ({ type = "td", display = "", text = "", cardNum,
    isActive = "false", alignment = "center", actions, checkbox, paymentType, names,
    bankAccount, amount, currency, iconType, isBoolean, typeTransaction, icon, document, reference,
    showRate = false, isDate, baseDays = 31, isDeposit = false, nationalFlag }) => {

    const { t } = useTranslation();

    let displaySign = "";

    if (amount && amount !== "") {
        const num = new Decimal(amount ? amount : 0).toFixed(2);
        amount = formatNumberWithSpaces(num);
    }

    if (isBoolean) {
        switch (isBoolean) {
            case "true": text = t("Да"); break;
            case "false": text = t("Не"); break;
            case "null": text = "N/a"; break;
        }
    }

    if (typeTransaction) {
        switch (typeTransaction) {
            case "income": text = `\u2190`; displaySign = "text-green-600 text-xl xl:text-2xl"; break;
            case "expense": text = `\u2192`; displaySign = "text-red-500 text-xl xl:text-2xl"; break;
        }
    }

    if (type === "th") {
        return (
            <>
                <td className={`p-2 text-sm xl:text-lg text-${alignment} ${display}`}>{checkbox &&<span className='pr-5'>{checkbox}</span>}{text}</td>
            </>

        );
    }
    if (type === "td") {
        let remainingDays = 0;
        let multiplier = 1;
        if (isDate) {
            remainingDays = getRemainingDays(new Date(text));
            multiplier = Number((100 / baseDays).toFixed(2));
        }

        return (
            <td className={`text-sm xl:text-base border border-gray-300 px-2 text-${alignment} ${display} ${displaySign}`}>
                {text.length > 0 ? text : icon ? icon : amount} {showRate ? `%` : ""}
                {isDate && (
                    <div className="w-9/10">
                        <div className="relative group hover:cursor-pointer h-3 rounded bg-gray-200 mt-1">
                            <div
                                style={{
                                    width: `${Math.min(100, Math.max(0, Math.round((baseDays - remainingDays) * multiplier)))}%`
                                }}
                                className={`h-3 transition-all duration-300 ${getStrengthColorDate(new Date(text), isDeposit === true ? "deposit" : "credit")}`}>

                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border-2 border-gray-300 rounded 
                        p-2 z-10 text-center text-xs xl:text-sm w-30 font-bold text-black hidden group-hover:block">
                                    <Arrow position="bottom" />
                                    <p>Остават {remainingDays > 0 ? remainingDays : 0} дни</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </td>

        );
    };
    if (type === "cardImg") {
        return (
            <td className="text-sm xl:text-base flex items-center justify-start space-x-4 p-2">
                {checkbox}
                <img src={`${text === "MasterCard Standard" ? "icon-mastercard.png" : "icon-visa.png"}`}
                    className={`${text === "MasterCard Standard" ? "w-10 h-5 xl:w-20 xl:h-10" : "w-12 h-9 xl:w-20 xl:h-15"}`}></img>
                <div>
                    <p className="font-bold">{text}</p>
                    <p>{`**** ${String(cardNum).slice(-4)}`}</p>
                </div>
            </td>
        );
    }
    if (type === "security") {
        return (
            <td className={`text-sm xl:text-base px-2 ${display}`}>
                <div className={`flex items-center ${isActive === "false" ? "text-red-500" : "text-green-500"}`}>
                    <FaCreditCard className="mr-2" />
                    {isActive === "false" ? t("Неактивирана") : t("Активирана")}
                </div>
            </td>
        );
    }
    if (type === "accountInfo") {
        return (
            <td className="flex items-center justify-start space-x-4 p-2">
                {checkbox}
                {icon}
                <div>
                    <p className="font-bold text-sm xl:text-base">{t(text)}</p>
                    <p className={`text-sm xl:text-base ${display}`}>{cardNum ? cardNum + '>' : t("Размер: ") + amount}</p>
                </div>
            </td>
        );
    }
    if (type === "actions") {
        return (
            <td className="text-gray-500">
                <div className="text-sm xl:text-base flex items-center justify-center px-1">
                    {actions}
                </div>
            </td>
        );
    }
    if (type === "payment") {
        return (
            <td className="text-sm xl:text-base flex items-center justify-start space-x-4 p-2">
                {checkbox}
                <div>
                    <p>{t("Преводно нареждане")}</p>
                    <p className='text-blue-800'>{paymentType === "internal" ? t("Вътрешнобанков превод")
                        : paymentType === "credit" ? t("Кредитен превод")
                            : t("Превод собствени сметки")}</p>
                </div>
            </td>
        );
    }
    if (type === "transferParticipant") {
        return (
            <td className={`text-sm xl:text-base text-left border border-gray-300 px-2 text-${alignment} ${display}`}>
                <p>{t(names as string)}</p>
                <p>{bankAccount}</p>
            </td>
        );
    }
    if (type === "transferAmount") {
        let sign = "";
        if (typeTransaction) {
            sign = typeTransaction === "income" ? "+" : "-";
        }

        return (
            <td className={`text-sm xl:text-base border border-gray-300 px-2 text-${alignment} ${display}`}>
                <div className='flex justify-end items-center'>
                    <p className='pr-2'><span className={`${displaySign}`}>{sign}</span> {amount} {currency}</p>
                </div>
            </td>
        );
    }
    if (type === "bill") {
        return (
            <td className="flex items-center justify-start space-x-4 p-2 text-sm xl:text-base">
                {checkbox}
                <div className="text-white text-xl xl:text-2xl">
                    {(() => {
                        switch (iconType) {
                            case "electricity":
                                return <RoundedIcon icon={<FaPlug />} color="yellow" />;
                            case "water":
                                return <RoundedIcon icon={<CiDroplet />} color="lightBlue" />;
                            case "heating":
                                return <RoundedIcon icon={<FaTemperatureFull />} color="red" />;
                            case "phone":
                                return <RoundedIcon icon={<IoMdPhonePortrait />} color="darkBlue" />;
                            case "other":
                                return <RoundedIcon icon={<IoDocumentTextOutline />} color="amber" />;
                        }
                    })()}
                </div>
                <div>
                    <p>{t(text)}</p>
                </div>
            </td>
        );
    }
    if (type === "transaction") {
        return (
            <td className="flex items-center justify-start space-x-4 p-2 text-sm xl:text-base">
                <div>
                    <p className='text-blue-800'>{t(`${reference}`)}</p>
                    <p>{t(`${document}`)}</p>
                </div>
            </td>
        );
    }
    if (type === "currency") {
        return (
            <td className="flex items-center justify-start space-x-4 p-2">
                <div className="flex space-x-4 p-2">
                    {checkbox}
                    {nationalFlag &&
                        <div className="flex items-center space-x-2">
                            <img src={nationalFlag} alt="National Flag" className="w-6 h-4" />
                            <p>{text}</p>
                        </div>
                    }
                </div>
            </td>
        );
    }
};

interface RoundedIconProps {
    icon: React.ReactNode;
    color: string;
};
const RoundedIcon: React.FC<RoundedIconProps> = ({ icon, color }) => {
    const colorMap: Record<string, string> = {
        'yellow': 'bg-yellow-400',
        'lightBlue': 'bg-blue-400',
        'red': 'bg-red-600',
        'darkBlue': 'bg-blue-800',
        'amber': 'bg-amber-700'
    };

    return (
        <div className={`w-8 h-8 xl:w-12 xl:h-12 ${colorMap[color] || 'bg-gray-400'} rounded-full flex items-center justify-center`}>
            {icon}
        </div>
    );
};

interface TableButtonProps {
    icon?: React.ReactNode;
    text: string;
    display: string;
    onClick?: () => void;
}
export const TableButton: React.FC<TableButtonProps> = ({ icon, text, display, onClick }) => {
    return (
        <button onClick={onClick} className={`text-xs xl:text-base ${display} font-bold p-3 mx-2 block rounded hover:cursor-pointer`}>
            {icon && <span className="pr-2">{icon}</span>}
            {text}
        </button>
    );
};

interface ActionFieldProps {
    icon: React.ReactNode;
    tooltip: React.ReactNode;
};
export const ActionField: React.FC<ActionFieldProps> = ({ icon, tooltip }) => {
    return (
        <div className="bg-white hover:text-blue-800 hover:bg-gray-100 relative p-2 border-2 border-gray-300 group">
            {icon}
            {tooltip}
        </div>
    );
};

interface ActionTooltipProps {
    text: string;
};
export const ActionTooltip: React.FC<ActionTooltipProps> = ({ text }) => {
    return (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border-2 border-gray-300 rounded 
                        p-2 z-10 text-center text-sm w-30 font-bold text-black hidden group-hover:block`}>
            <Arrow position="bottom" />
            <p>{text}</p>
        </div>
    );
};

export const Table = <T extends withId>({ tableHead, tableData, items }: TableProps<T>) => {
    return (
        <table className='w-full border-2 border-gray-300 border-collapse overflow-x-scroll xl:text-base'>
            <thead>
                <tr className="bg-gray-100">
                    {tableHead}
                </tr>
            </thead>
            <tbody>
                {items?.map(item => {
                    return (
                        <tr key={item.id} className="border border-gray-200 even:bg-gray-100 odd:bg-white">
                            {tableData(item)}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

interface TotalSumProps {
    text: string;
    totalAmount: string;
}
export const TotalSum: React.FC<TotalSumProps> = ({ text, totalAmount }) => {
    const { t } = useTranslation();

    return (
        <div className='flex flex-col items-center justify-between px-5 py-2 bg-gray-100 text-center w-1/3 xl:px-10 xl:py-5'>
            <p className='text-sm xl:text-base'>{t(text)}</p>
            <h2 className='text-base text-blue-800 font-bold text-sm xl:text-2xl'>{totalAmount}</h2>
        </div>
    );
};