import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { IoCloseSharp } from "react-icons/io5";

import { TableButton } from "./Tables";
import { Arrow } from "./Common";
import { usePosition } from "../context/PositionContext";
import { Overlay } from "./Overlay";
import { CalculateTopDistance } from "./Calculations";

export const Tutorial: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);

    const { positions } = usePosition()
    console.log(positions);

    const handleStepForward = () => {
        setStep(step + 1);
    };
    const handleStepBackward = () => {
        setStep(step - 1);
    };

    const modalRef = useRef<HTMLDivElement>(null);
    const [modalWidth, setModalWidth] = useState(0);
    const [modalHeight, setModalHeight] = useState(0);

    useEffect(() => {
        if (modalRef.current) {
            setModalWidth(modalRef.current.offsetWidth);
            setModalHeight(modalRef.current.offsetHeight);
        }
    }, [modalRef.current]);

    return (
        <>
            {step === 1 && <Overlay position={positions.button} />}
            {step === 2 && <Overlay position={positions.iconSettings} />}
            {step === 3 && <Overlay position={positions.iconClients} />}

            <div ref={modalRef} className="fixed bg-white text-sm w-100 border-2 border-gray-300 z-50"
                style={{
                    top: step === 1 ? CalculateTopDistance({ top: positions.button.top, bottom: positions.button.bottom, modalHeight }) :
                        step === 2 ? CalculateTopDistance({ top: positions.iconSettings.top, bottom: positions.iconSettings.bottom, modalHeight }) :
                            CalculateTopDistance({ top: positions.iconClients.top, bottom: positions.iconClients.bottom, modalHeight }),
                    left: step === 1 ? positions.button.right + 20 : step === 2 ? positions.iconSettings.left - modalWidth - 30 : positions.iconClients.right + 30
                }}>

                {(step === 1 || step === 3) && <Arrow position="left" display="top-1/2 -translate-y-1/2" />}
                {step === 2 && <Arrow position="right" display="top-1/2 -translate-y-1/2" />}

                <div className="p-3 flex justify-between items-center">
                    <div className="text-base font-bold">
                        {step === 1 && <h2>{t("Извършване на превод")}</h2>}
                        {step === 2 && <h2>{t("Настройки на модул")}</h2>}
                        {step === 3 && <h2>{t("Смяна на клиент")}</h2>}
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                    >
                        <IoCloseSharp className="text-2xl" />
                    </button>
                </div>

                <div className="p-3 text-gray-900">
                    {step === 1 && <p>{t("Изведохме бутон за нов превод, за да може да извършите плащанията си по най-бързия начин.")}</p>}
                    {step === 2 && <p>{t("Натиснете тук, за да извикате меню, от което да настроите модул според Вашите предпочитания.")}</p>}
                    {step === 3 && <p>{t("Натиснете тук, за да извикате меню, от което да изберете клиент.")}</p>}
                </div>

                <div className="p-3 flex justify-between items-center border-t-2 border-gray-300">
                    <p className="text-xs text-black font-bold">{t("ПОДСКАЗКА")} {step}/3</p>
                    <div className="flex items-center space-x-2">
                        {step > 1 && <TableButton text={"<"} display="text-black bg-white border-2 border-gray-300 hover:cursor-pointer" onClick={handleStepBackward} />}
                        <TableButton text={step < 3 ? t("НАПРЕД") + " >" : t("КРАЙ")} display={`w-30 text-white bg-blue-800 hover:bg-blue-700`} onClick={step < 3 ? handleStepForward : onClose} />
                    </div>
                </div>
            </div>
        </>
    );
};