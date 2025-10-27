import { createContext, useContext, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingContextType {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    loadingMessage?: string;
}

const LoadingContext = createContext<LoadingContextType>({
    loading: false,
    setLoading: () => { },
    loadingMessage: undefined
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();
    const loadingMessage = t("Зареждане...");

    return (
        <LoadingContext.Provider value={{ loading, setLoading, loadingMessage }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);