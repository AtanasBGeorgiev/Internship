/*
createContext creates a new Context which can be shared across components
useContext allows to access the values in the context
*/
import { createContext, useContext, useState, type ReactNode } from 'react';

interface ErrorContextType {
    error: string | null;
    setError(message: string | null): void;
}

//initialize the context with  default values
//createContext returns a context object which contains two components:
//1.ErrorContext.Provider - provides the context to it's children
//2.ErrorContext.Consumer - reads the values from the context( today we don't use it).We use useContext instead
const ErrorContext = createContext<ErrorContextType>({
    error: null,
    setError: () => { }
});


//Component which wraps a part of the app and gives access to the context
export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<string | null>(null);

    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    );
};

//custom hook to access the context
//useError will be called instead of useContext(ErrorContext)
export const useError = () => useContext(ErrorContext);