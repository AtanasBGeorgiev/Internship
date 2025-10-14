import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import { type TableNames, type User } from "./ModelTypes";
import { fetchUsers } from "../services/userService";
import { AdminRoleModule } from "./AdminRoleModule";
import { Loading, ErrorMessage } from "./Common";
import { UsersTable } from "./DashTables";

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
                <UsersTable users={users} ShowModule={ShowModule} />
            }
        </>
    );
};