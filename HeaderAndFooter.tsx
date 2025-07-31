import { FooterLink } from "./Components";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { NavbarMenu } from "./Components";
import { AllNavbarLinks } from "./Components";

const handleLogout = () => {
    localStorage.removeItem('jwtToken');
  };

export const Header: React.FC = () => {
    const location = useLocation();

    return (
        <div className="h-20 mb-2 border-b-2 border-gray-300 lg:h-15">
            <nav className="text-center h-20 p-2 lg:h-15">
                <div className="h-full flex items-center justify-between relative">
                    <img src="icon-fibank-logo3.jpg" alt="logo" className="w-40 h-10 ml-5" />

                    <div className="hidden md:flex items-center justify-between lg:justify-center space-x-5">
                        <AllNavbarLinks/>
                    </div>

                    <NavbarMenu/>

                    {(location.pathname === "/Login" || location.pathname === "/") &&
                        <Link to="/Register" className="bg-gray-200 p-2 mx-5 hover:bg-blue-800 hover:text-white hover:cursor-pointer rounded">
                            Регистрация
                        </Link>
                    }
                    {location.pathname === "/Register" &&
                        <Link to="/Login" className="bg-blue-800 text-white py-2 px-8 mx-5 hover:cursor-pointer">ВХОД</Link>
                    }
                    {location.pathname === "/Dashboard" &&
                        <Link onClick={handleLogout} to="/Login" className="bg-red-600 text-white py-2 px-8 mx-5 hover:cursor-pointer">ИЗХОД</Link>
                    }
                </div>
            </nav>
        </div>
    );
}

export const Footer: React.FC = () => {
    return (
        <div id="footer" className="w-full text-center text-gray-600 bg-gray-100 p-3">
            <div className="flex items-center justify-center">
                <FooterLink text="Как да добавя сметка" />
                <FooterLink text="Всичко с един потребител (SSO)" />
                <FooterLink text="Процес на регистрация" />
                <FooterLink text="Електронен подпис" />
                <FooterLink text="Такси и комисионни" />
                <FooterLink displayProps="pl-2 hover:underline" text="Документи" />
            </div>
            <p>© Първа инвестиционна банка 2009-2015.</p>
        </div>
    );
}