import { FormField, ButtonForm } from "./Components";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { hideMessag, ShowMessage } from "./Components";
import { useNavigate } from 'react-router-dom';


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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/Register`, data);

      setMessage("Формата е изпратена успешно! Ще бъдете пренасочен към страницата за вход.");
      setMessageType("success");
      hideMessag(setMessage, setMessageType);

      setTimeout(() => {
        navigate('/Login');
      }, 6000);

      console.log('Server response:', response.data);
    }
    catch (error: any) {
      console.error('Грешка при регистрация:', error);
            
      //if the error is from the server
      const serverMessage = error.response.data?.error;
      setMessage(serverMessage || "Възникна непредвидена грешка при регистрацията.");
      setMessageType("error");
      hideMessag(setMessage, setMessageType);
    }
  };

  const password = watch("password");

  const getPasswordStrength = (password: string): number => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 11) score++;
    if (/[A-Za-z]/.test(password) && /\d/.test(password) && password.length >= 15) score++;
    if (password.length >= 22) score++;
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
      case 1: return "Паролата е твърде слаба.";
      case 2: return "Паролата е средно сигурна.";
      case 3: return "Паролата е с високо ниво на сигурност.";
      case 4: return "Паролата е максимално сигурна.";
      default: return "Сигурност на парола.";
    }
  };

  return (
    <div id="wrapper" className="min-h-screen flex items-center justify-center p-4">
      <div id="register-form" className="w-2/3 border-2 border-gray-300 rounded-sm lg:w-1/2 xl:w-4/10 2xl:w-1/3">
        <div className="p-3">
          <h2 className="text-2xl">Регистрация на нов потребител</h2>
          <p className="text-sm text-gray-700">
            Тази регистрационна форма се попълва само ако нямате потребител и парола за Виртуален банков клон (e-fibank) на ПИБ. Ако вече имате потребител и парола, добавянето на достъп до ново физическо или юридическо лице става в банката.
            Ако сте забравили своя потребител и/или парола, заповядайте в банката, за да ги получите.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div id="personal-data" className="border-t-2 border-b-2 border-gray-300 p-5">
            <p className="text-sm text-gray-700 pb-3"><span className="text-red-500">*</span> Задължителни полета</p>
            <div id="display-grid" className="grid grid-cols-2 gap-4 text-basic">
              <FormField id="egn" label="ЕГН" register={register("egn", {
                required: "Невалидно ЕГН!",
                pattern: { value: /^[0-9]{10}$/, message: "Невалидно ЕГН!" }
              })} error={errors.egn} />
              <FormField id="passport" label="ЛНЧ или паспорт" required={false}
                register={register("passport")} error={errors.passport}
                tooltipContent={
                  <p>Попълва се само от чуждестранни граждани.</p>
                }
              />
              {/* Cyrillic letters only.Allows spaces and dashes.*/}
              <FormField id="name-cyrillic" label="Име и фамилия на кирилица"
                register={register("nameCyrillic", {
                  required: "Моля, въведете име!", pattern: {
                    value: /^[А-Яа-я\s\-]+$/,
                    message: "Използвай само символи на кирилица!",
                  },
                })} error={errors.nameCyrillic} />
              <FormField id="name-latin" label="Име и фамилия на латиница"
                register={register("nameLatin", {
                  required: "Въведеното име съдържа символи на кирилица!",
                  pattern: { value: /^[A-Za-z\s\-]+$/, message: "Въведеното име съдържа символи на кирилица!" }
                })} error={errors.nameLatin} />
              <FormField id="email" label="E-mail" type="email"
                register={register("email", {
                  required: "Невалиден имейл!",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Невалиден имейл!" }
                })} error={errors.email} />
              <FormField id="phone" label="Телефон" type="tel"
                register={register("phone", {
                  required: "Моля, въведете телефон!",
                  pattern: { value: /^0[0-9]{9}$/, message: "Моля, въведете телефон!" }
                })} error={errors.phone} />
              <FormField id="address" label="Адрес"
                register={register("address", { required: "Моля, въведете адрес!" })} error={errors.address} />
            </div>
          </div>

          <div id="user-data" className="p-5 grid grid-cols-2 gap-4">
            <FormField id="username" label="Потребителско име:"
              register={register("username", {
                required: "Символи на кирилица не са позволени!",
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: "Използвайте само латински букви, цифри, тире или долна черта."

                }
              })} error={errors.username} />

            <FormField id="password" label="Парола за вход:" type="password"
              register={register("password", {
                required: "Паролата е твърде къса.",
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,24}$/,
                  message: "Прочети изискванията.",
                }
              })}
              error={errors.password}
              tooltipContent={
                <div>
                  <strong className="block mb-1">Изисквания за парола:</strong>
                  <ul className="list-none space-y-1">
                    <li>► Да е с дължина от 6 до 24 знака.</li>
                    <li>► Да съдържа поне една буква.</li>
                    <li>► Да съдържа поне една цифра.</li>
                    <li>► Да е на латиница.</li>
                  </ul>
                </div>
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
                <p className="text-sm mt-1">{getStrengthLabel()}</p>
              </div>
            </div>
            <FormField id="confirm-password" label="Повторете паролата:" type="password"
              register={register("confirmPassword", {
                required: "Моля, повторете паролата.",
                validate: (value) =>
                  value === password || "Паролите не съвпадат.",
              })}
              error={errors.confirmPassword} />
          </div>
          <div id="submit-button" className="border-t-2 border-gray-300 pt-3 pb-3 pl-5 pr-5 text-center">
            <p className="text-left text-sm text-gray-700">Необходимо е да запомните потребителското си име и парола, които току-що въведохте. След като потвърдите регистрацията в банката, те ще Ви служат за вход във Виртуален банков клон (e-fibank).</p>
            <ShowMessage message={message} messageType={messageType} />
            <ButtonForm text="ИЗПРАТЕТЕ ИСКАНЕ ЗА РЕГИСТРАЦИЯ" />
          </div>
        </form>
      </div>
    </div>
  );
}