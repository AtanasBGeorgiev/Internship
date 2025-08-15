import { useEffect, useState } from "react";
import { Table, TableData, ActionField, SectionHead, TableButton, ActionTooltip, TotalSum } from "./Tables";
import { useProtectedFetch } from "./ProtectedRequests";
import { IoCloseSharp, IoListCircleSharp } from "react-icons/io5";
import { hideMessage, ShowMessage } from "./Common";
import { useTranslation } from "react-i18next";
import { getUserData, postPreferrence } from "../services/authService";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { BsSafeFill } from "react-icons/bs";
import type { Account, Deposit } from "./ModelTypes";

interface ModuleProps {
    heading: string;
    tableHeads: string[];
    condition?: string;
    newCondition?: string;
    countLimit: number;
    typeCollection: "accounts" | "cards" | "payments" | "liabilities" | "transactions" | "credits" | "deposits" | "currencies";
    onClose: () => void;
};
export const SetModule = <T extends { id: string }>({ heading, tableHeads, condition, newCondition, countLimit, typeCollection, onClose }: ModuleProps) => {
    const { t } = useTranslation();

    const [id, setId] = useState<string>("");
    const [collection, setCollection] = useState<T[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    interface UserDashboardData {
        items?: T[];
    }

    const { data: userData, error: userError } = useProtectedFetch<UserDashboardData>
        (`/api/dashboard/Module/${typeCollection}`);

    useEffect(() => {
        if (userError) {
            setMessage(t("login.genericError"));
            setMessageType("error");
            hideMessage(setMessage, setMessageType);
        }

        if (userData) {
            if (userData.items) setCollection(userData.items);
        }
    }, [userData, userError, t]);

    useEffect(() => {
        const fetchID = async () => {
            const data = await getUserData();
            setId(data[0]);
        }
        fetchID();
    }, []);

    const handleCheckboxChange = (itemId: string) => {
        //prev - array of selected accounts
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                //remove the accountId if already selected
                return prev.filter(id => id !== itemId);
            }
            else {
                if (prev.length < countLimit) {
                    //adds the accountId to the array
                    return [...prev, itemId];
                }
                //if length is 3,does not add the accountId
                return prev;
            }
        })
    };

    const handleSave = () => {
        if (selectedItems.length === 0) {
            setMessage(t("Моля, изберете поне едно!"));
            setMessageType("error");
            hideMessage(setMessage, setMessageType);
            return;
        }

        //send the selected items to the server
        postPreferrence(id, selectedItems, typeCollection);

        setMessage("Успешно запазени!");
        setMessageType("success");
        hideMessage(setMessage, setMessageType);

        // Close modal after successful save
        setTimeout(() => onClose(), 1500);
    };

    return (
        //fixed - makes the div fixed to the screen not to the parent
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
            <div className="bg-white text-sm w-100 border-2 border-gray-300">
                <div className="p-3 border-b-2 border-gray-300 flex justify-between items-center">
                    <h2 className="text-base">Настройване на модул - {heading}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                    >
                        <IoCloseSharp className="text-2xl" />
                    </button>
                </div>
                <p className="p-3 border-b-2 border-gray-300">Изберете
                    <span className="text-blue-800">{condition}</span>, които да се показват:
                </p>

                <ShowMessage message={message} messageType={messageType} />
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                    <Table
                        tableHead={tableHeads?.map((head) => {
                            return <TableData text={head} alignment="left" display="py-2" />
                        })}
                        items={collection}
                        tableData={(item) => <>
                            {/*First column */}
                            {(typeCollection === "accounts" || typeCollection === "credits" || typeCollection === "deposits") &&
                                <TableData text={typeCollection === "accounts" ? `${(item as any).type}` : `${(item as any).name}`}
                                    type="accountInfo" alignment="left"
                                    cardNum={typeCollection === "accounts" ? `${(item as any).accountNumber}`
                                        : typeCollection === "deposits" ? `${(item as any).number}`
                                            : ``}
                                    amount={typeCollection === "credits" ? `${(item as any).amount}`
                                        : ``}
                                    display="text-blue-800 hover:cursor-pointer hover:underline"
                                    icon={typeCollection === "accounts" ? <IoListCircleSharp className='text-blue-800 text-3xl' />
                                        : typeCollection === "credits" ? <FaHandHoldingDollar className="text-blue-800 text-3xl transform scale-x-[-1]" />
                                            : <BsSafeFill className="text-blue-800 text-3xl" />}
                                    checkbox={
                                        <input
                                            type="checkbox" checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                            disabled={!selectedItems.includes(item.id) && selectedItems.length === countLimit}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    } />
                            }

                            {typeCollection === "payments" &&
                                <TableData type="payment" paymentType={`${(item as any).paymentType}`} alignment="left"
                                    checkbox={
                                        <input
                                            type="checkbox" checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                            disabled={!selectedItems.includes(item.id) && selectedItems.length === countLimit}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    } />
                            }

                            {typeCollection === "cards" &&
                                <TableData text={`${(item as any).type}`} type="cardImg" cardNum={`${(item as any).cardNumber}`} alignment="left"
                                    checkbox={
                                        <input
                                            type="checkbox" checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                            disabled={!selectedItems.includes(item.id) && selectedItems.length === countLimit}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    } />}

                            {typeCollection === "liabilities" &&
                                <TableData text={`${(item as any).name}`} type="bill" iconType={`${(item as any).feeType}`} alignment="left"
                                    checkbox={
                                        <input
                                            type="checkbox" checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                            disabled={!selectedItems.includes(item.id) && selectedItems.length === countLimit}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    } />}

                            {typeCollection === "currencies" &&
                                <TableData text={`${(item as any).name}`} type="currency" nationalFlag={`${(item as any).flagURL}`} alignment="left" display="py-1"
                                    checkbox={
                                        <input
                                            type="checkbox" checked={selectedItems.includes(item.id)}
                                            onChange={() => handleCheckboxChange(item.id)}
                                            disabled={!selectedItems.includes(item.id) && selectedItems.length === countLimit}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                    } />}

                            {/*Second colum */}
                            {typeCollection !== "liabilities" &&
                                <TableData text={`${(item as any).currency}`} />}
                        </>
                        } />
                </div>

                <div className="p-3 flex justify-end items-center border-t-2 border-gray-300">
                    <TableButton text={t("ЗАПАЗЕТЕ")} display="text-white bg-blue-800 hover:bg-blue-700" onClick={handleSave} />
                </div>
            </div>
        </div>
    );
};

export const SetTransactionModule: React.FC<ModuleProps> = ({ heading, tableHeads, newCondition, countLimit, typeCollection, onClose }) => {
    const { t } = useTranslation();

    const [id, setId] = useState<string>("");
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [selectedDeposits, setSelectedDeposits] = useState<string[]>([]);
    const [totalSelected, setTotalSelected] = useState<number>(0);

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    interface UserDashboardData {
        accounts?: Account[];
        deposits?: Deposit[];
    }

    const { data: userData, error: userError } = useProtectedFetch<UserDashboardData>
        (`/api/dashboard/Module/transactions`);

    useEffect(() => {
        if (userError) {
            setMessage(t("Неуспешно зареждане на данните"));
            setMessageType("error");
            hideMessage(setMessage, setMessageType);
        }

        if (userData) {
            if (userData.accounts) setAccounts(userData.accounts);
            if (userData.deposits) setDeposits(userData.deposits);
        }
    }, [userData, userError, t]);

    useEffect(() => {
        const fetchID = async () => {
            const data = await getUserData();
            setId(data[0]);
        }
        fetchID();
    }, []);

    // Update total selected when either selection changes
    useEffect(() => {
        setTotalSelected(selectedAccounts.length + selectedDeposits.length);
    }, [selectedAccounts, selectedDeposits]);

    const handleCheckboxChange = (itemId: string, type: "account" | "deposit") => {
        if (type === "account") {
            setSelectedAccounts(prev => {
                if (prev.includes(itemId)) {
                    return prev.filter(id => id !== itemId);
                } else {
                    if (totalSelected < countLimit) {
                        return [...prev, itemId];
                    }
                    return prev;
                }
            });
        }
        else {
            setSelectedDeposits(prev => {
                if (prev.includes(itemId)) {
                    return prev.filter(id => id !== itemId);
                }
                else {
                    if (totalSelected < countLimit) {
                        return [...prev, itemId];
                    }
                    return prev;
                }
            })
        }
    };

    const handleSave = async () => {
        if (totalSelected === 0) {
            setMessage(`Моля, изберете поне един елемент!`);
            setMessageType("error");
            hideMessage(setMessage, setMessageType);
            return;
        }

        try {
            const itemsID = [...selectedAccounts, ...selectedDeposits];
            // Send both selected accounts and deposits into an array
            await postPreferrence(id, itemsID, typeCollection);

            setMessage("Успешно запазени!");
            setMessageType("success");
            hideMessage(setMessage, setMessageType);

            setTimeout(() => onClose(), 1500);
        } catch (error) {
            setMessage("Грешка при запазване!");
            setMessageType("error");
            hideMessage(setMessage, setMessageType);
        }
    };

    // Spreads all existing properties (id, name, number, currency, etc.) and adds a new property called itemType
    const combinedItems = [
        ...accounts.map(account => ({ ...account, itemType: 'account' as const })),
        ...deposits.map(deposit => ({ ...deposit, itemType: 'deposit' as const }))
    ];

    return (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
            <div className="bg-white text-sm w-100 border-2 border-gray-300">
                <div className="p-3 border-b-2 border-gray-300 flex justify-between items-center">
                    <h2 className="text-base">Настройване на модул - {heading}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                    >
                        <IoCloseSharp className="text-2xl" />
                    </button>
                </div>
                {newCondition && <p className="p-3 border-b-2 border-gray-300">{newCondition}</p>}

                <ShowMessage message={message} messageType={messageType} />
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                    <Table
                        tableHead={tableHeads?.map((head) => {
                            return <TableData key={head} text={head} alignment="left" display="py-2" />
                        })}
                        items={combinedItems}
                        tableData={(item) => <>
                            {/* First column - Type and Info */}
                            <TableData
                                text={item.itemType === 'account' ? (item as Account).type : (item as Deposit).name}
                                type="accountInfo"
                                cardNum={item.itemType === 'account' ? (item as Account).accountNumber : (item as Deposit).number}
                                alignment="left"
                                display="text-blue-800 hover:cursor-pointer hover:underline"
                                icon={item.itemType === 'account' ? <IoListCircleSharp className='text-blue-800 text-3xl' />
                                    : <BsSafeFill className="text-blue-800 text-3xl" />}
                                checkbox={
                                    <input
                                        type="checkbox"
                                        checked={
                                            item.itemType === 'account'
                                                ? selectedAccounts.includes(item.id)
                                                : selectedDeposits.includes(item.id)
                                        }
                                        onChange={() => handleCheckboxChange(item.id, item.itemType)}
                                        disabled={
                                            !(item.itemType === 'account'
                                                ? selectedAccounts.includes(item.id)
                                                : selectedDeposits.includes(item.id)
                                            ) && totalSelected === countLimit
                                        }
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                }
                            />

                            {/* Second column - Currency */}
                            <TableData text={item.currency} />
                        </>
                        } />
                </div>

                <div className="p-3 flex justify-end items-center border-t-2 border-gray-300">
                    <TableButton text={t("ЗАПАЗЕТЕ")} display="text-white bg-blue-800 hover:bg-blue-700" onClick={handleSave} />
                </div>
            </div>
        </div>
    );
};