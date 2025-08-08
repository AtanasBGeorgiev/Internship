import Decimal from "decimal.js";

export function formatNumberWithSpaces(numStr: string) {
    const parts = numStr.split('.');
    //sets space per three symbols.Begins from right to left
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
}

type NetCardAvaiabilityProps<T> = {
    collection: T[];
    exRateEUR: Decimal;
    exRateUSD: Decimal;
    balanceKey: keyof T;
    liabilitiesKey: keyof T;
    currencyKey: keyof T;
    returnType: "string" | "decimal";
};
export function CalculateNetCardAvaiability<T>({ collection, exRateEUR, exRateUSD, balanceKey, liabilitiesKey, currencyKey, returnType }: NetCardAvaiabilityProps<T>) {
    if (collection) {
        let netCardsAvaiability = new Decimal(0);
        netCardsAvaiability = new Decimal(0);

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            const balance = new Decimal(item[balanceKey] as string);
            const liabilities = new Decimal(item[liabilitiesKey] as string);
            const currency = item[currencyKey] as string;

            const amount = balance.minus(liabilities);

            if (currency === "BGN") {
                netCardsAvaiability = netCardsAvaiability.plus(amount);
            }
            else if (currency === "EUR") {
                netCardsAvaiability = netCardsAvaiability.plus(amount.div(exRateEUR));
            }
            else if (currency === "USD") {
                netCardsAvaiability = netCardsAvaiability.plus(amount.div(exRateUSD));
            }
        }

        if (returnType === "string") {
            return formatNumberWithSpaces(netCardsAvaiability.toDecimalPlaces(2).toString());
        }
        else {
            return netCardsAvaiability.toDecimalPlaces(2);
        }
    }
};

type CurrentBalanceProps<T> = {
    collection: T[];
    exRateEUR: Decimal;
    exRateUSD: Decimal;
    currentBalanceKey: keyof T;
    currencyKey: keyof T;
    returnType: "string" | "decimal";
};
export function CalculateCurrentBalance<T>({ collection, exRateEUR, exRateUSD, currentBalanceKey, currencyKey, returnType }: CurrentBalanceProps<T>) {
    if (collection) {
        let totalAmount = new Decimal(0);
        totalAmount = new Decimal(0);

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            const balance = new Decimal(item[currentBalanceKey] as string);
            const currency = item[currencyKey] as string;

            if (currency === "BGN") {
                totalAmount = totalAmount.plus(balance);
            }
            else if (currency === "EUR") {
                totalAmount = totalAmount.plus(balance.div(exRateEUR));
            }
            else if (currency === "USD") {
                totalAmount = totalAmount.plus(balance.div(exRateUSD));
            }
        }

        if (returnType === "string") {
            return formatNumberWithSpaces(totalAmount.toDecimalPlaces(2).toString());
        }
        else {
            return totalAmount.toDecimalPlaces(2);
        }
    }

};

type TotalNetFundsProps<T> = {
    collection: T[];
    exRateEUR: Decimal;
    exRateUSD: Decimal;
    feesDueKey: keyof T;
    currencyKey: keyof T;
    netCardAvaiability: Decimal;
    currentBalance: Decimal;
    returnType: "string" | "decimal";
};
export function CalculateTotalNetFunds<T>({ collection, exRateEUR, exRateUSD, feesDueKey, currencyKey, netCardAvaiability, currentBalance, returnType }: TotalNetFundsProps<T>) {
    if (collection) {
        let totalNetFunds = new Decimal(0);
        totalNetFunds = netCardAvaiability.plus(currentBalance);

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            const currency = item[currencyKey] as string;
            const feesDue = new Decimal(item[feesDueKey] as string);

            if (currency === "BGN") {
                totalNetFunds = totalNetFunds.minus(feesDue);
            }
            else if (currency === "EUR") {
                totalNetFunds = totalNetFunds.minus(feesDue.div(exRateEUR));
            }
            else if (currency === "USD") {
                totalNetFunds = totalNetFunds.minus(feesDue.div(exRateUSD));
            }

            if (returnType === "string") {
                return formatNumberWithSpaces(totalNetFunds.toDecimalPlaces(2).toString());
            }
            else {
                return totalNetFunds.toDecimalPlaces(2);
            }
        }
    }
};