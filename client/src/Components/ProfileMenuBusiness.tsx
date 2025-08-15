import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdPerson, MdSearch } from "react-icons/md";
import { type BusinessClient } from "./ModelTypes";
import { fetchBusinessClients, getUserData } from "../services/authService";
import { useClientContext } from "../context/ClientContext";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoTriangle } from "react-icons/io5";

export const ClientsContainer = ({ name, onClick }: { name: string, onClick: () => void }) => {
    return (
        <div onClick={onClick} className="flex items-center justify-start space-x-2 p-1 w-full text-gray-600 hover:bg-gray-200 cursor-pointer hover:text-blue-800">
            <MdPerson className="w-5 h-5 rounded-full px-1" />
            <h3 className="text-sm">{name}</h3>
        </div>
    );
};

interface UserAndClientProps {
    userNames: string;
    selectedclient: string;
    displaySideIcon?: boolean;
};
export const UserAndClient: React.FC<UserAndClientProps> = ({ userNames, selectedclient, displaySideIcon = false }) => {
    const { t } = useTranslation();

    return (
        <div className="pl-3 w-full">
            <div className="flex items-center space-x-1 p-2">
                <img src="profile-picture.jpg" alt="profile" className="w-10 h-10 rounded-full pr-1" />
                <div className="text-left">
                    <p className="text-sm text-gray-600">Потребител:</p>
                    {userNames && <h3>{t(userNames)}</h3>}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start space-x-1 p-2">
                    <MdPerson className="w-10 h-10 rounded-full pr-1" />
                    <div className="text-left">
                        <p className="text-sm text-gray-600">Клиент:</p>
                        <h3>{t(selectedclient)}</h3>
                    </div>
                </div>
                {displaySideIcon && (
                    <div className="group relative flex items-center hover:cursor-pointer">
                        <FaPeopleGroup className="w-5 h-5 mr-4" />
                        <IoTriangle className={`text-xs text-gray-400 rotate-90`} />
                        <div className="absolute top-0 left-full z-50 bg-white border-2 border-gray-300 
                        hidden group-hover:block w-70">
                            <ProfileMenuBusiness />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export const ProfileMenuBusiness = () => {
    const [businessClients, setBusinessClients] = useState<BusinessClient[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [userNames, setUserNames] = useState<string>("");
    const { selectedClient, setSelectedClient } = useClientContext();

    useEffect(() => {
        const fetchData = async () => {
            const clients = await fetchBusinessClients();
            const names = await getUserData();
            console.log("getUserData result:", names);
            console.log("names[3]:", names[3]);
            setBusinessClients(clients);
            setUserNames(names[3]);
        };
        fetchData();
    }, []);

    const filteredClients = businessClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectedClient = (client: BusinessClient) => {
        setSelectedClient(client);
    };

    return (
        <div className="w-70 text-left">
            <UserAndClient userNames={userNames} selectedclient={selectedClient?.name || ""} />

            <div className="p-3 border-y-2 border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Изберете друг клиент:</p>
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Търсете по име клиент..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}//e.target.value gets the types text into the searchbar
                    />
                </div>
            </div>
            <div className="overflow-y-auto max-h-[180px] 
                    scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {filteredClients.map((client) => <ClientsContainer key={client.id} onClick={(() => handleSelectedClient(client))} name={client.name} />)}
            </div>
        </div>
    );
};