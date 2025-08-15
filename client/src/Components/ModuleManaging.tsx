import { useTranslation } from "react-i18next";
import { Table, TableData, TableButton } from "./Tables";
import { IoCloseSharp } from "react-icons/io5";

interface ModuleManagingProps {
    modules: boolean[];
    onClose: () => void;
};

export const ModuleManaging: React.FC<ModuleManagingProps> = ({ modules, onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
            <div className="bg-white text-sm w-100 border-2 border-gray-300">
                <div className="p-3 border-b-2 border-gray-300 flex justify-between items-center">
                    <h2 className="text-base">{t("Управление на модули")}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                    >
                        <IoCloseSharp className="text-2xl" />
                    </button>
                </div>




                <div className="p-3 flex justify-end items-center border-t-2 border-gray-300">
                    <TableButton text={t("ЗАПАЗЕТЕ ПРОМЕНИТЕ")} display="text-white bg-blue-800 hover:bg-blue-700" />
                </div>
            </div>
        </div>
    );
};