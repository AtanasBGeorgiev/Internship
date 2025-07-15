import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
    return (
        <>
            {/*Required in <label> is used to show the red * if the input is required. */}
            <label htmlFor={id}>
                {required && <span className="text-red-500">*</span>}{label}
            </label>
            <div className="relative">
                <input id={id} type={type} required={required} {...register}
                    className={`border-2 p-1 pr-8 rounded-sm w-full focus:outline-none 
                        ${error ? "border-red-500" : "border-gray-300 focus:border-blue-800"}`} />

                {tooltipContent && (
                    <div className="absolute inset-y-0 right-2 flex items-center group">
                        <img src="/icon-input-requirments.png" alt="input requirments" className="w-4 h-4 cursor-pointer" />

                        <div className="absolute bottom-full right-0 mb-2 bg-white hidden w-60 text-xs border-2 border-gray-300 rounded p-2 group-hover:block z-10 shadow-lg">
                            {tooltipContent}
                        </div>
                    </div>
                )}
                {error && (<span className="text-red-500">{error.message}</span>)}
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
        <button type={type} className="w-full bg-blue-800 text-white p-2 mt-2 mb-4 hover:cursor-pointer">{text}</button>
    );
};

interface FormFieldWithIconProps {
    id: string;
    label: string;
    type?: string;
    required?: boolean;
    register?: UseFormRegisterReturn;
    error?: FieldError;
    src: string;
    alt: string;
    isVisible?: string;
};

export const FormFieldWithIcon: React.FC<FormFieldWithIconProps> = ({ id, label, type = "text", required = true, src, alt,
    isVisible = "hidden", register, error }) => {
    return (
        <>
            <label htmlFor={id} className="flex items-center w-full">
                <span className="text-red-500">*</span> {label}:
                <span className={`${isVisible} text-xs text-gray-700 ml-auto`}>
                    <span className="text-red-500">*</span> Задължителни полета
                </span>
            </label>
            <div className="relative">
                <input id={id} type={type} required={required} {...register}
                    className="w-full pl-10 border-2 border-gray-500 rounded-sm p-1 focus:border-blue-800 focus:outline-none mt-1"
                />
                <img src={src} alt={alt} className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>
            {error && (
                <div className="text-red-500 text-xs mt-1 text-right">
                    {error.message}
                </div>
            )}
        </>
    );
};

interface AnnouncmentProps {
    hText: string;
    pText: string;
    aText: string;
    /* със ?, защото нямам конкретни връзки */
    href?: string;
    aDisplayProps?: string;
    borderProp1?: string;
    borderProp2?: string;
};

export const Announcment: React.FC<AnnouncmentProps> = ({ hText, pText, aText, href = "",
    aDisplayProps = "hover:text-blue-800 hover:underline", borderProp1 = "border-b-2", borderProp2 = "border-gray-300" }) => {
    return (
        <div className={`${borderProp1} ${borderProp2} pb-4`}>
            <h3 className="text-xl font-bold pt-2">{hText}</h3>
            <p className="pt-2 pb-2">{pText}</p>
            <a href={href} target="_blank" className={`${aDisplayProps}`}>{aText} {'>'}</a>
        </div>
    );
};

interface FooterLinkProps {
    href?: string;
    displayProps?: string;
    text: string;
};

export const FooterLink: React.FC<FooterLinkProps> = ({ href = "", displayProps = "pr-2 pl-2 border-r-1 border-gray-400 hover:underline", text }) => {
    return (
        <a href={href} target="_blank" className={`${displayProps}`}>{text} {'>'}</a>
    );
};

interface NavbarLinkProps {
    href?: string;
    src1?: string;
    alt1?: string;
    src2?: string;
    alt2?: string;
    text: string;
    isVisibleImg1?: string;
    isVisibleImg2?: string;
    dimensions1?: string;
    dimensions2?: string;
    tooltipText?: React.ReactNode;
};

export const NavbarLink: React.FC<NavbarLinkProps> = ({ href = "", src1, alt1, src2, alt2, text, isVisibleImg1 = "unhidden",
    isVisibleImg2 = "hidden", dimensions1 = "w-5 h-5", dimensions2 = "w-5 h-5", tooltipText }) => {
    return (
        <div className="relative group flex items-center justify-center space-x-1">
            {tooltipText &&
                <div className="absolute top-full z-50 bg-white border-2 border-gray-300 hidden group-hover:block">
                    {tooltipText}
                </div>
            }
            <img src={src2} alt={alt2} className={`${isVisibleImg2} ${dimensions2}`} />
            <img src={src1} alt={alt1} className={`${isVisibleImg1} ${dimensions1}`} />
            <Link className="group-hover:text-blue-800" to={href} target="_blank">{text}</Link>
        </div>
    );
};

interface ContactInfoProps {
    src: string;
    alt: string;
    text: string;
    spanText?: string;
    moreText?: string;
    isLink?: boolean;
    href?: string;
};

export const ContactInfo: React.FC<ContactInfoProps> = ({ src, alt, text, spanText, moreText = "", isLink = false, href = "" }) => {
    if (isLink === true) {
        return (
            <a href={href} target="_blank" className="flex items-center group hover:underline hover:text-blue-800">
                <img src={src} alt={alt} className="w-5 h-5 ml-2"></img>
                {text}:<span className="text-blue-800 font-bold ml-1"> {spanText}</span> {moreText}
            </a>
        );
    }
    else {
        return (
            <p className="pr-10 flex items-center">
                <img src={src} alt={alt} className="w-6 h-4 mr-1"></img>
                {text}: <span className="text-blue-800 font-bold mx-1">{spanText}</span> {moreText}
            </p>
        );
    }
};

export const NavbarHelpContact: React.FC<ContactInfoProps> = ({ src, alt, text, spanText = "", moreText = "", isLink = false, href = "" }) => {
    return (
        <p className="pl-2 w-full flex items-center py-2 text-xs text-gray-700 font-bold hover:text-blue-800 hover:bg-gray-200">
            <img src={src} alt={alt} className="w-6 h-4 mr-1"></img>
            {text}
        </p>
    );
};

export const AllNavbarLinks: React.FC = () => {
    return (
        <>
            <NavbarLink isVisibleImg1="hidden" text="English" />
            <NavbarLink src1="icon-monitor.png" alt1="monitor" text="Към сайта" />
            <NavbarLink src1="icon-android.png" alt1="android" src2="icon-apple.png" alt2="iphone" isVisibleImg2="unhidden" text="Мобилно приложение"
                tooltipText={
                    <div className="bg-gradient-to-b from-blue-700 to-white w-60 text-center flex flex-col items-center">
                        <h1 className="font-bold self-start text-left p-1">Банкирай навсякъде, по всяко време</h1>
                        <img src="/icon-bashar.jpg" alt="bashar" className="w-20 h-20 my-2" />
                        <a href="" className="bg-white text-black p-2 m-4 rounded hover:bg-gray-200">
                            НАУЧЕТЕ ПОВЕЧЕ
                        </a>
                    </div>
                }
            />
            <NavbarLink src1="icon-document.png" alt1="document" text="Промени в ОУ и тарифа" />
            <NavbarLink src1="icon-info.jpg" alt1="info" text="Помощ" dimensions1="w-7 h-7"
                tooltipText={
                    <div className="w-60 text-left">
                        <div className="border-b-2 border-gray-300 pb-2">
                            <strong className="pl-2">Информация</strong>
                            <NavbarHelpContact src="/icon-document.png" alt="document" text="Помощни статии" />
                            <NavbarHelpContact src="/icon-faq.webp" alt="faq" text="Често задавани въпроси" />
                            <NavbarHelpContact src="/icon-security-advises.png" alt="security-advises" text="Съвети за сигурност" />
                        </div>
                        <div className="pt-2">
                            <strong className="pl-2">Връзка с нас</strong>
                            <NavbarHelpContact src="/icon-phone.png" alt="phone" text="0700 12 777" />
                            <NavbarHelpContact src="/icon-mail.png" alt="mail" text="help@fibank.bg" />
                            <NavbarHelpContact src="/icon-chat.png" alt="chat" text="Онлайн чат" />
                        </div>
                    </div>
                } />
        </>
    );
};

export const NavbarMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-700 hover:text-blue-800 focus:outline-none">
                    {/* viewBox="0 0 24 24" - coordinates of the svg */}
                    {/* d="M6 18L18 6M6 6l12 12" - drawing the lines */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white z-50 px-4 pb-4 space-y-2 shadow-lg">
                    <AllNavbarLinks/>
                </div>
            )}
        </>
    );
};