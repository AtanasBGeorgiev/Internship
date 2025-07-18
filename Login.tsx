import { ButtonForm } from "./Components";
import { FormFieldWithIcon } from "./Components";
import { Announcment } from "./Components";
import { FooterLink } from "./Components";
import { ContactInfo } from "./Components";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { hideMessag } from "./Components";
import { useState } from "react";
import { ShowMessage } from "./Components";
import { BiSolidConversation, BiSolidMessageError } from "react-icons/bi";
import { IoDocumentLockOutline } from "react-icons/io5";
import { FaPhone, FaEnvelope, FaUniversity, FaLock, FaUser } from "react-icons/fa";
import { GrAtm } from "react-icons/gr";

type FormValues = {
  username: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  //async- allows to use await inside the function
  //also declares the function as async which returns Promise
  //Promise- object that represents the result of an asyncronous operation
  const onSubmit = async (data: FormValues) => {
    try {
      //await- wiats first to be executed the http request
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/Login`, data);

      //saves the token in the local storage
      const token = response.data.token;
      if (token) {
        localStorage.setItem('jwtToken', token);
      }
      navigate('/Dashboard');
    }
    //:any - says the type of the error is not known and switches off type checking
    catch (error: any) {
      const serverMessage = error.response.data?.error;
      setMessage(serverMessage || "Грешка при вход!");
      setMessageType("error");
      hideMessag(setMessage, setMessageType);
    }
  };

  return (
    <div id="wrapper" className="flex flex-col items-center justify-center md:grid grid-cols-2 gap-4 py-12 px-4">

      <div className="w-3/4 sm:w-1/2 md:w-2/3 lg:w-1/2 md:justify-self-end align-self-end">
        <form onSubmit={handleSubmit(onSubmit)} noValidate
          id="login-form" className="border-2 border-gray-300 rounded-sm p-3 w-full">
          <h3 className="text-base md:text-xl pb-1">Виртуален банков клон (e-fibank)</h3>
          <FormFieldWithIcon id="username" label="Потребител"
            register={register("username", {
              required: "Моля, въедете потребител!",
              pattern: { value: /^[a-zA-Z0-9_-]+$/, message: "Смволи на кирилица!" }
            })} error={errors.username}
            icon={<FaUser />} isVisible="block" />
          <FormFieldWithIcon id="password" label="Парола" type="password"
            register={register("password", {
              required: "Моля, въедете парола!",
              pattern: {
                value: /^[^А-Яа-яЁёЇїІіЄєҐґ]*$/,//^A- all symbols allowed except Cyrillic
                message: "Не използвай кирилица!",
              }
            })} error={errors.password}
            icon={<FaLock />} />
          <a href="" className="text-xs text-gray-700 hover:underline hover:cursor-pointer">Забравена парола?</a>
          <ShowMessage message={message} messageType={messageType} />
          <ButtonForm type="submit" text="ВХОД" />
        </form>

        <div className="text-xs md:text-basic border-2 border-gray-300 rounded-sm mt-6 text-center w-full">
          <p className="pl-3 pr-3 pt-3">Защитен вход със <a href="" target="_blank" className="text-blue-800">SSL сертификат</a> от:</p>
          <div className="flex items-center justify-center pl-3 pr-3">
            <img src="/icon-thawte.png" alt="padlock" className="w-30 h-10 md:w-42 md:h-14"></img>
            <p>2015-02-02</p>
          </div>
          <div className="bg-gray-100 flex items-center justify-center p-2">
            <FooterLink displayProps="text-gray-600 pr-1 border-r-1 border-gray-400 hover:text-blue-800 hover:underline"
              icon={<IoDocumentLockOutline />} text="Съвети за сигурност" />
            <FooterLink displayProps="text-gray-600 pl-1 hover:text-blue-800 hover:underline"
              icon={<BiSolidMessageError />} text="Съобщения за грешка" />
          </div>
        </div>
      </div>

      <div id="right-sidebar" className="text-sm text-gray-600 w-3/4 sm:w-1/2 md:w-2/3 lg:w-1/2 p-3">
        <Announcment hText="ВАЖНО!" pText="ППИБ АД УВЕДОМЯВА КАРТОДЪРЖАТЕЛИТЕ си, че има информация за получени фалшиви съобщения по електронната поща, които..."
          aText="Прочетете повече" />
        <Announcment hText="Разгледайте системата" pText="Разгледайте и усетете онлайн банкирането чрез интерактивната ни демо версия."
          aDisplayProps="hover:font-bold" aText="ДЕМО ВЕРСИЯ" />
        <Announcment hText="Банкиране с Token" pText="Мобилност, удобство и сигурност в едно, с нашето Token устройство за генериране на еднократни пароли за вход."
          aText="Научете повече" borderProp1="" borderProp2="" />
      </div>

    </div>
  );
}

export const LoginFooter: React.FC = () => {
  return (
    <div id="wrapper" className="w-full text-center text-gray-600 bg-gray-50 p-5">
      <div className="w-9/10 md:w-7/10 mx-auto">
        <p className="text-black sm:text-basic md:text-lg">За всички въпроси нашите служители Ви очакват на:</p>
        <div className="text-xs sm:text-base md:text-lg p-2 grid grid-cols-1 justify-items-center justify-center xl:flex">
          <ContactInfo icon={<FaPhone />} text="Телефон" spanText="0700 12 777" moreText=" (денонощно)*" />
          <ContactInfo icon={<FaEnvelope />} text="E-mail" spanText="e-bank@fibank.bg" />
          <ContactInfo icon={<BiSolidConversation />} text="Чат" spanText="Пишете ни" isLink={true} />
        </div>
        <p className="text-xs">*Разговорите към национален номер 0700 12 777 се таксуват според определените от Вашия оператор цени за обаждане към номера тип 0700 на Vivacom. За абонати на Vivacот обаждане към този номер се таксува като обаждане към стационарен номер в мрежата на Vivacom.</p>
        <p className="text-black text-lg p-2 pt-3">Вижте къде се намираме:</p>
        <div className="flex items-center justify-center">
        <FooterLink displayProps="text-gray-600 pr-1 border-r-1 border-gray-400 hover:text-blue-800 hover:underline"
              icon={<FaUniversity />} text="Клонове" />
            <FooterLink displayProps="text-gray-600 pl-1 hover:text-blue-800 hover:underline"
              icon={<GrAtm />} text="Банкомати" />
        </div>
      </div>
    </div>
  );
}