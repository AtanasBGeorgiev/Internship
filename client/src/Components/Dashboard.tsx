import { useState } from 'react';
import { Link } from 'react-router-dom';
import Decimal from 'decimal.js';
import { useTranslation } from "react-i18next";

import { Arrow } from "./Common.tsx";
import { IoTriangle, IoListCircleSharp } from 'react-icons/io5';
import { MdSettingsSuggest } from "react-icons/md";
import { FaCreditCard, } from "react-icons/fa6";

export function useSelectableList<T extends { id: string }>(items: T[]) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const allSelected = selectedItems.length === items.length;

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map(item => item.id));
        }
    };

    const toggleItem = (id: string) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    return {
        selectedItems,
        allSelected,
        toggleSelectAll,
        toggleItem,
        setSelectedItems,
    };
}

interface GroupCheckboxProps {
    type?: "parent" | "child";
    allSelected?: boolean;
    toggleSelectAll?: () => void;
    isSelected?: boolean;
    onToggle?: () => void;
}
export const GroupCheckbox: React.FC<GroupCheckboxProps> = ({ type = "child", allSelected, toggleSelectAll, isSelected, onToggle }) => {
    if (type === "parent") {
        return (
            <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
            />
        );
    }
    else {
        return (
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggle}
            />
        );
    }
};

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

interface SectionHeadProps {
    title: string;
    checkbox?: React.ReactNode;
};
export const SectionHead: React.FC<SectionHeadProps> = ({ title, checkbox }) => {
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

interface ActionFieldProps {
    icon: React.ReactNode;
    tooltip: React.ReactNode;
};
export const ActionField: React.FC<ActionFieldProps> = ({ icon, tooltip }) => {
    return (
        <div className="hover:text-blue-800 relative p-2 border-2 border-gray-300 group">
            {icon}
            {tooltip}
        </div>
    );
};

function formatWithSpaces(numStr: string) {
    const parts = numStr.split('.');
    //sets space per three symbols.Begins from right to left
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
}

interface TableDataProps {
    type?: "th" | "td" | "cardImg" | "security" | "accountInfo" | "actions";
    display?: string;
    text?: string;
    cardNum?: string;
    isActive?: "true" | "false";
    alignment?: "left" | "center" | "right";
    accountType?: "personal" | "unrestricted";
    isDecimal?: boolean;
    actions?: React.ReactNode;
    checkbox?: React.ReactNode;
}
export const TableData: React.FC<TableDataProps> = ({ type = "td", display = "", text, cardNum, isActive = "false", alignment = "center",
    accountType, isDecimal = false, actions, checkbox }) => {

    const { t } = useTranslation();

    if (isDecimal) {
        const num = new Decimal(text as string).toFixed(2);
        text = formatWithSpaces(num);
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
            <td className={`border border-gray-300 px-2 text-${alignment} ${display}`}>{text}</td>
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
            <div className={`flex items-center px-2 ${isActive === "false" ? "text-red-500" : "text-green-500"}`} >
                <FaCreditCard />
                <td className={`px-2 ${display}`}>{`${isActive === "false" ? t("Неактивирана") : t("Активирана")}`}</td>
            </div>
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
            <div className="flex items-center justify-center text-gray-500">
                {actions}
            </div>
        );
    }
};

type withId = {
    id: string;
};
type TableProps<T extends withId> = {
    tableHead: React.ReactNode;
    items: T[];
    tableData: (item: T) => React.ReactNode;
}
export const Table = <T extends withId>({ tableHead, tableData, items }: TableProps<T>) => {
    return (
        <table className='w-full border-2 border-gray-300 border-collapse'>
            <tr className="bg-gray-100">
                {tableHead}
            </tr>
            <tbody>
                {items.map(item => {
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

export type Account = {
    id: string;
    type: string;
    accountNumber: string;
    currency: "BGN" | "EUR" | "USD";
    avaiability: string;
    openingBalance: string;
    currentBalance: string;
    feesDue: string;
};

export type Payment = {
    id: string;
    paymentType: "internal" | "credit" | "own";
    remmiterName: string;
    remmiterBankAccount: string;
    beneficiaryName: string;
    beneficiaryBankAccount: string;
    amount: string;
    currency: "BGN" | "EUR" | "USD";
};

export type Card = {
    id: string;
    cardNumber: number;
    type: string;
    currency: "BGN" | "EUR" | "USD";
    balance: string;
    liabilities: string;
    minPayment: string;
    repaymentDate: string;
    ThreeDSecurity: boolean;
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