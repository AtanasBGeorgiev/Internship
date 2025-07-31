import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { FormField, ButtonForm } from "./Components/InputForms";
import { Arrow, hideMessage, ShowMessage } from "./Components/Common";

type FormValues = {
  egn: string;
  passport: string;
  nameCyrillic: string;
  nameLatin: string;
  email: string;
  phone: string;
  address: string;
  username: string;
  password: string;
  confirmPassword: string;
};
export const RegisterForm: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/Register`, data);

      setMessage(t("Формата е изпратена успешно! Ще бъдете пренасочен към страницата за вход."));
      setMessageType("success");
      hideMessage(setMessage, setMessageType);

      setTimeout(() => {
        navigate('/Login');
      }, 6000);

      console.log('Server response:', response.data);
    }
    catch (error: any) {
      console.error('Registration error:', error);

      //if the error is from the server
      const errorKey = error.response?.data?.errorKey;
      setMessage(errorKey ? t(errorKey) : t("Възникна непредвидена грешка при регистрацията."));
      setMessageType("error");
      hideMessage(setMessage, setMessageType);
    }
  };

  const password = watch("password");

  const getPasswordStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Za-z]/.test(password) && /\d/.test(password)) score++;
    if (password.length >= 15) score++;
    if (password.length >= 20) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(password || "");

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return "bg-red-500";
      case 2: return "bg-yellow-400";
      case 3: return "bg-green-600";
      case 4: return "bg-green-600";
      default: return "bg-gray-300";
    }
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 1: return t("Паролата е твърде слаба.");
      case 2: return t("Паролата е средно сигурна.");
      case 3: return t("Паролата е с високо ниво на сигурност.");
      case 4: return t("Паролата е максимално сигурна.");
      default: return t("Сигурност на парола.");
    }
  };

  return (
    <div id="wrapper" className="min-h-screen flex items-center justify-center p-4">
      <div id="register-form" className="w-4/5 md:w-2/3 border-2 border-gray-300 rounded-sm lg:w-1/2 xl:w-4/10 2xl:w-1/3">
        <div className="p-3">
          <h2 className="text-base md:text-2xl">{t("Регистрация на нов потребител")}</h2>
          <p className="text-xs md:text-sm text-gray-700">
            {t("Тази регистрационна форма се попълва само ако нямате потребител и парола за Виртуален банков клон (e-fibank) на ПИБ. Ако вече имате потребител и парола, добавянето на достъп до ново физическо или юридическо лице става в банката. Ако сте забравили своя потребител и/или парола, заповядайте в банката, за да ги получите.")}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div id="personal-data" className="border-t-2 border-b-2 border-gray-300 p-5">
            <p className="text-sm text-gray-700 pb-3"><span className="text-red-500">*</span> {t("Задължителни полета")}</p>
            <div id="display-grid" className="grid grid-cols-2 gap-4 text-xs md:text-base">
              <FormField id="egn" label={t("ЕГН")} register={register("egn", {
                required: t("Невалидно ЕГН!"),
                pattern: { value: /^[0-9]{10}$/, message: t("Невалидно ЕГН!") }
              })} error={errors.egn} />
              <FormField id="passport" label={t("ЛНЧ или паспорт")} required={false}
                register={register("passport")} error={errors.passport}
                tooltipContent={
                  <>
                    <Arrow position="bottom" />
                    <p>{t("Попълва се само от чуждестранни граждани.")}</p>
                  </>
                }
              />
              {/* Cyrillic letters only.Allows spaces and dashes.*/}
              <FormField id="name-cyrillic" label={t("Име и фамилия на кирилица")}
                register={register("nameCyrillic", {
                  required: t("Моля, въведете име!"),
                  pattern: {
                    value: /^[А-Яа-я\s\-]+$/,
                    message: t("Използвай само символи на кирилица!"),
                  },
                })} error={errors.nameCyrillic} />
              <FormField id="name-latin" label={t("Име и фамилия на латиница")} register={register("nameLatin", {
                required: t("Въведеното име съдържа символи на кирилица!"),
                pattern: {
                  value: /^[A-Za-z\s\-]+$/,
                  message: t("Въведеното име съдържа символи на кирилица!"),
                },
              })} error={errors.nameLatin} />
              <FormField id="email" label={t("E-mail")} type="email"
                register={register("email", {
                  required: t("Невалиден имейл!"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("Невалиден имейл!"),
                  },
                })} error={errors.email} />
              <FormField id="phone" label={t("Телефон")} type="tel"
                register={register("phone", {
                  required: t("Моля, въведете телефон!"),
                  pattern: {
                    value: /^0[0-9]{9}$/,
                    message: t("Моля, въведете телефон!"),
                  },
                })} error={errors.phone} />
              <FormField id="address" label={t("Адрес")} register={register("address", {
                required: t("Моля, въведете адрес!"),
              })} error={errors.address} />
            </div>
          </div>

          <div id="user-data" className="p-5 grid grid-cols-2 gap-4 text-xs md:text-base">
            <FormField id="username" label={t("Потребителско име:")}
              register={register("username", {
                required: t("Символи на кирилица не са позволени!"),
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: t("Използвайте само латински букви, цифри, тире или долна черта."),
                }
              })} error={errors.username} />

            <FormField id="password" label={t("Парола за вход:")} type="password"
              register={register("password", {
                required: t("Паролата е твърде къса."),
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,24}$/,
                  message: t("Прочети изискванията."),
                }
              })}
              error={errors.password}
              tooltipContent={
                <>
                  <Arrow position="bottom" />

                  <div>
                    <strong className="block mb-1">{t("Изисквания за парола:")}</strong>
                    <ul className="list-none space-y-1">
                      <li>► {t("Да е с дължина от 6 до 24 знака.")}</li>
                      <li>► {t("Да съдържа поне една буква.")}</li>
                      <li>► {t("Да съдържа поне една цифра.")}</li>
                      <li>► {t("Да е на латиница.")}</li>
                    </ul>
                  </div>
                </>
              }
            />
            <div className="col-span-2 grid grid-cols-2 gap-4">
              <div></div>
              <div>
                <div className="h-2 rounded bg-gray-200 mt-1 overflow-hidden">
                  <div
                    className={`h-2 transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs md:text-sm mt-1">{getStrengthLabel()}</p>
              </div>
            </div>
            <FormField id="confirm-password" label={t("Повторете паролата:")} type="password"
              register={register("confirmPassword", {
                required: t("Моля, повторете паролата."),
                validate: (value) =>
                  value === password || t("Паролите не съвпадат."),
              })}
              error={errors.confirmPassword} />
          </div>
          <div id="submit-button" className="border-t-2 border-gray-300 pt-3 pb-3 pl-5 pr-5 text-center">
            <p className="text-left text-sm text-gray-700">
              {t("Необходимо е да запомните потребителското си име и парола, които току-що въведохте. След като потвърдите регистрацията в банката, те ще Ви служат за вход във Виртуален банков клон (e-fibank).")}
            </p>
            <ShowMessage message={message} messageType={messageType} />
            <ButtonForm text={t("ИЗПРАТЕТЕ ИСКАНЕ ЗА РЕГИСТРАЦИЯ")} />
          </div>
        </form>
      </div>
    </div>
  );
}
