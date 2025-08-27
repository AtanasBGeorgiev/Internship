import React, { createContext, useContext, useState,type ReactNode } from 'react';
import { type BusinessClient } from '../Components/ModelTypes';

interface ClientContextType {
    selectedClient: BusinessClient | null;
    setSelectedClient: (client: BusinessClient | null) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientContext = () => {
    const context = useContext(ClientContext);
    if (context === undefined) {
        throw new Error('useClientContext must be used within a ClientProvider');
    }
    return context;
};

interface ClientProviderProps {
    children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
    const [selectedClient, setSelectedClient] = useState<BusinessClient | null>(null);

    return (
        <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
            {children}
        </ClientContext.Provider>
    );
};
