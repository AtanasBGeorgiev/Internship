import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FaPenNib } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoMdLogOut, IoMdList, } from "react-icons/io";

import { IoNotificationsSharp, IoSettingsSharp } from "react-icons/io5";
import { FaCoins } from "react-icons/fa6";
import { SlEnvolopeLetter } from "react-icons/sl";
import { PiCoinsFill } from "react-icons/pi";
import { FaPlus, FaPencil } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { SiJsonwebtokens } from "react-icons/si";

import Decimal from "decimal.js";
import { DashboardNavbarLink } from "./Components/HeaderAndFooter";
import { CalculateNetCardAvaiability, CalculateCurrentBalance, CalculateTotalNetFunds } from "./Components/Calculations";
import { LangSwitcher, ShowMessage } from "./Components/Common";
import type { Account, Payment, Card } from './Components/ModelTypes';
import { Table, TableData, ActionField, SectionHead, TableButton, ActionTooltip, TotalSum } from "./Components/Tables";
import { useSelectableList, GroupCheckbox } from "./Components/Checkboxes";
import { useProtectedFetch } from "./Components/ProtectedRequests";
import { SidebarMenu } from "./Components/Sidebar";


const handleLogout = () => {
    localStorage.removeItem('jwtToken');
};

const DashboardHeader: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="h-20 border-b-2 border-gray-300 lg:h-15">
            <nav className="text-center h-20 px-2 lg:h-15">
                <div className="h-full flex items-center justify-between relative">
                    <img src="icon-fibank-logo3.jpg" alt="logo" className="w-24 h-6 sm:w-40 sm:h-10 ml-5" />

                    <div className="flex items-center justify-between justify-center space-x-5">
                        <LangSwitcher english="ENGLISH" bulgarian="БЪЛГАРСКИ" />
                        <DashboardNavbarLink text={t("СЪОБЩЕНИЯ")} icons={[<MdMessage />]} hover="" />
                        <DashboardNavbarLink text={t("ИЗВЕСТИЯ")} icons={[<IoNotificationsSharp />]} hover="" />
                        <DashboardNavbarLink text={t("НАСТРОЙКИ")} icons={[<IoSettingsSharp />]} hover="" />
                        <DashboardNavbarLink text={t("ИЗХОД")} displayIconProps="-rotate-90" icons={[<IoMdLogOut />]} onClick={handleLogout} href="/Login" hover="" />
                    </div>
                </div>
            </nav>
        </div>
    );
}

export function Dashboard() {
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
    const { t } = useTranslation();

    //account hook
    const [accounts, setAccounts] = useState<Account[]>([]);

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

    //array with dependencies [navigate] - if navigate changes, the useEffect will run again
    //useEffect runs when the component is executed

    const { data, error } = useProtectedFetch<{
        accounts?: Account[];
        payments?: Payment[];
        cards?: Card[];
    }>('/api/dashboard/Dashboard');


    useEffect(() => {
        if (error) {
            setMessage(error);
            setMessageType("error");
        }

        if (data) {
            if (data.accounts) setAccounts(data.accounts);
            if (data.payments) setPayment(data.payments);
            if (data.cards) setCards(data.cards);
        }
    }, [data]);

    let netCardsAvaiability = CalculateNetCardAvaiability({
        collection: cards,
        exRateEUR: new Decimal(0.511292),
        exRateUSD: new Decimal(0.589365),
        balanceKey: "balance",
        liabilitiesKey: "liabilities",
        currencyKey: "currency",
        returnType: "string"
    }) as string;

    let currentBalance = CalculateCurrentBalance({
        collection: accounts,
        exRateEUR: new Decimal(0.511292),
        exRateUSD: new Decimal(0.589365),
        currentBalanceKey: "currentBalance",
        currencyKey: "currency",
        returnType: "string"
    }) as string;

    let totalNetFunds = CalculateTotalNetFunds({
        collection: accounts,
        exRateEUR: new Decimal(0.511292),
        exRateUSD: new Decimal(0.589365),
        feesDueKey: "feesDue",
        currencyKey: "currency",
        netCardAvaiability: new Decimal(netCardsAvaiability?.replace(/\s/g, "") || "0"),
        currentBalance: new Decimal(currentBalance?.replace(/\s/g, "") || "0"),
        returnType: "string"
    });

    return (
        <>
            <DashboardHeader />
            <div id="wrapper" className="grid grid-cols-12 bg-gray-100 p-5">
                <SidebarMenu />

                <div id="mainContent" className="col-span-10 bg-white border-r-2 border-gray-300">
                    <h1 className="text-lg text-gray-500 border-b-2 border-gray-300 p-2">{t("Начало")}</h1>
                    <ShowMessage message={message} messageType={messageType} />

                    <div id="userBankData" className="p-5">
                        <div className="flex text-center justify-center space-x-8 w-full h-30">
                            <TotalSum text="Нетна разполагаема наличност по сметки и депозити:" totalAmount={`${totalNetFunds} BGN`} />
                            <TotalSum text="Общо текущо салдо по сметки и депозити:" totalAmount={`${currentBalance} BGN`} />
                            <TotalSum text="Обща нетна разполагаемост по картови сметки:" totalAmount={`${netCardsAvaiability} BGN`} />
                        </div>

                        {/*Bank accounts */}
                        <SectionHead title={t("СМЕТКИ")} />
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
                                    <TableData text={`${account.type}`} type="accountInfo" accountType={account.type as "personal" | "unrestricted"}
                                        cardNum={`${account.accountNumber}`} alignment="left" />
                                    <TableData text={`${account.currency}`} />
                                    <TableData amount={account.avaiability} alignment="right" isDecimal={true} />
                                    <TableData amount={account.openingBalance} alignment="right" isDecimal={true} />
                                    <TableData amount={account.currentBalance} alignment="right" isDecimal={true} />
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


                        {/*Payments */}
                        <SectionHead title={t("ЗА ПОДПИС")}
                        />
                        <Table tableHead={
                            <>
                                {/*\u2193 - unicode for down arrow */}
                                <TableData type="th" text={t("Вид плашане \u2193")} alignment="left" checkbox={
                                    <GroupCheckbox allSelected={allSelectedPayments} type="parent" toggleSelectAll={toggleSelectAllPayments} />} />
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
                                            <GroupCheckbox isSelected={selectedPayments.includes(payment.id)}
                                                onToggle={() => togglePayment(payment.id)} />
                                        } />
                                    <TableData type="transferParticipant" names={t(`${payment.remmiterName}`)}
                                        bankAccount={t(`${payment.remmiterBankAccount}`)} />
                                    <TableData type="transferParticipant" names={t(`${payment.beneficiaryName}`)}
                                        bankAccount={t(`${payment.beneficiaryBankAccount}`)} />
                                    <TableData type="transferAmount" amount={payment.amount} currency={payment.currency}
                                        isDecimal={true} alignment='right' />
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
                            <TableButton icon={<FaPenNib />} display="bg-blue-800 text-white" text={t("ПОДПИШЕТЕ")} />
                            <TableButton icon={<SiJsonwebtokens />} display="bg-blue-800 text-white" text={t("ТОКЕН")} />
                            <TableButton icon={<RxCross2 />} display="bg-white" text={t("ОТКАЖЕТЕ")} />
                        </div>


                        {/*Cards */}
                        <SectionHead title={t("КАРТИ")} />
                        <Table
                            tableHead={
                                <>
                                    <TableData type="th" text={t("Карта")} alignment="left" checkbox={
                                        <GroupCheckbox allSelected={allSelectedCards} type="parent" toggleSelectAll={toggleSelectAllCards} />
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
                                            <GroupCheckbox isSelected={selectedCards.includes(card.id)}
                                                onToggle={() => toggleCard(card.id)} />
                                        } />
                                    <TableData text={`${card.currency}`} />
                                    <TableData amount={card.balance} alignment="right" isDecimal={true} />
                                    <TableData amount={card.liabilities} display="text-red-500" alignment="right" isDecimal={true} />
                                    <TableData amount={card.minPayment} display="text-red-500" alignment="right" isDecimal={true} />
                                    <TableData text={`${card.repaymentDate}`} />
                                    <TableData type="security" isActive={`${card.ThreeDSecurity}`} alignment="left" />
                                </>
                            )} />
                        <div className=" border-b-2 border-x-2 border-gray-300 p-2 pl-5">
                            <TableButton display="bg-red-600 text-white w-35" text={t("ПОГАСЕТЕ") + ` >`} />
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
};