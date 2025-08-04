import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from './api/axiosInstance';

import { BiSolidConversation, BiSolidMessageError } from "react-icons/bi";
import { IoDocumentLockOutline } from "react-icons/io5";
import { FaPhone, FaEnvelope, FaUniversity, FaLock, FaUser } from "react-icons/fa";
import { GrAtm } from "react-icons/gr";

import { FormFieldWithIcon, ButtonForm } from "./Components/InputForms";
import { Announcment, hideMessage, ShowMessage } from "./Components/Common";
import { FooterLink, ContactInfo } from "./Components/HeaderAndFooter";

type FormValues = {
  username: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  //async- allows to use await inside the function
  //also declares the function as async which returns Promise
  //Promise- object that represents the result of an asyncronous operation
  const onSubmit = async (data: FormValues) => {
    try {
      //await- wiats first to be executed the http request
      const response = await api.post(`/api/login/Login`, data);

      //saves the token in the local storage
      const token = response.data.token;
      if (token) {
        localStorage.setItem('jwtToken', token);
      }
      navigate('/Dashboard');
    }
    //:any - says the type of the error is not known and switches off type checking
    catch (error: any) {
      const errorKey = error.response?.data?.errorKey;
      const defaultMessage = t("login.genericError");

      setMessage(errorKey ? t(errorKey) : defaultMessage);
      setMessageType("error");
      hideMessage(setMessage, setMessageType);
    }
  };

  return (
    <div id="wrapper" className="flex flex-col items-center justify-center md:grid grid-cols-2 gap-4 py-12 px-4">

      <div className="w-3/4 sm:w-1/2 md:w-2/3 lg:w-1/2 md:justify-self-end align-self-end">
        <form onSubmit={handleSubmit(onSubmit)} noValidate
          id="login-form" className="border-2 border-gray-300 rounded-sm p-3 w-full">
          <h3 className="text-base md:text-xl pb-1">{t("Виртуален банков клон (e-fibank)")}</h3>
          <FormFieldWithIcon id="username" label={t("Потребител")}
            register={register("username", {
              required: t("Моля, въедете потребител!"),
              pattern: { value: /^[a-zA-Z0-9_-]+$/, message: t("Смволи на кирилица!") }
            })} error={errors.username}
            icon={<FaUser />} isVisible="block" />
          <FormFieldWithIcon id="password" label={t("Парола")} type="password"
            register={register("password", {
              required: t("Моля, въедете парола!"),
              pattern: {
                value: /^[^А-Яа-яЁёЇїІіЄєҐґ]*$/,//^A- all symbols allowed except Cyrillic
                message: t("Не използвай кирилица!"),
              }
            })} error={errors.password}
            icon={<FaLock />} />
          <a href="" className="text-xs text-gray-700 hover:underline hover:cursor-pointer">{t("Забравена парола?")}</a>
          <ShowMessage message={message} messageType={messageType} />
          <ButtonForm type="submit" text={t("ВХОД")} />
        </form>

        <div className="text-xs md:text-base border-2 border-gray-300 rounded-sm mt-6 text-center w-full">
          <p className="pl-3 pr-3 pt-3">  {t("Защитен вход със")}{" "}
            <a href="" className="text-blue-800">{t("SSL сертификат")}</a>{" "}{t("от:")}
          </p>
          <div className="flex items-center justify-center pl-3 pr-3">
            <img src="/icon-thawte.png" alt="padlock" className="w-30 h-10 md:w-42 md:h-14"></img>
            <p>2015-02-02</p>
          </div>
          <div className="bg-gray-100 flex items-center justify-center p-2">
            <FooterLink displayProps="text-gray-600 pr-1 border-r-1 border-gray-400 hover:text-blue-800 hover:underline"
              icon={<IoDocumentLockOutline />} text={t("Съвети за сигурност")} />
            <FooterLink displayProps="text-gray-600 pl-1 hover:text-blue-800 hover:underline"
              icon={<BiSolidMessageError />} text={t("Съобщения за грешка")} />
          </div>
        </div>
      </div>

      <div id="right-sidebar" className="text-sm text-gray-600 w-3/4 sm:w-1/2 md:w-2/3 lg:w-1/2 p-3">
        <Announcment
          hText={t("ВАЖНО!")}
          pText={t("ППИБ АД УВЕДОМЯВА КАРТОДЪРЖАТЕЛИТЕ си, че има информация за получени фалшиви съобщения по електронната поща, които...")}
          aText={t("Прочетете повече")}
        />
        <Announcment
          hText={t("Разгледайте системата")}
          pText={t("Разгледайте и усетете онлайн банкирането чрез интерактивната ни демо версия.")}
          aDisplayProps="hover:font-bold"
          aText={t("ДЕМО ВЕРСИЯ")}
        />
        <Announcment
          hText={t("Банкиране с Token")}
          pText={t("Мобилност, удобство и сигурност в едно, с нашето Token устройство за генериране на еднократни пароли за вход.")}
          aText={t("Научете повече")}
          borderProp1="" borderProp2=""
        />
      </div>

    </div>
  );
}

export const LoginFooter: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div id="wrapper" className="w-full text-center text-gray-600 bg-gray-50 p-5">
      <div className="w-9/10 md:w-7/10 mx-auto">
        <p className="text-black sm:text-basic md:text-lg">{t("За всички въпроси нашите служители Ви очакват на:")}</p>
        <div className="text-xs sm:text-base md:text-lg p-2 grid grid-cols-1 justify-items-center justify-center xl:flex">
          <ContactInfo icon={<FaPhone />} text={t("Телефон")} spanText="0700 12 777" moreText={t(" (денонощно)*")} />
          <ContactInfo icon={<FaEnvelope />} text={t("E-mail")} spanText="e-bank@fibank.bg" />
          <ContactInfo icon={<BiSolidConversation />} text={t("Чат")} spanText={t("Пишете ни")} isLink={true} />
        </div>
        <p className="text-xs">{t("*Разговорите към национален номер 0700 12 777 се таксуват според определените от Вашия оператор цени за обаждане към номера тип 0700 на Vivacom. За абонати на Vivacom обаждане към този номер се таксува като обаждане към стационарен номер в мрежата на Vivacom.")}</p>
        <p className="text-black text-lg p-2 pt-3">{t("Вижте къде се намираме:")}</p>
        <div className="flex items-center justify-center">
          <FooterLink displayProps="text-gray-600 pr-1 border-r-1 border-gray-400 hover:text-blue-800 hover:underline"
            icon={<FaUniversity />} text={t("Клонове")} />
          <FooterLink displayProps="text-gray-600 pl-1 hover:text-blue-800 hover:underline"
            icon={<GrAtm />} text={t("Банкомати")} />
        </div>
      </div>
    </div>
  );
}