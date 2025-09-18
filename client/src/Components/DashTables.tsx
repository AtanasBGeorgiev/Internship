import { useTranslation } from "react-i18next";

import type { Account, Card, Credit, Currency, Deposit, Liability, Payment, Transaction, User } from "./ModelTypes";
import { IoListCircleSharp } from "react-icons/io5";
import { PiCoinsFill } from "react-icons/pi";
import { IoMdList } from "react-icons/io";
import { FaCoins, FaPenNib, FaPlus } from "react-icons/fa";
import { FaHandHoldingDollar, FaPencil } from "react-icons/fa6";
import { SlEnvolopeLetter } from "react-icons/sl";
import { RxCross2 } from "react-icons/rx";
import { SiJsonwebtokens } from "react-icons/si";

import { ActionField, ActionTooltip, SectionHead, Table, TableButton, TableData } from "./Tables";
import { TableCheckbox, GroupCheckbox } from "./Checkboxes";
import { TiInfoLargeOutline } from "react-icons/ti";
import { BsSafeFill } from "react-icons/bs";

interface BankAccountsProps {
    accounts: Account[];
    setShowModuleAccounts: (showModuleAccounts: boolean) => void;
}
export const BankAccountsTable: React.FC<BankAccountsProps> = ({ accounts, setShowModuleAccounts }) => {
    const { t } = useTranslation();

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
};

interface PaymentsProps {
    payments: Payment[];
    setShowModulePayments: (showModulePayments: boolean) => void;
    allSelectedPayments: boolean;
    toggleSelectAllPayments: () => void;
    togglePayment: (id: string) => void;
    selectedPayments: string[];
}

export const PaymentsTable: React.FC<PaymentsProps> = ({ payments, setShowModulePayments, allSelectedPayments, toggleSelectAllPayments, togglePayment, selectedPayments }) => {
    const { t } = useTranslation();

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
};

interface CardsProps {
    cards: Card[];
    setShowModuleCards: (showModuleCards: boolean) => void;
    allSelectedCards: boolean;
    toggleSelectAllCards: () => void;
    toggleCard: (id: string) => void;
    selectedCards: string[];
}

export const CardsTable: React.FC<CardsProps> = ({ cards, setShowModuleCards, allSelectedCards, toggleSelectAllCards, toggleCard, selectedCards }) => {
    const { t } = useTranslation();

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
};

interface LiabilitiesProps {
    liabilities: Liability[];
    setShowModuleLiabilities: (showModuleLiabilities: boolean) => void;
    allSelectedLiabilities: boolean;
    toggleSelectAllLiabilities: () => void;
    toggleLiability: (id: string) => void;
    selectedLiabilities: string[];
}

export const LiabilitiesTable: React.FC<LiabilitiesProps> = ({ liabilities, setShowModuleLiabilities, allSelectedLiabilities, toggleSelectAllLiabilities, toggleLiability, selectedLiabilities }) => {
    const { t } = useTranslation();

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
};

interface TransactionsProps {
    transactions: Transaction[];
    setShowModuleTransactions: (showModuleTransactions: boolean) => void;
}

export const TransactionsTable: React.FC<TransactionsProps> = ({ transactions, setShowModuleTransactions }) => {
    const { t } = useTranslation();

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
};

interface CreditsProps {
    credits: Credit[];
    setShowModuleCredits: (showModuleCredits: boolean) => void;
    allSelectedCredits: boolean;
    toggleSelectAllCredits: () => void;
    toggleCredit: (id: string) => void;
    selectedCredits: string[];
}

export const CreditsTable: React.FC<CreditsProps> = ({ credits, setShowModuleCredits, allSelectedCredits, toggleSelectAllCredits, toggleCredit, selectedCredits }) => {
    const { t } = useTranslation();

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
};

interface DepositsProps {
    deposits: Deposit[];
    setShowModuleDeposits: (showModuleDeposits: boolean) => void;
}

export const DepositsTable: React.FC<DepositsProps> = ({ deposits, setShowModuleDeposits }) => {
    const { t } = useTranslation();

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
};

interface CurrenciesProps {
    currencies: Currency[];
    setShowModuleCurrencies: (showModuleCurrencies: boolean) => void;
}

export const CurrenciesTable: React.FC<CurrenciesProps> = ({ currencies, setShowModuleCurrencies }) => {
    const { t } = useTranslation();

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
};

interface UsersProps {
    users: User[];
    ShowModule: () => void;
}

export const UsersTable: React.FC<UsersProps> = ({ users, ShowModule }) => {
    const { t } = useTranslation();

    return (
        <>
            <SectionHead title={t("ПОТРЕБИТЕЛИ")} onClick={ShowModule} />
            <Table
                tableHead={
                    <>
                        <TableData type="th" text={t("Име на Кирилица")} />
                        <TableData type="th" text={t("Име на Латиница")} />
                        <TableData type="th" text={t("ЕГН")} />
                        <TableData type="th" text={t("Паспорт")} />
                        <TableData type="th" text={t("Телефон")} />
                        <TableData type="th" text={t("Имейл")} />
                        <TableData type="th" text={t("Адрес")} />
                        <TableData type="th" text={t("Роля")} />
                    </>
                }
                items={users}
                tableData={(user) => (
                    <>
                        <TableData text={`${user.nameCyrillic}`} display="p-2" />
                        <TableData text={`${user.nameLatin}`} />
                        <TableData text={`${user.egn}`} />
                        <TableData text={`${user?.passport}`} />
                        <TableData text={`${user.phone}`} />
                        <TableData text={`${user.email}`} />
                        <TableData text={`${user.address}`} />
                        <TableData text={`${user.role}`} />
                    </>
                )} />
        </>
    );
};