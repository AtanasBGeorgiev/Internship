//global mechanism to handle errors

let setGlobalError: (msg: string | null) => void = () => { };
let isAuthErrorActive = false;

//accepts a function that will be called when an error occurs
export const registerErrorHandler = (fn: (msg: string | null) => void) => {
    setGlobalError = fn;
};

//calls the function that was registered
export const showGlobalError = (msg: string, force: boolean = false) => {
    //If at the moment is displayed an auth error, don't display another one
    if (!force && isAuthErrorActive) return;
    setGlobalError(msg);
};

// Centralized logout utility
export const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('jwtToken');
    window.location.href = '/Login';
};

// Handle authentication errors (401, 403, token expired)
export const handleAuthError = (message: string = 'Authentication failed. Please login again.') => {
    isAuthErrorActive = true;
    showGlobalError(message, true);

    // Small delay to show the error message before logout
    setTimeout(() => {
        isAuthErrorActive = false;
        logout();
    }, 2000);
};
