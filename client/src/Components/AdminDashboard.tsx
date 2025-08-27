import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import { Table, TableData, SectionHead } from "./Tables";
import { type TableNames, type User } from "./ModelTypes";
import { fetchUsers} from "../services/authService";
import { AdminRoleModule } from "./AdminRoleModule";
import { Loading, ErrorMessage } from "./Common";

interface AdminDashboardProps {
    showModule: boolean;
    setShowModule: (showModule: boolean) => void;
    tableNames: TableNames[];
    ShowModule: () => void;
};
export const AdminDashboard: React.FC<AdminDashboardProps> = ({ showModule, setShowModule, tableNames, ShowModule }) => {
    const { t } = useTranslation();

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const users = await fetchUsers();
                setUsers(users.slice(0, 10));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch users');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsersData();
    }, []);

    isLoading && <Loading />;

    error && <ErrorMessage message={t("Грешка при зареждане на потребители")} />
           
    return (
        <>
            {showModule && <AdminRoleModule onClose={() => setShowModule(false)} />}

            {tableNames.some(table => table.name.includes("Потребители") || table.name.includes("Users")) &&
                <>
                    <SectionHead title={t("ПОТРЕБИТЕЛИ")} onClick={ShowModule} />
                    <Table
                        tableHead={
                            <>
                                <TableData type="th" text={t("Име на Кирилица")} />
                                <TableData type="th" text={t("Име на Латиница")} />
                                <TableData type="th" text={t("ЕГН")} />
                                <TableData type="th" text={t("Паспорт")} />
                                <TableData type="th" text={t("Телефон")} />
                                <TableData type="th" text={t("Имейл")} />
                                <TableData type="th" text={t("Адрес")} />
                                <TableData type="th" text={t("Роля")} />
                            </>
                        }
                        items={users}
                        tableData={(user) => (
                            <>
                                <TableData text={`${user.nameCyrillic}`} display="p-2" />
                                <TableData text={`${user.nameLatin}`} />
                                <TableData text={`${user.egn}`} />
                                <TableData text={`${user?.passport}`} />
                                <TableData text={`${user.phone}`} />
                                <TableData text={`${user.email}`} />
                                <TableData text={`${user.address}`} />
                                <TableData text={`${user.role}`} />
                            </>
                        )} />
                </>
            }
        </>
    );
};