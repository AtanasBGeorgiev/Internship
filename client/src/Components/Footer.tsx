import { useTranslation } from "react-i18next";

interface FooterLinkProps {
    href?: string;
    displayProps?: string;
    icon?: React.ReactNode;
    text: string;
};

export const FooterLink: React.FC<FooterLinkProps> = ({ href = "", displayProps = "pt-2 pb-2 pr-2 pl-2 border-r-1 border-gray-400 hover:underline",
    icon, text }) => {
    return (
        <div className={`relative group flex items-center justify-center py-2 px-1 xl:px-3`}>
            {icon && <span className={`mx-2 text-xl text-gray-700 group-hover:text-blue-800`}>{icon}</span>}
            <a href={href} className={`${displayProps}`}>{text} {'>'}</a>
        </div>
    );
};

export const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div id="footer" className="text-sm w-full text-gray-600 bg-gray-100 p-3 text-center md:text-base">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex items-center justify-center pb-4">
                <FooterLink text={t("Как да добавя сметка")} />
                <FooterLink text={t("Всичко с един потребител (SSO)")} />
                <FooterLink text={t("Процес на регистрация")} />
                <FooterLink text={t("Електронен подпис")} />
                <FooterLink text={t("Такси и комисионни")} />
                <FooterLink displayProps="pl-2 hover:underline" text={t("Документи")} />
            </div>
            <p>© {t("Първа инвестиционна банка 2009-2015")}.</p>
        </div>
    );
}