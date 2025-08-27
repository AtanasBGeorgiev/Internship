//global mechanism to handle errors
import i18n from '../i18n';

let setGlobalError: (msg: string | null) => void = () => { };
let setIsAuthErrorActive: (isActive: boolean) => void = () => { };
let isAuthErrorActive = false;

//accepts a function that will be called when an error occurs
export const registerErrorHandler = (fn: (msg: string | null) => void) => {
    setGlobalError = fn;
};

export const showGlobalError = (msg?: string, force: boolean = false) => {
    if (!force && isAuthErrorActive) return;

    const safeMsg = msg ?? "";

    if (safeMsg.startsWith("errors.")) {
        const translatedMsg = i18n.t(safeMsg);
        setGlobalError(translatedMsg);
    } else {
        setGlobalError(safeMsg);
    }
};

// Centralized logout utility
export const logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/Login';
};

// Handle authentication errors (401, 403, token expired)
export const handleAuthError = (message: string = 'errors.authenticationRequired') => {
    isAuthErrorActive = true;
    setIsAuthErrorActive(true);
    showGlobalError(message, true);

    setTimeout(() => {
        isAuthErrorActive = false;
        setIsAuthErrorActive(false);
        logout();
    }, 2000);
};

export const getIsAuthErrorActive = () => isAuthErrorActive;