import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { Arrow } from './Common';
import { useTranslation } from 'react-i18next';

interface InputProps {
    id: string;
    label: string;
    type?: string;
    required?: boolean;
    register?: UseFormRegisterReturn;
    error?: FieldError;
    tooltipContent?: React.ReactNode;
};

export const FormField: React.FC<InputProps> = ({ id, label, type = "text", required = true, register, error, tooltipContent }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        //media query = true if the screen is less than 1024px
        const mediaQuery = window.matchMedia("(max-width: 1024px)");
        setIsMobile(mediaQuery.matches);

        //listener for the changes of the screen width
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mediaQuery.addEventListener("change", handler);

        //clear the listener
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return (
        <>
            <label htmlFor={id}>
                {required && <span className="text-red-500">*</span>}
                {label}
            </label>
            <div className="relative">
                <div className="relative">
                    <input id={id} type={type} required={required} {...register}
                        className={`border-2 p-1 pr-8 rounded-sm w-full focus:outline-none ${error ? "border-red-500" : "border-gray-300 focus:border-blue-800"
                            }`} />

                    {tooltipContent && (
                        <div className={`absolute inset-y-0 right-2 flex items-center ${isMobile ? "" : "group"}`}>
                            <img src="/icon-input-requirments.png" alt="input requirements" className="w-4 h-4 cursor-pointer"
                                onClick={() => isMobile && setShowTooltip((prev) => !prev)} />

                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2  mb-2 bg-white w-60 text-xs 
                        border-2 border-gray-300 rounded p-2 z-10 shadow-lg
                        ${isMobile ? showTooltip ? "block" : "hidden" : "hidden group-hover:block"}`}>
                                {tooltipContent}
                            </div>
                        </div>
                    )}

                    {error && <Arrow position="redBottom" />}
                </div>
                {error && (
                    <div className="text-red-500 text-xs mt-2 text-right">
                        {error.message}
                    </div>
                )}
            </div>
        </>
    );
};

interface ButtonFormProps {
    type?: "submit";
    text: string;
};

export const ButtonForm: React.FC<ButtonFormProps> = ({ type = "submit", text }) => {
    return (
        <button type={type} className="w-full bg-blue-800 text-white p-2 mt-2 mb-4 hover:cursor-pointer text-xssm md:text-base">{text}</button>
    );
};

interface FormFieldWithIconProps {
    id: string;
    label: string;
    type?: string;
    required?: boolean;
    register?: UseFormRegisterReturn;
    error?: FieldError;
    icon: React.ReactNode;
    isVisible?: string;
};

export const FormFieldWithIcon: React.FC<FormFieldWithIconProps> = ({ id, label, type = "text", required = true, icon,
    isVisible = "hidden", register, error }) => {
    const { t } = useTranslation();
    return (
        <>
            <label htmlFor={id} className="text-xs md:text-base flex items-center w-full">
                <span className="text-red-500">*</span> {label}:
                <span className={`${isVisible} text-xs text-gray-700 ml-auto`}>
                    <span className="text-red-500">*</span> {t("Задължителни полета")}
                </span>
            </label>


            <div className="relative">
                <input id={id} type={type} required={required} {...register}
                    className={`w-full pl-10 border-2 ${error ? "border-red-500" : "border-gray-300"} rounded-sm p-1 focus:border-blue-800 focus:outline-none mt-1`}
                />
                {icon && <span className="text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4">{icon}</span>}
                {error && <Arrow position="redBottom" />}
            </div>
            {error && (
                <div className="text-red-500 text-xs mt-2 text-right">
                    {error.message}
                </div>
            )}
        </>
    );
};