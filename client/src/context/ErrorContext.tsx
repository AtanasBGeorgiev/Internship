import { createContext, useContext, useState, type ReactNode } from 'react';

interface ErrorContextType {
    error: string | null;
    setError(message: string | null): void;
}

const ErrorContext = createContext<ErrorContextType>({
    error: null,
    setError: () => { }
});

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<string | null>(null);
    
    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);
