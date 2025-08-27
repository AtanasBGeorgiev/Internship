import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";
import { type Currency } from "./ModelTypes";
import { AdminRoleModule } from "./AdminRoleModule";
import { Table, TableData, SectionHead } from "./Tables";
import { useProtectedFetch } from "./ProtectedRequests";
import { ShowMessage, Loading } from "./Common";

export const Currencies: React.FC = () => {
    const { t } = useTranslation();

    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [showMidule, setShowMidule] = useState<boolean>(false);

    const { data: currenciesData, error: currenciesError, isLoading } = useProtectedFetch<Currency[]>
        ('/api/currency/getAllCurencies');

    useEffect(() => {
        if (currenciesError) {
            setMessage(currenciesError);
            setMessageType("error");
        }

        if (currenciesData) {
            setCurrencies(currenciesData);
        }
    }, [currenciesData, currenciesError]);

    const ShowModule = () => {
        setShowMidule(true);
    };

    isLoading && <Loading />;

    return (
        <div id="wrapper" className="grid grid-cols-12 bg-gray-100 py-5 xl:p-5">
            <p>FDBGF</p>

            <ShowMessage message={message} messageType={messageType} />

            {showMidule && <AdminRoleModule onClose={() => setShowMidule(false)} />}

            <SectionHead title={t("ПОТРЕБИТЕЛИ")} onClick={ShowModule} />
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
        </div>
    );
};