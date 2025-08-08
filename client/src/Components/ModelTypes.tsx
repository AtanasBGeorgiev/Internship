export type Account = {
    id: string;
    type: string;
    accountNumber: string;
    currency: "BGN" | "EUR" | "USD";
    avaiability: string;
    openingBalance: string;
    currentBalance: string;
    feesDue: string;
};

export type Payment = {
    id: string;
    paymentType: "internal" | "credit" | "own";
    remmiterName: string;
    remmiterBankAccount: string;
    beneficiaryName: string;
    beneficiaryBankAccount: string;
    amount: string;
    currency: "BGN" | "EUR" | "USD";
};

export type Card = {
    id: string;
    cardNumber: number;
    type: string;
    currency: "BGN" | "EUR" | "USD";
    balance: string;
    liabilities: string;
    minPayment: string;
    repaymentDate: string;
    ThreeDSecurity: boolean;
};