import { type Position } from "../context/PositionContext";

interface OverlayProps {
    position: Position;
};
export const Overlay: React.FC<OverlayProps> = ({ position }) => {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 bg-black/70 z-40"
                style={{ height: `${position.top}px` }}></div>

            <div className="fixed top-0 left-0 bg-black/70 z-40"
                style={{
                    top: `${position.top}px`,
                    height: `${position.bottom - position.top}px`,
                    width: `${position.left}px`
                }}></div>

            <div className="fixed top-0 right-0 bg-black/70 z-40"
                style={{
                    top: `${position.top}px`,
                    height: `${position.bottom - position.top}px`,
                    width: `calc(100vw - ${position.right}px)`,
                    left: `${position.right}px`
                }}></div>

            <div className="fixed bottom-0 left-0 right-0 bg-black/70 z-40"
                style={{
                    top: `${position.bottom}px`,
                    height: `calc(100vh - ${position.bottom}px)`
                }}></div>
        </>
    );
};