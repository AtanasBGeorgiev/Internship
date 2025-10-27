import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import { type TableNames, type User } from "./ModelTypes";
import { fetchUsers } from "../services/userService";
import { AdminRoleModule } from "./AdminRoleModule";
import { ErrorMessage } from "./Common";
import { UsersTable } from "./DashTables";
import { useLoading } from "../context/LoadingContext";

interface AdminDashboardProps {
    showModule: boolean;
    setShowModule: (showModule: boolean) => void;
    tableNames: TableNames[];
    ShowModule: () => void;
};
export const AdminDashboard: React.FC<AdminDashboardProps> = ({ showModule, setShowModule, tableNames, ShowModule }) => {
    const { t } = useTranslation();

    const [users, setUsers] = useState<User[]>([]);
    const { setLoading} = useLoading();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                setLoading(true);
                setError(null);
                const users = await fetchUsers();
                setUsers(users.slice(0, 10));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsersData();
    }, []);

    error && <ErrorMessage message={t("Грешка при зареждане на потребители")} />

    return (
        <>
            {showModule && <AdminRoleModule onClose={() => setShowModule(false)} />}

            {tableNames.some(table => table.name.includes("Потребители") || table.name.includes("Users")) &&
                <UsersTable users={users} ShowModule={ShowModule} />
            }
        </>
    );
};