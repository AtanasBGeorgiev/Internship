import { FormField } from "./Components";
import { ButtonForm } from "./Components";
import { FormFieldWithIcon } from "./Components";
import { Announcment } from "./Components";
import { FooterLink } from "./Components";
import { ContactInfo } from "./Components";

export const LoginForm: React.FC = () => {
  return (
    <div id="wrapper" className="grid grid-cols-2 gap-4 py-12 px-4mb-2">

      <div className="flex flex-col items-end">
        <form id="login-form" className="border-2 border-gray-300 rounded-sm p-3 w-1/1 md:w-2/3">
          <h3 className="text-xl pb-1">Виртуален банков клон (e-fibank)</h3>
          <FormFieldWithIcon id="username" label="Потребител" src="/icon-user.png" alt="user" isVisible="unhidden" />
          <FormFieldWithIcon id="password" label="Парола" src="/icon-padlock.png" alt="padlock" />
          <ButtonForm type="submit" text="ВХОД" />
        </form>

        <div className="border-2 border-gray-300 rounded-sm w-1/1 md:w-2/3 mt-6 text-center">
          <p className="pl-3 pr-3 pt-3">Защитен вход със <a href="" target="_blank" className="text-blue-800">SSL сертификат</a> от:</p>
          <div className="flex items-center justify-center pl-3 pr-3">
            <img src="/icon-thawte.png" alt="padlock" className="w-42 h-14"></img>
            <p>2015-02-02</p>
          </div>
          <div className="bg-gray-100 flex items-center justify-center p-2">
            <img src="/icon-security-advises.png" alt="security-advises" className="w-5 h-5 mr-2"></img>
            <FooterLink displayProps="text-gray-600 pr-1 border-r-1 border-gray-400 hover:text-blue-800 hover:underline" text="Съвети за сигурност" />
            <img src="/icon-announcment.png" alt="announcment" className="w-5 h-5 ml-2 mr-1"></img>
            <FooterLink displayProps="text-gray-600 pl-1 hover:text-blue-800 hover:underline" text="Съобщения за грешка" />
          </div>
        </div>
      </div>

      <div id="right-sidebar" className="text-sm text-gray-600 w-1/1 md:w-2/3 p-3">
        <Announcment hText="ВАЖНО!" pText="ППИБ АД УВЕДОМЯВА КАРТОДЪРЖАТЕЛИТЕ си, че има информация за получени фалшиви съобщения по електронната поща, които..."
          aText="Прочетете повече" />
        <Announcment hText="Разгледайте системата" pText="Разгледайте и усетете онлайн банкирането чрез интерактивната ни демо версия."
          aDisplayProps="text-blue-800 hover:underline hover:font-bold" aText="ДЕМО ВЕРСИЯ" />
        <Announcment hText="Банкиране с Token" pText="Мобилност, удобство и сигурност в едно, с нашето Token устройство за генериране на еднократни пароли за вход."
          aText="Научете повече" borderProp1="" borderProp2="" />
      </div>

    </div>
  );
}

export const LoginFooter: React.FC = () => {
  return (
    <div id="wrapper" className="w-full text-center text-gray-600 bg-gray-50 p-5">
      <div className="w-6/10 mx-auto">
        <p className="text-black text-lg">За всички въпроси нашите служители Ви очакват на:</p>
        <div className="flex items-center justify-center p-2">

          <ContactInfo src="/icon-phone.png" alt="phone" text="Телефон" spanText="0700 12 777" moreText=" (денонощно)*"/>
          <ContactInfo src="/icon-mail.png" alt="mail" text="E-mail" spanText="e-bank@fibank.bg"/>
          
          <a href="" target="_blank" className="flex items-center group hover:underline hover:text-blue-800">
            <img src="/icon-chat.png" alt="chat" className="w-5 h-5 ml-2"></img>
            Чат:<span className="text-blue-800 font-bold ml-1"> Пишете ни</span>
          </a>
        </div>
        <p className="text-xs">*Разговорите към национален номер 0700 12 777 се таксуват според определените от Вашия оператор цени за обаждане към номера тип 0700 на Vivacom. За абонати на Vivacот обаждане към този номер се таксува като обаждане към стационарен номер в мрежата на Vivacom.</p>
        <p className="text-black text-lg p-2 pt-3">Вижте къде се намираме:</p>
        <div className="flex items-center justify-center">
          <a href="" target="_blank" className="flex items-center border-r-1 border-gray-400 pr-2 hover:text-blue-800 hover:underline">
            <img src="/icon-bank-branches.webp" alt="branch" className="w-6 h-6 mr-1"></img>
            Клонове {'>'}
          </a>
          <a href="" target="_blank" className="flex items-center pl-2 hover:text-blue-800 hover:underline">
            <img src="/icon-atm.png" alt="atm" className="w-5 h-5 ml-2 mr-3"></img>
            Банкомати {'>'}
          </a>
        </div>
      </div>
    </div>
  );
}