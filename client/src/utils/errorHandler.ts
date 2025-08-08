let setGlobalError: (msg: string | null) => void = () => { };

export const registerErrorHandler = (fn: (msg: string | null) => void) => {
    setGlobalError = fn;
};

export const showGlobalError = (msg: string) => {
    setGlobalError(msg);
};