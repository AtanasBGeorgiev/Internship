import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Decimal from "decimal.js";

import { AdminDashboard } from "./AdminDashboard";
import { CalculateNetCardAvaiability, CalculateCurrentBalance, CalculateTotalNetFunds } from "../Components/Calculations";
import type { Account, Payment, Card, Liability, Transaction, Credit, Deposit, Currency, TableNames } from '../Components/ModelTypes';
import { TotalSum } from "../Components/Tables";
import { useSelectableList } from "../Components/Checkboxes";
import { useProtectedFetch } from "../Components/ProtectedRequests";
import { ShowMessage, Loading } from "./Common";
import { SetModule, SetTransactionModule } from "./Module";
import { getUserData, fetchPreferredTables } from "../services/authService";
import { BankAccountsTable, PaymentsTable, CardsTable, LiabilitiesTable, TransactionsTable, CreditsTable, DepositsTable, CurrenciesTable } from "./DashTables";

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
        const controller = new AbortController();

        const fetchTableNames = async () => {
            try {
                setLoading(true);
                const userData = await getUserData();
                setRole(userData[1]);
                const data = await fetchPreferredTables(userData[0], { signal: controller.signal });
                console.log("tableNames", data);
                setTableNames(data.tableNames.map(table => ({ name: table.name })));
                setLoading(false);
            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log("The fetch table names request was canceled.");
                    return;
                }
                console.error("Error fetching table names:", err);
                setLoading(false);
            }
        };

        fetchTableNames();

        return () => {
            controller.abort();
        }

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
                        return (
                            <BankAccountsTable accounts={accounts} setShowModuleAccounts={setShowModuleAccounts} />
                        );
                    }
                    if (table.name.includes("За подпис") || table.name.includes("For signing")) {
                        return (
                            <PaymentsTable payments={payments} setShowModulePayments={setShowModulePayments}
                                allSelectedPayments={allSelectedPayments} toggleSelectAllPayments={toggleSelectAllPayments}
                                togglePayment={togglePayment} selectedPayments={selectedPayments} />
                        );
                    }
                    if (table.name.includes("Карти") || table.name.includes("Cards")) {
                        return (
                            <CardsTable cards={cards} setShowModuleCards={setShowModuleCards}
                                allSelectedCards={allSelectedCards} toggleSelectAllCards={toggleSelectAllCards}
                                toggleCard={toggleCard} selectedCards={selectedCards} />
                        )
                    }
                    if (table.name.includes("Задължения") || table.name.includes("Liabilities")) {
                        return (
                            <LiabilitiesTable liabilities={liabilities} setShowModuleLiabilities={setShowModuleLiabilities}
                                allSelectedLiabilities={allSelectedLiabilities} toggleSelectAllLiabilities={toggleSelectAllLiabilities}
                                toggleLiability={toggleLiability} selectedLiabilities={selectedLiabilities} />
                        );
                    }
                    if (table.name.includes("Последни 5 превода") || table.name.includes("Last 5 transfers")) {
                        return (
                            <TransactionsTable transactions={transactions} setShowModuleTransactions={setShowModuleTransactions} />
                        );
                    }
                    if (table.name.includes("Кредити") || table.name.includes("Loans")) {
                        return (
                            <CreditsTable credits={credits} setShowModuleCredits={setShowModuleCredits}
                                allSelectedCredits={allSelectedCredits} toggleSelectAllCredits={toggleSelectAllCredits}
                                toggleCredit={toggleCredit} selectedCredits={selectedCredits} />
                        );
                    }
                    if (table.name.includes("Депозити") || table.name.includes("Deposits")) {
                        return (
                            <DepositsTable deposits={deposits} setShowModuleDeposits={setShowModuleDeposits} />
                        );
                    }
                    if (table.name.includes("Валутни курсове") || table.name.includes("Exchange rates")) {
                        return (
                            <CurrenciesTable currencies={currencies} setShowModuleCurrencies={setShowModuleCurrencies} />
                        );
                    }
                    if (role === "admin") {
                        return (
                            <AdminDashboard showModule={showModuleAdmin} setShowModule={setShowModuleAdmin}
                                tableNames={tableNames} ShowModule={() => setShowModuleAdmin(true)} />
                        );
                    }
                })}
            </div >
        </>
    );
}