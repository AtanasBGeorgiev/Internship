import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { IoCloseSharp, IoDocumentText } from "react-icons/io5";
import { MdHelp } from "react-icons/md";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaArrowsAltV } from "react-icons/fa";

import { TableButton } from "./Tables";
import { type TableModel, type TableNames } from "./ModelTypes";
import { fetchTables, getUserData, postPreferredTable, updateTableOrder, getTableOrder, fetchPreferredTables } from "../services/authService";
import { Arrow, Loading, ShowMessage, SetMessage } from "./Common";
import { moduleIconMap } from "../utils/iconMap";
import { GroupCheckbox, TableCheckbox } from "./Checkboxes";

interface ModuleManagingProps {
    onClose: () => void;
};

export const ModuleManaging: React.FC<ModuleManagingProps> = ({ onClose }) => {
    const { t } = useTranslation();

    const [tables, setTables] = useState<TableModel[]>([]);
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [userId, setUserId] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [draggedModule, setDraggedModule] = useState<string | null>(null);
    const [tableNames, setTableNames] = useState<TableNames[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const response = await getUserData();
            setUserId(response[0]);
            setRole(response[1]);
            console.log("Role: ", response[1]);
            setLoading(false);
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchTableNames = async () => {
            setLoading(true);
            const userData = await getUserData();
            setRole(userData[1]);
            const data = await fetchPreferredTables(userData[0]);
            console.log("tableNames", data);
            setTableNames(data.tableNames.map(table => ({ name: table.name })));
            setLoading(false);
        }
        fetchTableNames();
    }, []);

    useEffect(() => {
        if (role && userId) {
            const fetchTablesData = async () => {
                setLoading(true);
                try {
                    const response = await fetchTables(role);
                    console.log("Tables: ", response);

                    //get user's preferred order if avaiable
                    let preferredOrder: { tableId: string; order: number }[] = [];
                    try {
                        preferredOrder = await getTableOrder(userId);
                    } catch (error) {
                        console.log("No preferred order found, using default");
                    }

                    // Merge tables with preferred order
                    const tablesWithPreferredOrder = response.map(table => {
                        const preferred = preferredOrder.find(p => p.tableId === table.id);
                        return {
                            ...table,
                            order: preferred ? preferred.order : table.order
                        };
                    });

                    //sort tables by order property - modules with order 0 go to the end
                    const sortedTables = tablesWithPreferredOrder.sort((a, b) => {
                        // If both have order 0, maintain their original order
                        if ((a.order || 0) === 0 && (b.order || 0) === 0) {
                            return 0;
                        }
                        // If only a has order 0, put it at the end
                        if ((a.order || 0) === 0) {
                            return 1;
                        }
                        // If only b has order 0, put it at the end
                        if ((b.order || 0) === 0) {
                            return -1;
                        }
                        // Otherwise, sort by order normally
                        return (a.order || 0) - (b.order || 0);
                    });

                    setTables(sortedTables);
                    console.log("Tables length: ", sortedTables.length);
                } catch (error) {
                    console.error("Error fetching tables:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchTablesData();
        }
    }, [role, userId]);

    const handleCheckboxChange = (moduleId: string) => {
        //prev - array of selected modules
        setSelectedModules(prev => {
            if (prev.includes(moduleId)) {
                //remove the moduleId if already selected
                return prev.filter(id => id !== moduleId);
            }
            else {
                //adds the moduleId to the array
                return [...prev, moduleId];
            }
        })
    };
    console.log("selectedModules: ", selectedModules);

    const handleAllTables = async () => {
        if (selectedModules.length < tables.length) {
            setSelectedModules([]);

            const response = await fetchTables(role);
            for (const table of response) {
                setSelectedModules(prev => [...prev, table.id]);
            }
        } else {
            setSelectedModules([]);
        }
    };

    const handleDragStart = (e: React.DragEvent, moduleId: string) => {
        setDraggedModule(moduleId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent, targetModuleId: string) => {
        e.preventDefault();

        if (!draggedModule || draggedModule === targetModuleId) {
            return;
        }

        const draggedIndex = tables.findIndex(table => table.id === draggedModule);
        const targetIndex = tables.findIndex(table => table.id === targetModuleId);

        if (draggedIndex === -1 || targetIndex === -1) {
            return;
        }

        //Create new array with reordered modules
        const newTables = [...tables];
        const [draggedTable] = newTables.splice(draggedIndex, 1);
        newTables.splice(targetIndex, 0, draggedTable);

        //Update order property for all modules
        const updatedTables = newTables.map((table, index) => ({
            ...table,
            order: index + 1
        }));

        setTables(updatedTables);
        setDraggedModule(null);

        //Save the new order immediately
        try {
            const tablesUpdate = updatedTables.map(table => ({
                id: table.id,
                order: table.order
            }));
            await updateTableOrder(userId, tablesUpdate);
            SetMessage({ message: t("Редът е променен успешно!"), messageType: "success", setMessage, setMessageType });
        }
        catch (error) {
            console.error('Failed to save table order:', error);
            SetMessage({ message: t("Грешка при запазване на реда!"), messageType: "error", setMessage, setMessageType });
        }
    };

    const handleDragEnd = () => {
        setDraggedModule(null);
    };

    const handleSave = async () => {
        if (selectedModules.length === 0) {
            SetMessage({ message: t("Моля, изберете поне едно!"), messageType: "error", setMessage, setMessageType });
            return;
        }

        try {
            // Save selected modules (which ones to display)
            const response = await postPreferredTable(userId, selectedModules);
            console.log("Selected modules saved: ", response);

            // Save the current display order of selected modules
            const selectedTablesWithOrder = tables
                .filter(table => selectedModules.includes(table.id))
                .map((table, index) => ({
                    id: table.id,
                    order: index + 1
                }));

            await updateTableOrder(userId, selectedTablesWithOrder);

            SetMessage({ message: t("Успешно запазени!"), messageType: "success", setMessage, setMessageType });

            setTimeout(() => onClose(), 1500);
        } catch (error) {
            SetMessage({ message: t("Грешка при запазване!"), messageType: "error", setMessage, setMessageType });
        }
    };

    const handleResetOrder = async () => {
        //Reset to default order
        const resetTables = [...tables].sort((a, b) => a.defaultOrder - b.defaultOrder);
        const updatedTables = resetTables.map((table, index) => ({
            ...table,
            order: index + 1
        }));
        setTables(updatedTables);

        //Save the reset order to preferred tables
        try {
            const tablesToupdate = updatedTables.map(table => ({
                id: table.id,
                order: table.order
            }));
            await updateTableOrder(userId, tablesToupdate);
            SetMessage({ message: t("Редът е върнат към оригиналната подредба!"), messageType: "success", setMessage, setMessageType });
        }
        catch (error) {
            console.error('Failed to save reset order:', error);
            SetMessage({ message: t("Грешка при запазване на оригиналната подредба!"), messageType: "error", setMessage, setMessageType });
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
            <div className="bg-white text-sm w-110 border-2 border-gray-300">
                <div className="p-3 border-b-2 border-gray-300 flex justify-between items-center">
                    <h2 className="text-base">{t("Управление на модули")}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                    >
                        <IoCloseSharp className="text-2xl" />
                    </button>
                </div>

                <ShowMessage message={message} messageType={messageType} />

                <div className="flex flex-col-2 font-bold bg-gray-100 border-b-2 border-gray-300">
                    <div className=" flex-1 flex items-center pl-4">
                        <GroupCheckbox condition={selectedModules.length === tables.length}
                            onChange={handleAllTables} />
                        <h3 className="p-3">{t("Модул")}</h3>
                    </div>

                    <h3 className="p-3 flex-1">{t("Статус")}</h3>
                </div>
                <div className="p-3 bg-gray-100 flex flex-col space-y-2">
                    {tables.map((table) => (
                        <Module key={table.id} id={table.id} name={table.name}
                            status={tableNames.some(t => t.name.includes(table.name))}
                            description={table.description} order={table.order || 0}
                            isSelected={selectedModules.includes(table.id)}
                            isDragging={draggedModule === table.id}
                            isDropTarget={!!draggedModule && draggedModule !== table.id}
                            checkbox={
                                <TableCheckbox checkedCondition={selectedModules.includes(table.id)}
                                    onChange={() => handleCheckboxChange(table.id)} />
                            }
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                        />
                    ))}
                </div>

                <div className="p-3 flex justify-between items-center border-t-2 border-gray-300">
                    <div className="flex items-center space-x-2">
                        <Button icon={<FaClockRotateLeft className="rotate scale-x-[-1] " />} tooltip={t("ОРИГИНАЛНА ПОДРЕДБА")} onClick={handleResetOrder} />
                        <Button icon={<IoDocumentText />} text={t("ИНСТРУКЦИИ")} />
                    </div>
                    <TableButton text={t("ЗАПАЗЕТЕ ПРОМЕНИТЕ")} display="text-white bg-blue-800 hover:bg-blue-700" onClick={handleSave} />
                </div>
            </div>
        </div>
    );
};

interface ModuleProps {
    id: string;
    name: string;
    checkbox: React.ReactNode;
    status: boolean;
    description: string;
    order: number;
    isSelected: boolean;
    isDragging: boolean;
    isDropTarget: boolean;
    onDragStart: (e: React.DragEvent, moduleId: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, moduleId: string) => void;
    onDragEnd: () => void;
};


const Module: React.FC<ModuleProps> = ({ id, name, checkbox, status, description, isSelected,
    isDragging, isDropTarget, onDragStart, onDragOver, onDrop, onDragEnd
}) => {
    const { t } = useTranslation();

    let showStatus;
    if (status) {
        showStatus = t("Активен");
    } else {
        showStatus = t("Неактивен");
    }

    return (
        <div className={`bg-white flex items-center justify-between border-2 text-center cursor-move 
            transition-all duration-200 ${isDragging ? 'opacity-50 scale-95' : ''} 
            ${isDropTarget ? `border-blue-400 bg-blue-50 shadow-lg` : 'border-gray-300'}`}
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, id)}
            onDragEnd={onDragEnd}
        >
            <div className="flex pl-2 items-center space-x-2 w-1/2	">
                <p>{checkbox}</p>
                <span className={`text-base text-white ${isSelected ? "bg-blue-800" : "bg-gray-400"} rounded-full p-1`}>{moduleIconMap[name]}</span>
                <p>{name}</p>
            </div>
            <div className="p-1 border-x-1 border-gray-300 w-1/4">
                {showStatus}
            </div>
            <div className="p-1 border-r-1 border-gray-300 text-gray-400 w-1/8 flex items-center justify-center hover:cursor-pointer group">
                <div className="relative group-hover:border-2 group-hover:border-gray-300 group-hover:bg-gray-100 p-1 rounded">
                    <FaArrowsAltV className="text-lg" />
                    <div className="p-1 pb-2 text-black text-xs font-bold absolute bottom-5 left-1/2 -translate-x-1/2 bg-white border-2 
                    border-gray-300 hidden group-hover:block">
                        <Arrow position="bottom" />
                        {t("ПРЕМЕСТЕТЕ")}
                    </div>
                </div>
            </div>
            <div className="p-1 text-gray-400 w-1/8 flex items-center justify-center">
                <div className="group relative hover:cursor-pointer hover:text-blue-800">
                    <MdHelp className="text-xl" />

                    <div className="pl-3 w-80 absolute left-full top-1/2 -translate-y-1/2 p-2 hidden group-hover:block 
                    bg-white border-2 border-gray-300 text-gray-700 text-left">
                        <Arrow position="left" display="top-1/2 -translate-y-1/2" />
                        <h3 className="font-bold pb-1">{t("Модул") + " " + name}</h3>
                        <p>{description}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

interface ButtonProps {
    text?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    tooltip?: string;
};
const Button: React.FC<ButtonProps> = ({ text, icon, onClick, tooltip }) => {
    const { t } = useTranslation();

    return (
        <button className="relative group flex items-center space-x-2 p-1 border-2 border-gray-300 text-black hover:cursor-pointer 
        hover:text-blue-800" onClick={onClick}>
            {icon && <span>{icon}</span>}
            {text && <p className="text-xs font-bold">{text}</p>}
            {tooltip && <div className="w-50 absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2  border-2 border-gray-300 bg-white text-xs font-bold p-1 pb-2 text-black">
                {t(tooltip)}
                <Arrow position="bottom" />
            </div>}
        </button>
    );
};