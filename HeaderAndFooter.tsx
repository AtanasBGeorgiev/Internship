import { useState } from 'react';
import { FooterLink } from "./Components";
import { NavbarLink } from "./Components";

export const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="h-20 mb-2 border-b-2 border-gray-300 lg:h-15">
            <nav className="text-center h-20 p-2 lg:h-15">
                <div className="h-full flex items-center justify-between">
                    <img src="icon-fibank-logo3.jpg" alt="logo" className="w-40 h-10 ml-5" />

                    <div className="hidden md:flex items-center justify-between lg:justify-center space-x-5">
                        <NavbarLink isVisibleImg1="hidden" text="English"/>
                        <NavbarLink src1="icon-monitor.png" alt1="monitor" text="Към сайта"/>
                        <NavbarLink src1="icon-android.png" alt1="android" src2="icon-apple.png" alt2="iphone" isVisibleImg2="unhidden" text="Мобилно приложение"/>
                        <NavbarLink src1="icon-document.png" alt1="document" text="Промени в ОУ и тарифа"/>
                        <NavbarLink src1="icon-info.jpg" alt1="info" text="Помощ" dimensions1="w-7 h-7"/>
                    </div>

                    <button type="button" className="bg-gray-200 p-2 mx-5 hover:bg-blue-800 hover:text-white hover:cursor-pointer">Регистрация</button>
                </div>
            </nav>
        </div>
    );
}

export const Footer: React.FC = () => {
    return (
        <div id="footer" className="w-full text-center text-gray-600 bg-gray-100 p-3">
            <div className="flex items-center justify-center">
                <FooterLink text="Как да добавя сметка"/>
                <FooterLink text="Всичко с един потребител (SSO)"/>
                <FooterLink text="Процес на регистрация"/>
                <FooterLink text="Електронен подпис"/>
                <FooterLink text="Такси и комисионни"/>
                <FooterLink displayProps="pl-2 hover:underline" text="Документи"/>
            </div>
            <p>© Първа инвестиционна банка 2009-2015.</p>
        </div>
    );
}