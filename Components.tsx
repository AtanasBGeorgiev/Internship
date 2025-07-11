interface InputProps {
    id: string;
    label: string;
    type?: string;
    required?: boolean;
};

export const FormField: React.FC<InputProps> = ({ id, label, type = "text", required = true }) => {
    return (
        <>
            <label htmlFor={id}><span className="text-red-500">*</span> {label}:</label>
            <input id={id} type={type} required={required} className="border-2 border-gray-300 rounded-sm p-1 focus:border-blue-800 focus:outline-none" />
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
    src: string;
    alt: string;
    isVisible?: string;
};

export const FormFieldWithIcon: React.FC<FormFieldWithIconProps> = ({ id, label, type = "text", required = true, src, alt, isVisible = "hidden" }) => {
    return (
        <>
            <label htmlFor={id} className="flex items-center w-full">
                <span className="text-red-500">*</span> {label}:
                <span className={`${isVisible} text-xs text-gray-700 ml-auto`}>
                    <span className="text-red-500">*</span> Задължителни полета
                </span>
            </label>
            <div className="relative">
                <input id={id} type={type} required={required} className="w-full pl-10 border-2 border-gray-500 rounded sm p-1 focus:border-blue-800 focus:outline-none mt-1 mb-2"></input>
                <img src={src} alt={alt} className="absolute left-2 top-1/2 transform -translate-y-2/3  w-4 h-4"></img>
            </div>
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

export const Announcment: React.FC<AnnouncmentProps> = ({ hText, pText, aText, href = "", aDisplayProps = "hover:text-blue-800 hover:underline", borderProp1 = "border-b-2", borderProp2 = "border-gray-300" }) => {
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
};

export const NavbarLink: React.FC<NavbarLinkProps> = ({ href = "", src1, alt1, src2, alt2, text, isVisibleImg1 = "unhidden", isVisibleImg2 = "hidden", dimensions1 = "w-5 h-5", dimensions2 = "w-5 h-5" }) => {
    return (
        <div className="flex items-center justify-center space-x-1 hover:text-blue-800 hover:underline">
            <img src={src2} alt={alt2} className={`${isVisibleImg2} ${dimensions2}`} />
            <img src={src1} alt={alt1} className={`${isVisibleImg1} ${dimensions1}`} />
            <a href={href} target="_blank">{text}</a>
        </div>
    );
};

interface ContactInfoProps {
    src: string;
    alt: string;
    text: string;
    spanText: string;
    moreText?: string;
};

export const ContactInfo: React.FC<ContactInfoProps> = ({ src, alt, text, spanText, moreText = "" }) => {
    return (
        <p className="pr-10 flex items-center">
            <img src={src} alt={alt} className="w-6 h-4 mr-1"></img>
            {text}: <span className="text-blue-800 font-bold mx-1">{spanText}</span> {moreText}
        </p>
    );
};