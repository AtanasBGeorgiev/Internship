import Decimal from "decimal.js";
import { getCurrencies } from "../services/authService";
import { showGlobalError } from "../utils/errorHandler";

export async function getExchangeRates(): Promise<Record<string, number>> {
    try {
        const response = await getCurrencies();
        return response.data;
    } catch (error) {
        showGlobalError("Failed to fetch exchange rates");
        console.log('Failed to fetch exchange rates');
        return {};
    }
}

export function formatNumberWithSpaces(numStr: string) {
    const parts = numStr.split('.');
    //sets space per three symbols.Begins from right to left
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
}

type NetCardAvaiabilityProps<T> = {
    collection: T[];
    balanceKey: keyof T;
    liabilitiesKey: keyof T;
    currencyKey: keyof T;
    returnType: "string" | "decimal";
};

export async function CalculateNetCardAvaiability<T>({ collection, balanceKey, liabilitiesKey, currencyKey, returnType }: NetCardAvaiabilityProps<T>) {
    if (collection) {
        let netCardsAvaiability = new Decimal(0);
        const exchangeRates = await getExchangeRates();

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            const balance = new Decimal(item[balanceKey] as string);
            const liabilities = new Decimal(item[liabilitiesKey] as string);
            const currency = item[currencyKey] as string;

            const amount = balance.minus(liabilities);

            if (currency === "BGN") {
                netCardsAvaiability = netCardsAvaiability.plus(amount);
            }
            else if (exchangeRates[currency]) {
                netCardsAvaiability = netCardsAvaiability.plus(amount.div(new Decimal(exchangeRates[currency])));
            }
        }

        if (returnType === "string") {
            return formatNumberWithSpaces(netCardsAvaiability.toDecimalPlaces(2).toString());
        }
        else {
            return netCardsAvaiability.toDecimalPlaces(2);
        }
    }
}

type CurrentBalanceProps<T> = {
    collection: T[];
    currentBalanceKey: keyof T;
    currencyKey: keyof T;
    returnType: "string" | "decimal";
};

export async function CalculateCurrentBalance<T>({ collection, currentBalanceKey, currencyKey, returnType }: CurrentBalanceProps<T>) {
    if (collection) {
        let totalAmount = new Decimal(0);
        const exchangeRates = await getExchangeRates();

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            const balance = new Decimal(item[currentBalanceKey] as string);
            const currency = item[currencyKey] as string;

            if (currency === "BGN") {
                totalAmount = totalAmount.plus(balance);
            }
            else if (exchangeRates[currency]) {
                totalAmount = totalAmount.plus(balance.div(new Decimal(exchangeRates[currency])));
            }
        }

        if (returnType === "string") {
            return formatNumberWithSpaces(totalAmount.toDecimalPlaces(2).toString());
        }
        else {
            return totalAmount.toDecimalPlaces(2);
        }
    }
}

type TotalNetFundsProps<T> = {
    collection: T[];
    feesDueKey: keyof T;
    currencyKey: keyof T;
    netCardAvaiability: Decimal;
    currentBalance: Decimal;
    returnType: "string" | "decimal";
};

export async function CalculateTotalNetFunds<T>({ collection, feesDueKey, currencyKey, netCardAvaiability, currentBalance, returnType }: TotalNetFundsProps<T>) {
    if (collection) {
        let totalNetFunds = new Decimal(0);
        totalNetFunds = netCardAvaiability.plus(currentBalance);
        const exchangeRates = await getExchangeRates();
        
        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            const currency = item[currencyKey] as string;
            const feesDue = new Decimal(item[feesDueKey] as string);

            if (currency === "BGN") {
                totalNetFunds = totalNetFunds.minus(feesDue);
            }
            else if (exchangeRates[currency]) {
                totalNetFunds = totalNetFunds.minus(feesDue.div(new Decimal(exchangeRates[currency])));
            }
        }

        if (returnType === "string") {
            return formatNumberWithSpaces(totalNetFunds.toDecimalPlaces(2).toString());
        }
        else {
            return totalNetFunds.toDecimalPlaces(2);
        }
    }
}



