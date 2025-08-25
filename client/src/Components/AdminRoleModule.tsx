import { useEffect, useState } from "react";

import { IoCloseSharp } from "react-icons/io5";

import { Table, TableData, TableButton } from "./Tables";
import { useProtectedFetch } from "./ProtectedRequests";
import { ShowMessage, SetMessage } from "./Common";
import { useTranslation } from "react-i18next";
import type { User } from "./ModelTypes";
import { updateRole } from "../services/authService";
import { SearchBar } from "./ProfileMenuBusiness";

interface ModuleProps {
    onClose: () => void;
};
export const AdminRoleModule: React.FC<ModuleProps> = ({ onClose }) => {
    const { t } = useTranslation();

    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const { data: usersData, error: userError } = useProtectedFetch<User[]>
        (`/api/admin/getUsers`);
    console.log("usersData", usersData);

    useEffect(() => {
        if (userError) {
            SetMessage({ message: t(userError), messageType: "error", setMessage, setMessageType });
        }

        if (usersData) {
            setUsers(usersData);
        }
    }, [usersData, userError, t]);

    const filteredUsers = users.filter(user =>
        user.egn.includes(searchTerm)
    );

    const handleCheckboxChange = (userId: string) => {
        //prev - array of selected accounts
        setSelectedUsers(prev => {
            if (prev.includes(userId)) {
                //remove the accountId if already selected
                return prev.filter(id => id !== userId);
            }
            else {
                //adds the userId to the array
                return [...prev, userId];
            }
        })
    };

    const handleSave = () => {
        if (selectedUsers.length === 0) {
            SetMessage({ message: t("Моля, изберете поне едно!"), messageType: "error", setMessage, setMessageType });
            return;
        }
        console.log("selectedUsers", selectedUsers);
        updateRole(selectedUsers);

        SetMessage({ message: t("Успешно запазени промени!"), messageType: "success", setMessage, setMessageType });

        // Close modal after successful save
        setTimeout(() => onClose(), 1500);
    };

    return (
        //fixed - makes the div fixed to the screen not to the parent
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
            <div className="bg-white text-sm w-110 border-2 border-gray-300">
                <div className="p-3 border-b-2 border-gray-300 flex justify-between items-center">
                    <h2 className="text-base">{t("Настройване на роли")}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                    >
                        <IoCloseSharp className="text-2xl" />
                    </button>
                </div>
                <p className="p-3 border-b-2 border-gray-300">
                    {t("Изберете потребители, на които да дадете администраторски права")}
                </p>

                <SearchBar title={t("Изберете потребител")} placeholder={t("Търсете по ЕГН...")} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <ShowMessage message={message} messageType={messageType} />
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                    <Table
                        tableHead={
                            <>
                                <TableData type="th" text={t("Име на Кирилица")} />
                                <TableData type="th" text={t("Име на Латиница")} />
                                <TableData type="th" text={t("ЕГН")} />
                            </>
                        }
                        items={filteredUsers}
                        tableData={(user) => <>
                            <TableData text={`${user.nameCyrillic}`} alignment="left" display="p-2"
                                checkbox={
                                    <input
                                        type="checkbox" checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleCheckboxChange(user.id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                } />
                            <TableData text={`${user.nameLatin}`} />
                            <TableData text={`${user.egn}`} />
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