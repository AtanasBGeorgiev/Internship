import { useTranslation } from "react-i18next";
import Decimal from "decimal.js";

import { MdSettingsSuggest } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa6";
import { IoListCircleSharp } from "react-icons/io5";

import { Arrow } from "./Common";
import { formatNumberWithSpaces } from "./Calculations";

interface SectionHeadProps {
    title: string;
};
export const SectionHead: React.FC<SectionHeadProps> = ({ title }) => {
    return (
        <div className="mt-5 border-x-2 border-t-2 border-gray-300 w-full">
            <div id="section" className="pl-3 flex items-center justify-between">

                <h2 className="px-4 py-2 font-bold text-lg">{title}</h2>

                <div className="flex items-center justify-center">
                    <p className="border-x-2 border-gray-300 p-2 hover:underline hover:text-blue-800">Вижте всички {`>`}</p>

                    <div className="hover:text-blue-800 relative p-2 group">
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border-2 border-gray-300 rounded 
                        p-2 z-10 text-center text-sm w-30 font-bold text-black hidden group-hover:block`}>
                            <Arrow position="bottom" />
                            <p>НАСТРОЙКИ</p>
                        </div>
                        <MdSettingsSuggest />
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
    type?: "th" | "td" | "cardImg" | "security" | "accountInfo" | "actions" | "payment" | "transferParticipant" | "transferAmount";
    display?: string;
    text?: string;
    cardNum?: string;
    isActive?: "true" | "false";
    alignment?: "left" | "center" | "right";
    accountType?: "personal" | "unrestricted";
    isDecimal?: boolean;
    actions?: React.ReactNode;
    checkbox?: React.ReactNode;
    paymentType?: "internal" | "credit" | "own";
    names?: string;
    bankAccount?: string;
    amount?: string;
    currency?: string;
}
export const TableData: React.FC<TableDataProps> = ({ type = "td", display = "", text = "", cardNum, isActive = "false", alignment = "center",
    accountType, isDecimal = false, actions, checkbox, paymentType, names, bankAccount, amount, currency }) => {

    const { t } = useTranslation();

    if (isDecimal) {
        const num = new Decimal(amount as string).toFixed(2);
        amount = formatNumberWithSpaces(num);
    }

    if (type === "th") {
        return (
            <>
                <th className={`p-2 text-${alignment} ${display}`}><span className='pr-5'>{checkbox}</span>{text}</th>
            </>

        );
    }
    if (type === "td") {
        return (
            <td className={`border border-gray-300 px-2 text-${alignment} ${display}`}>{text.length > 0 ? text : amount}</td>
        );
    }
    if (type === "cardImg") {
        return (
            <td className="flex items-center justify-start space-x-4 p-2">
                {checkbox}
                <img src={`${text === "MasterCard Standard" ? "icon-mastercard.png" : "icon-visa.png"}`}
                    className={`${text === "MasterCard Standard" ? "w-20 h-10" : "w-20 h-15"}`}></img>
                <div>
                    <p className="font-bold">{text}</p>
                    <p>{`**** ${String(cardNum).slice(-4)}`}</p>
                </div>
            </td>
        );
    }
    if (type === "security") {
        return (
            <td className={`px-2 ${display}`}>
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
                <IoListCircleSharp className='text-blue-800 text-3xl' />
                <div>
                    <p className="font-bold">{accountType === "personal" ? t("Разпл. сметка физ. лица") : t("Свободна разпл. сметка")}</p>
                    <p className='text-blue-800 hover:cursor-pointer hover:underline'>{cardNum} {'>'}</p>
                </div>
            </td>
        );
    }
    if (type === "actions") {
        return (
            <td className="text-gray-500">
                <div className="flex items-center justify-center">
                    {actions}
                </div>
            </td>
        );
    }
    if (type === "payment") {
        return (
            <td className="flex items-center justify-start space-x-4 p-2">
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
            <td className={`text-left border border-gray-300 px-2 text-${alignment} ${display}`}>
                <p>{names}</p>
                <p>{bankAccount}</p>
            </td>
        );
    }
    if (type === "transferAmount") {
        return (
            <td className={`border border-gray-300 px-2 text-${alignment} ${display}`}>
                <div className='flex justify-end items-center'>
                    <p className='pr-2'>{amount}</p>
                    <p>{currency}</p>
                </div>
            </td>
        );
    }
};

interface TableButtonProps {
    icon?: React.ReactNode;
    text: string;
    display: string;
}
export const TableButton: React.FC<TableButtonProps> = ({ icon, text, display }) => {
    return (
        <button className={`flex flex-row items-center ${display} py-2 px-3 mr-3 rounded hover:cursor-pointer`}>
            <span className="pr-2 text-xl">{icon}</span>
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
        <table className='w-full border-2 border-gray-300 border-collapse'>
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
    return (
        <div className='bg-gray-100 text-center px-10 py-5 w-1/3'>
            <p>{text}</p>
            <h2 className='text-blue-800 text-2xl font-bold'>{totalAmount}</h2>
        </div>
    );
};