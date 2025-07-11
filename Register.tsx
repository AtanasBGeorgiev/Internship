import { FormField } from "./Components";
import {ButtonForm} from "./Components";

export const RegisterForm: React.FC = () => {
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
        <form>
          <div id="personal-data" className="border-t-2 border-b-2 border-gray-300 p-5">
            <p className="text-sm text-gray-700 pb-3"><span className="text-red-500">*</span> Задължителни полета</p>
            <div id="display-grid" className="grid grid-cols-2 gap-4 text-basic">
              <FormField id="egn" label="ЕГН"/>
              <FormField id="passport" label="ЛНЧ или паспорт" required={false}/>
              <FormField id="name-cyrillic" label="Име и фамилия на кирилица"/>
              <FormField id="name-latin" label="Име и фамилия на латиница"/>
              <FormField id="email" label="E-mail" type="email"/>
              <FormField id="phone" label="Телефон" type="tel"/>
              <FormField id="address" label="Адрес"/>
            </div>
          </div>
          <div id="user-data" className="p-5 grid grid-cols-2 gap-4">
            <FormField id="username" label="Потребителско име:"/>
            <FormField id="password" label="Парола за вход:" type="password"/>
            <FormField id="confirm-password" label="Повторете паролата:" type="password"/>
          </div>
          <div id="submit-button" className="border-t-2 border-gray-300 pt-3 pb-3 pl-5 pr-5 text-center">
            <p className="text-left text-sm text-gray-700">Необходимо е да запомните потребителското си име и парола, които току-що въведохте. След като потвърдите регистрацията в банката, те ще Ви служат за вход във Виртуален банков клон (e-fibank).</p>
            <ButtonForm text="ИЗПРАТЕТЕ ИСКАНЕ ЗА РЕГИСТРАЦИ"/>
          </div>
        </form>
      </div>
    </div>
  );
}