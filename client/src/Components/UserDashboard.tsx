import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FaPenNib, FaUserAlt } from "react-icons/fa";
import { IoMdList, IoIosListBox, IoMdPhonePortrait } from "react-icons/io";
import { FaCoins, FaHandHoldingDollar } from "react-icons/fa6";
import { SlEnvolopeLetter } from "react-icons/sl";
import { PiCoinsFill } from "react-icons/pi";
import { FaPlus, FaPencil } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { SiJsonwebtokens } from "react-icons/si";
import { BsSafeFill } from "react-icons/bs";
import { IoListCircleSharp } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";
import { FaRegNewspaper } from "react-icons/fa";
import { FaUnlockKeyhole } from "react-icons/fa6";
import { RiBankCardLine } from "react-icons/ri";
import { CiShoppingTag } from "react-icons/ci";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdMenuBook } from "react-icons/md";
import { AdminDashboard } from "./AdminDashboard";

import Decimal from "decimal.js";
import { CalculateNetCardAvaiability, CalculateCurrentBalance, CalculateTotalNetFunds } from "../Components/Calculations";
import type { Account, Payment, Card, Liability, Transaction, Credit, Deposit, Currency, TableNames } from '../Components/ModelTypes';
import { Table, TableData, ActionField, SectionHead, TableButton, ActionTooltip, TotalSum } from "../Components/Tables";
import { useSelectableList, TableCheckbox, GroupCheckbox } from "../Components/Checkboxes";
import { useProtectedFetch } from "../Components/ProtectedRequests";
import { TiInfoLargeOutline } from "react-icons/ti";
import { ShowMessage, LangSwitcher, Arrow, Loading } from "./Common";
import { NavbarLink, NavbarHelpContact, NavProfile, NavbarMenu } from "./Navbar";
import { renderIcon } from "../utils/iconMap";
import { logout } from "../utils/errorHandler";
import { SetModule, SetTransactionModule } from "./Module";
import { ModuleManaging } from "./ModuleManaging";
import { ProfileMenuBusiness } from "./ProfileMenuBusiness";
import { Tutorial } from "./Tutorial";
import { SidebarMenu } from "./Sidebar";
import { NotificationsMenu } from "./Notifications";
import { getNotifications, getUserData, fetchPreferredTables } from "../services/authService";

export const DashboardHeader: React.FC = () => {
    const { t } = useTranslation();

    const [moduleManaging, setModuleManaging] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [countNotif, setCountNotif] = useState<number>(0);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

    useEffect(() => {
        const fetchCountNotif = async () => {
            try {
                setIsLoadingNotifications(true);
                const userData = await getUserData();
                const data = await getNotifications(userData[0]);
                console.log("countUnread", data.countUnread);
                setCountNotif(data.countUnread);
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
                setCountNotif(0);
            } finally {
                setIsLoadingNotifications(false);
            }
        }
        fetchCountNotif();
    }, []);

    const handleLogout = () => {
        logout();
    };

    const onCloseModuleManaging = () => {
        setModuleManaging(false);
    };

    const onCloseTutorial = () => {
        setShowTutorial(false);
    };

    return (
        <>
            {moduleManaging && <ModuleManaging onClose={onCloseModuleManaging} />}
            {showTutorial && <Tutorial onClose={onCloseTutorial} />}

            <div className="h-20 border-b-2 border-gray-300 lg:h-15">
                <nav className="text-center h-20 px-2 lg:h-15">
                    <div className="h-full flex items-center justify-center space-x-2 xl:space-x-0 xl:justify-between relative">
                        <NavbarMenu text={t("МЕНЮ")} hideBreakpoint="xl" content={
                            <div className="w-1/5">
                                <SidebarMenu />
                            </div>
                        } />

                        <img src="icon-fibank-logo3.jpg" alt="logo" className="w-24 h-6 xl:w-40 xl:h-10 ml-5" />
                        <div className="flex items-center justify-between justify-center space-x-5">
                            <LangSwitcher english={"ENGLISH"} bulgarian={"БЪЛГАРСКИ"} />
                            <NavbarLink icons={["MdMessage"].map(icon => renderIcon(icon))} text={t("СЪОБЩЕНИЯ")}
                                displayIconProps="text-2xl" count={2} />
                            <NavbarLink icons={["IoNotificationsSharp"].map(icon => renderIcon(icon))} text={t("ИЗВЕСТИЯ")}
                                displayIconProps="text-2xl" count={isLoadingNotifications ? 0 : countNotif}
                                tooltipText={
                                    <div>
                                        <Arrow position="top" />
                                        <NotificationsMenu />
                                    </div>
                                }
                            />
                            <NavbarLink icons={["IoSettingsSharp"].map(icon => renderIcon(icon))} text={t("НАСТРОЙКИ")} width="min-w-70"
                                tooltipText={
                                    <div className="max-h-70 overflow-y-auto scrollbar-thin">
                                        <Arrow position="top" />
                                        <NavbarHelpContact text={t("Упътване")} icon={<MdMenuBook />} onClick={() => setShowTutorial(true)} />
                                        <NavbarHelpContact text={t("Лични данни")} icon={<FaUserAlt />} />
                                        <NavbarHelpContact text={t("Общи настройки")} icon={<FaPencil />} />
                                        <NavbarHelpContact text={t("Управление на модули")} icon={<FaPencil />} onClick={() => setModuleManaging(true)} />
                                        <NavbarHelpContact text={t("Настройки на сметка")} icon={<IoIosListBox />} />
                                        <NavbarHelpContact text={t("Настройки на депозит")} icon={<BsSafeFill />} />
                                        <NavbarHelpContact text={t("Настройки на карта")} icon={<RiBankCardLine />} />
                                        <NavbarHelpContact text={t("3D сигурност на карти")} icon={<RiBankCardLine />} />
                                        <NavbarHelpContact text={t("Промяна на парола")} icon={<FaLock />} />
                                        <NavbarHelpContact text={t("Регистриране на сертификат")} icon={<FaRegNewspaper />} />
                                        <NavbarHelpContact text={t("Регистрирани на КЕП")} icon={<FaPenNib />} />
                                        <hr></hr>
                                        <NavbarHelpContact text={t("Деблокиране на Token")} icon={<FaUnlockKeyhole />} />
                                        <NavbarHelpContact text={t("Промяна ПИН Token")} icon={<CiShoppingTag />} />
                                        <NavbarHelpContact text={t("E-mail и SMS известяване")} icon={<IoNotificationsSharp />} />
                                        <NavbarHelpContact text={t("SMS известяване за карти")} icon={<RiBankCardLine />} />
                                        <NavbarHelpContact text={t("Мобилно приложение Fibank")} icon={<IoMdPhonePortrait />} />
                                    </div>
                                } />
                            <NavProfile img="profile-picture.jpg" tooltip={
                                <ProfileMenuBusiness />
                            } />
                            <NavbarLink icons={["IoMdLogOut"].map(icon => renderIcon(icon))} text={t("ИЗХОД")}
                                onClick={() => handleLogout()} href={"/Login"} type="logout" displayIconProps="-rotate-90" />
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}

export function UserDashboard() {
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
    const [role, setRole] = useState<string>("");

    const [showModuleAccounts, setShowModuleAccounts] = useState(false);
    const [showModulePayments, setShowModulePayments] = useState(false);
    const [showModuleCards, setShowModuleCards] = useState(false);
    const [showModuleLiabilities, setShowModuleLiabilities] = useState(false);
    const [showModuleTransactions, setShowModuleTransactions] = useState(false);
    const [showModuleCredits, setShowModuleCredits] = useState(false);
    const [showModuleDeposits, setShowModuleDeposits] = useState(false);
    const [showModuleCurrencies, setShowModuleCurrencies] = useState(false);
    const [showModuleAdmin, setShowModuleAdmin] = useState(false);

    const [loading, setLoading] = useState(false);
    const [netCardsAvaiability, setNetCardsAvaiability] = useState<string>("0");
    const [currentBalance, setCurrentBalance] = useState<string>("0");
    const [totalNetFunds, setTotalNetFunds] = useState<string>("0");
    const [tableNames, setTableNames] = useState<TableNames[]>([]);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchTableNames = async () => {
            setLoading(true);
            const userData = await getUserData();
            setRole(userData[1]);
            const data = await fetchPreferredTables(userData[0]);
            console.log("tableNames", data);
            setTableNames(data.tableNames.map(table => ({ name: table.name })));
            setLoading(false);
        }
        fetchTableNames();
    }, []);

    //account hook
    const [accounts, setAccounts] = useState<Account[]>([]);

    //transaction hook
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    //deposit hook
    const [deposits, setDeposits] = useState<Deposit[]>([]);

    //currency hook
    const [currencies, setCurrency] = useState<Currency[]>([]);

    //payment hooks
    const [payments, setPayment] = useState<Payment[]>([]);
    const {
        selectedItems: selectedPayments,
        allSelected: allSelectedPayments,
        toggleSelectAll: toggleSelectAllPayments,
        toggleItem: togglePayment
    } = useSelectableList(payments);

    //card hooks
    const [cards, setCards] = useState<Card[]>([]);
    const {
        selectedItems: selectedCards,
        allSelected: allSelectedCards,
        toggleSelectAll: toggleSelectAllCards,
        toggleItem: toggleCard
    } = useSelectableList(cards);

    //liability hooks
    const [liabilities, setLiabilities] = useState<Liability[]>([]);
    const {
        selectedItems: selectedLiabilities,
        allSelected: allSelectedLiabilities,
        toggleSelectAll: toggleSelectAllLiabilities,
        toggleItem: toggleLiability
    } = useSelectableList(liabilities);

    //credit hooks
    const [credits, setCredits] = useState<Credit[]>([]);
    const {
        selectedItems: selectedCredits,
        allSelected: allSelectedCredits,
        toggleSelectAll: toggleSelectAllCredits,
        toggleItem: toggleCredit
    } = useSelectableList(credits);

    interface UserDashboardData {
        accounts?: Account[];
        payments?: Payment[];
        cards?: Card[];
        liabilities?: Liability[];
        transactions?: Transaction[];
        credits?: Credit[];
        deposits?: Deposit[];
                currencies?: Currency[];
    }

    const { data: userData, error: userError } = useProtectedFetch<UserDashboardData>(
        '/api/dashboard/UserDashboard',
        [i18n.language] // Re-fetch when language changes
    );
    useEffect(() => {        
        if (userError) {
            setMessage(userError);
            setMessageType("error");
        }

        if (userData) {
            setLoading(true);
            if (userData.accounts) setAccounts(userData.accounts);
            if (userData.payments) setPayment(userData.payments);
            if (userData.cards) setCards(userData.cards);
            if (userData.liabilities) setLiabilities(userData.liabilities);
            if (userData.transactions) setTransactions(userData.transactions);
            if (userData.credits) setCredits(userData.credits);
            if (userData.deposits) setDeposits(userData.deposits);
            if (userData.currencies) setCurrency(userData.currencies);
            setLoading(false);
        }
    }, [userData, userError]);

    // Calculate values when data changes
    useEffect(() => {
        const calculateValues = async () => {
            try {
                const netCards = await CalculateNetCardAvaiability({
                    collection: cards,
                    balanceKey: "balance",
                    liabilitiesKey: "liabilities",
                    currencyKey: "currency",
                    returnType: "string"
                });
                setNetCardsAvaiability(netCards as string);

                const current = await CalculateCurrentBalance({
                    collection: accounts,
                    currentBalanceKey: "currentBalance",
                    currencyKey: "currency",
                    returnType: "string"
                });
                setCurrentBalance(current as string);

                const total = await CalculateTotalNetFunds({
                    collection: accounts,
                    feesDueKey: "feesDue",
                    currencyKey: "currency",
                    netCardAvaiability: new Decimal((netCards as string)?.replace(/\s/g, "") || "0"),
                    currentBalance: new Decimal((current as string)?.replace(/\s/g, "") || "0"),
                    returnType: "string"
                });
                setTotalNetFunds(total as string);
            } catch (error) {
                console.error('Error calculating values:', error);
            }
        };

        if (cards.length > 0 || accounts.length > 0) {
            calculateValues();
        }
    }, [cards, accounts]);

    return (
        <>
            <ShowMessage message={message} messageType={messageType} />
            {loading && <Loading />}

            <div id="userBankData" className="p-5">
                <div className="flex text-center justify-center space-x-8 w-full xl:h-30">
                    <TotalSum text="Нетна разполагаема наличност по сметки и депозити:" totalAmount={`${totalNetFunds} BGN`} />
                    <TotalSum text="Общо текущо салдо по сметки и депозити:" totalAmount={`${currentBalance} BGN`} />
                    <TotalSum text="Обща нетна разполагаемост по картови сметки:" totalAmount={`${netCardsAvaiability} BGN`} />
                </div>

                {/*Modules */}
                {showModuleAccounts && <SetModule<Account> heading={t("Сметки")} tableHeads={[t("Сметка"), t("Валута")]} condition={t("до 3 сметки")}
                    countLimit={3} typeCollection="accounts" onClose={() => setShowModuleAccounts(false)} />}
                {showModulePayments && <SetModule<Payment> heading={t("Плащания")} tableHeads={[t("Плащание"), t("Валута")]} condition={t("до 3 плащания")}
                    countLimit={3} typeCollection="payments" onClose={() => setShowModulePayments(false)} />}
                {showModuleCards && <SetModule<Card> heading={t("Карти")} tableHeads={[t("Карта"), t("Валута")]} condition={t("до 3 карти")}
                    countLimit={3} typeCollection="cards" onClose={() => setShowModuleCards(false)} />}
                {showModuleLiabilities && <SetModule<Liability> heading={t("Задължения")} tableHeads={[t("Задължение")]} condition={t("до 4 задължения")}
                    countLimit={4} typeCollection="liabilities" onClose={() => setShowModuleLiabilities(false)} />}
                {showModuleTransactions && <SetTransactionModule heading={t("Последни 5 превода")} tableHeads={[t("Сметка/Депозит"), t("Валута")]} newCondition={t("Сметки и депозити, от които да се показвата преводи:")}
                    countLimit={3} typeCollection="transactions" onClose={() => setShowModuleTransactions(false)} />}
                {showModuleCredits && <SetModule<Credit> heading={t("Кредити")} tableHeads={[t("Кредит"), t("Валута")]} condition={t("до 3 кредита")}
                    countLimit={3} typeCollection="credits" onClose={() => setShowModuleCredits(false)} />}
                {showModuleDeposits && <SetModule<Deposit> heading={t("Депозити")} tableHeads={[t("Депозит"), t("Валута")]} condition={t("до 3 депозита")}
                    countLimit={3} typeCollection="deposits" onClose={() => setShowModuleDeposits(false)} />}
                {showModuleCurrencies && <SetModule<Currency> heading={t("Валутни курсове")} tableHeads={[t("Валута"), t("Код")]}
                    condition={t("до 3 валути")} countLimit={3} typeCollection="currencies" onClose={() => setShowModuleCurrencies(false)} />}

                {tableNames.map(table => {
                    if (table.name.includes("Сметки") || table.name.includes("Accounts")) {
                        {/*Bank accounts */ }
                        return (
                            <>
                                <SectionHead title={t("СМЕТКИ")} onClick={() => setShowModuleAccounts(true)} getPosition={true} />
                                <Table
                                    tableHead={
                                        <>
                                            <TableData type="th" text={t("Сметка")} alignment="left" />
                                            <TableData type="th" text={t("Валута")} />
                                            <TableData type="th" text={t("Разполагаемост")} />
                                            <TableData type="th" text={t("Начално салдо за деня")} />
                                            <TableData type="th" text={t("Текущо салдо")} />
                                            <TableData type="th" text={t("Дължими суми от такси")} />
                                            <TableData type="th" text={t("Действия")} />
                                        </>
                                    }
                                    items={accounts}
                                    tableData={(account) => (
                                        <>
                                            <TableData text={`${account.name}`} type="accountInfo"
                                                cardNum={`${account.accountNumber}`} alignment="left"
                                                display="text-blue-800 hover:cursor-pointer hover:underline"
                                                icon={<IoListCircleSharp className='text-blue-800 text-2xl xl:text-3xl' />} />
                                            <TableData text={`${account.currency}`} />
                                            <TableData amount={account.avaiability} alignment="right" />
                                            <TableData amount={account.openingBalance} alignment="right" />
                                            <TableData amount={account.currentBalance} alignment="right" />
                                            <TableData text={`${account.feesDue}`} display="text-blue-800 w-1/9" alignment='right' />
                                            <TableData type="actions" actions={
                                                <>
                                                    <ActionField icon={<PiCoinsFill />} tooltip={<ActionTooltip text={t("НОВ ПРЕВОД")} />} />
                                                    <ActionField icon={<IoMdList />} tooltip={<ActionTooltip text={t("СПРАВКИ")} />} />
                                                    <ActionField icon={<FaCoins />} tooltip={<ActionTooltip text={t("ПЛАЩАНИЯ")} />} />
                                                    <ActionField icon={<SlEnvolopeLetter />} tooltip={<ActionTooltip text={t("УСЛУГИ")} />} />
                                                </>
                                            } />
                                        </>
                                    )} />
                            </>
                        )
                    }
                    if (table.name.includes("За подпис") || table.name.includes("For signing")) {
                        {/*Payments */ }
                        return (
                            <>
                                <SectionHead title={t("ЗА ПОДПИС")} onClick={() => setShowModulePayments(true)} />
                                <Table tableHead={
                                    <>
                                        {/*\u2193 - unicode for down arrow */}
                                        <TableData type="th" text={t("Вид плашане \u2193")} alignment="left" checkbox={
                                            <GroupCheckbox condition={allSelectedPayments} onChange={toggleSelectAllPayments} />
                                        } />
                                        <TableData type="th" text={t("Платец")} alignment="left" />
                                        <TableData type="th" text={t("Получател")} alignment="left" />
                                        <TableData type="th" text={t("Сума и валута")} alignment="left" />
                                        <TableData type="th" text={t("Действия")} alignment="left" />
                                    </>
                                }
                                    items={payments}
                                    tableData={(payment) => (
                                        <>
                                            <TableData type="payment" paymentType={`${payment.paymentType}`} alignment="left"
                                                checkbox={
                                                    <TableCheckbox checkedCondition={selectedPayments.includes(payment.id)}
                                                        onChange={() => togglePayment(payment.id)} />
                                                } />
                                            <TableData type="transferParticipant" names={t(`${payment.remmiterName}`)}
                                                bankAccount={t(`${payment.remmiterBankAccount}`)} />
                                            <TableData type="transferParticipant" names={t(`${payment.beneficiaryName}`)}
                                                bankAccount={t(`${payment.beneficiaryBankAccount}`)} />
                                            <TableData type="transferAmount" amount={payment.amount} currency={payment.currency}
                                                alignment='right' />
                                            <TableData type="actions" actions={
                                                <>
                                                    <ActionField icon={<FaPlus />} tooltip={<ActionTooltip text={t("ПЛЮС")} />} />
                                                    <ActionField icon={<FaPencil />} tooltip={<ActionTooltip text={t("РЕДАКТИРАЙТЕ")} />} />
                                                    <ActionField icon={<RxCross2 />} tooltip={<ActionTooltip text={t("ОТКАЖЕТЕ")} />} />
                                                </>
                                            } />
                                        </>
                                    )} />

                                <div className="flex flex-row bg-gray-100 border-b-2 border-x-2 border-gray-300 p-2 pl-5">
                                    <TableButton icon={<FaPenNib />} display="bg-blue-800 text-white flex items-center" text={t("ПОДПИШЕТЕ")} />
                                    <TableButton icon={<SiJsonwebtokens />} display="bg-blue-800 text-white flex items-center" text={t("ТОКЕН")} />
                                    <TableButton icon={<RxCross2 />} display="bg-white flex items-center" text={t("ОТКАЖЕТЕ")} />
                                </div>
                            </>
                        )
                    }
                    if (table.name.includes("Карти") || table.name.includes("Cards")) {
                        {/*Cards */ }
                        return (
                            <>
                                <SectionHead title={t("КАРТИ")} onClick={() => setShowModuleCards(true)} />
                                <Table
                                    tableHead={
                                        <>
                                            <TableData type="th" text={t("Карта")} alignment="left" checkbox={
                                                <GroupCheckbox condition={allSelectedCards} onChange={toggleSelectAllCards} />
                                            } />
                                            <TableData type="th" text={t("Валута")} />
                                            <TableData type="th" text={t("Наличност")} />
                                            <TableData type="th" text={t("Задължения")} />
                                            <TableData type="th" text={t("Мин.вноска")} />
                                            <TableData type="th" text={t("Погасете до")} />
                                            <TableData type="th" text={t("3D Сигурност")} />
                                        </>
                                    }
                                    items={cards}
                                    tableData={(card) => (
                                        <>
                                            <TableData text={`${card.type}`} type="cardImg" cardNum={`${card.cardNumber}`} alignment="left"
                                                checkbox={
                                                    <TableCheckbox checkedCondition={selectedCards.includes(card.id)}
                                                        onChange={() => toggleCard(card.id)} />
                                                } />
                                            <TableData text={`${card.currency}`} />
                                            <TableData amount={card.balance} alignment="right" />
                                            <TableData amount={card.liabilities} display="text-red-500" alignment="right" />
                                            <TableData amount={card.minPayment} display="text-red-500" alignment="right" />
                                            <TableData text={`${card.repaymentDate}`} isDate={true} />
                                            <TableData type="security" isActive={`${card.ThreeDSecurity}`} alignment="left" />
                                        </>
                                    )} />
                                <div className=" border-b-2 border-x-2 border-gray-300 p-2 pl-5">
                                    <TableButton display="bg-red-600 text-white w-35" text={t("ПОГАСЕТЕ") + ` >`} />
                                </div>
                            </>
                        )
                    }
                    if (table.name.includes("Задължения") || table.name.includes("Liabilities")) {
                        {/*Liabilities */ }
                        return (
                            <>
                                <SectionHead title={t("ЗАДЪЛЖЕНИЯ ОЧАКВАЩИ ПЛАЩАНЕ")} onClick={() => setShowModuleLiabilities(true)} />
                                <Table
                                    tableHead={
                                        <>
                                            <TableData type="th" text={t("Наименование")} alignment="left" checkbox={
                                                <GroupCheckbox condition={allSelectedLiabilities} onChange={toggleSelectAllLiabilities} />
                                            } />
                                            <TableData type="th" text={t("Към дата")} />
                                            <TableData type="th" text={t("Автом. плащане")} />
                                            <TableData type="th" text={t("Сума")} />
                                            <TableData type="th" text={t("")} />
                                        </>
                                    }
                                    items={liabilities}
                                    tableData={(liability) => (
                                        <>
                                            <TableData text={`${liability.name}`} type="bill" iconType={liability.feeType} alignment="left"
                                                checkbox={
                                                    <TableCheckbox checkedCondition={selectedLiabilities.includes(liability.id)}
                                                        onChange={() => toggleLiability(liability.id)} />
                                                } />
                                            <TableData text={`${liability.Date}`} />
                                            <TableData isBoolean={`${liability.autoPay}`} />
                                            <TableData type="transferAmount" amount={liability.amount} currency={"BGN"}
                                                display="text-red-500" alignment='right' />
                                            <TableData type="actions" actions={
                                                <>
                                                    <ActionField icon={<TiInfoLargeOutline />} tooltip={<ActionTooltip text={t("ИНФО")} />} />
                                                </>
                                            } />
                                        </>
                                    )} />
                                <div className=" border-b-2 border-x-2 border-gray-300 p-2 pl-5">
                                    <TableButton display="bg-red-600 text-white w-35" text={t("ПЛАТЕТЕ") + ` >`} />
                                </div>
                            </>
                        )
                    }
                    if (table.name.includes("Последни 5 превода") || table.name.includes("Last 5 transfers")) {
                        {/*Transactions */ }
                        return (
                            <>
                                <SectionHead title={t("ПОСЛЕДНИ 5 ПРЕВОДА")} onClick={() => setShowModuleTransactions(true)} />
                                <Table
                                    tableHead={
                                        <>
                                            <TableData type="th" text={t("Тип")} />
                                            <TableData type="th" text={t("Дата \u2193")} />
                                            <TableData type="th" text={t("Документ и референция")} />
                                            <TableData type="th" text={t("Получател/наредител")} />
                                            <TableData type="th" text={t("Сметка")} />
                                            <TableData type="th" text={t("Сума и валута")} />
                                        </>
                                    }
                                    items={transactions}
                                    tableData={(transaction) => (
                                        <>
                                            <TableData typeTransaction={`${transaction.type}` as "income" | "expense"} />
                                            <TableData text={`${transaction.date}`} />
                                            <TableData type="transaction" reference={`${transaction.reference}`} document={`${transaction.document}`} alignment="left" />
                                            <TableData text={transaction.beneficiaryRemmiter} alignment="left" />
                                            <TableData text={transaction.account} alignment="left" />
                                            <TableData type="transferAmount" typeTransaction={`${transaction.type}` as "income" | "expense"}
                                                amount={`${transaction.amount}`} currency={transaction.currency}
                                                alignment="right" />
                                        </>
                                    )} />
                            </>
                        )
                    }
                    if (table.name.includes("Кредити") || table.name.includes("Loans")) {
                        {/*Credits */ }
                        return (
                            <>
                                <SectionHead title={t("КРЕДИТИ")} onClick={() => setShowModuleCredits(true)} />
                                <Table
                                    tableHead={
                                        <>
                                            <TableData type="th" text={t("Вид кредит")} alignment="left" checkbox={
                                                <GroupCheckbox condition={allSelectedCredits} onChange={toggleSelectAllCredits} />
                                            } />
                                            <TableData type="th" text={t("Валута")} />
                                            <TableData type="th" text={t("Лихвен %")} />
                                            <TableData type="th" text={t("Дължима вноска")} />
                                            <TableData type="th" text={t("Дата за вноска")} />
                                            <TableData type="th" text={t("Падеж")} />
                                        </>
                                    }
                                    items={credits}
                                    tableData={(credit) => (
                                        <>
                                            <TableData text={`${credit.name}`} type="accountInfo" icon={<FaHandHoldingDollar className="text-blue-800 text-3xl transform scale-x-[-1]" />}
                                                amount={`${credit.amount}`} alignment="left" checkbox={
                                                    <TableCheckbox checkedCondition={selectedCredits.includes(credit.id)}
                                                        onChange={() => toggleCredit(credit.id)} />
                                                } />
                                            <TableData text={`${credit.currency}`} />
                                            <TableData amount={credit.interestRate} showRate={true} />
                                            <TableData amount={credit.installmentDue} alignment="right" display="text-red-500" />
                                            <TableData text={`${credit.installmentDueDate}`} isDate={true} />
                                            <TableData text={`${credit.maturity}`} />
                                        </>
                                    )} />
                                <div className=" border-b-2 border-x-2 border-gray-300 p-2 pl-5">
                                    <TableButton display="bg-red-600 text-white w-35" text={t("ПЛАТЕТЕ") + ` >`} />
                                </div>
                            </>
                        )
                    }
                    if (table.name.includes("Депозити") || table.name.includes("Deposits")) {
                        {/*Deposits */ }
                        return (
                            <>
                                <SectionHead title={t("ДЕПОЗИТИ")} onClick={() => setShowModuleDeposits(true)} />
                                <Table
                                    tableHead={
                                        <>
                                            <TableData type="th" text={t("Депозит")} alignment="left" />
                                            <TableData type="th" text={t("Валута")} />
                                            <TableData type="th" text={t("Разполагаемост")} />
                                            <TableData type="th" text={t("Натрупана лихва")} />
                                            <TableData type="th" text={t("Падеж")} />
                                            <TableData type="th" text={t("Действия")} />
                                        </>
                                    }
                                    items={deposits}
                                    tableData={(deposit) => (
                                        <>
                                            <TableData text={`${deposit.name}`} type="accountInfo" icon={<BsSafeFill className="text-blue-800 text-3xl" />}
                                                cardNum={`${deposit.number}`} alignment="left" display="text-blue-800" />
                                            <TableData text={`${deposit.currency}`} />
                                            <TableData amount={deposit.availability} alignment="right" />
                                            <TableData amount={deposit.accruedInterest} alignment="right" />
                                            <TableData text={`${deposit.maturityDate}`} isDate={true} baseDays={365} isDeposit={true} />
                                            <TableData type="actions" actions={
                                                <>
                                                    <ActionField icon={<PiCoinsFill />} tooltip={<ActionTooltip text={t("НОВ ПРЕВОД")} />} />
                                                    <ActionField icon={<IoMdList />} tooltip={<ActionTooltip text={t("СПРАВКИ")} />} />
                                                    <ActionField icon={<FaCoins />} tooltip={<ActionTooltip text={t("ПЛАЩАНИЯ")} />} />
                                                    <ActionField icon={<SlEnvolopeLetter />} tooltip={<ActionTooltip text={t("УСЛУГИ")} />} />
                                                </>
                                            } />
                                        </>
                                    )} />
                            </>
                        )
                    }
                    if (table.name.includes("Валутни курсове") || table.name.includes("Exchange rates")) {
                        {/*Currencies */ }
                        return (
                            <>
                                <SectionHead title={t("Валутни курсове")} onClick={() => setShowModuleCurrencies(true)} />
                                <Table
                                    tableHead={
                                        <>
                                            <TableData type="th" text={t("Валута")} alignment="left" />
                                            <TableData type="th" text={t("Код")} />
                                            <TableData type="th" text={t("За единица валута")} />
                                            <TableData type="th" text={t("Лева (BGN)")} />
                                            <TableData type="th" text={t("Обратен курс: за един лев")} />
                                        </>
                                    }
                                    items={currencies}
                                    tableData={(currency) => (
                                        <>
                                            <TableData text={`${currency.name}`} type="currency" nationalFlag={`${currency.flagURL}`} alignment="left" display="py-1" />
                                            <TableData text={currency.currency} />
                                            <TableData text={String(currency.perUnit)} />
                                            <TableData text={String(currency.exchangeRate)} />
                                            <TableData text={String(currency.reverseRate)} />
                                        </>
                                    )} />
                            </>
                        )
                    }
                    if (role === "admin") {
                        return (
                            <>
                                <AdminDashboard showModule={showModuleAdmin} setShowModule={setShowModuleAdmin}
                                    tableNames={tableNames} ShowModule={() => setShowModuleAdmin(true)} />
                            </>
                        )
                    }
                })}
            </div >
        </>
    );
}