import { createContext, useContext, useState } from "react";

export type Position = {
    top: number,
    left: number,
    right: number,
    bottom: number
};

interface PositionContextType {
    positions: { [key: string]: Position };
    setPosition: (key: string, position: Position) => void;
};

const PositionContext = createContext<PositionContextType>({
    positions: {},
    setPosition: () => { }
});

export const PositionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [positions, setPositions] = useState<{ [key: string]: Position }>({});

    const setPosition = (key: string, position: Position) => {
        setPositions(prev => ({ ...prev, [key]: position }));
    }

    return (
        <PositionContext.Provider value={{ positions, setPosition }}>
            {children}
        </PositionContext.Provider>
    );
};

export const usePosition = () => {
    const context = useContext(PositionContext);

    if (!context) {
        throw new Error("usePosition must be used within a PositionProvider");
    }
    return context
};
