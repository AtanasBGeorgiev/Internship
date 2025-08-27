import { createContext, useContext, useState } from "react";
import { showGlobalError } from "../utils/errorHandler";

type ScreenHeightContextType = {
    height: number;
    setHeight: (height: number) => void;
};

const ScreenHeightContext = createContext<ScreenHeightContextType>({
    height: 0,
    setHeight: () => { }
});

export const ScreenHeightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [height, setHeight] = useState(0);

    return (
        <ScreenHeightContext.Provider value={{ height, setHeight }}>
            {children}
        </ScreenHeightContext.Provider>
    );
};

export const useScreenHeight=()=>{
    const context=useContext(ScreenHeightContext);

    if (!context) {
        throw new Error("ScreenHeightContext not found");
    };

    return context;
};
