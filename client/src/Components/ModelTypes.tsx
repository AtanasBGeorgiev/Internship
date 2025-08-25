export type Account = {
    id: string;
    type: string;
    accountNumber: string;
    currency: string;
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

export type Liability = {
    id: string;
    name: string;
    Date: string;
    autoPay: boolean;
    amount: string;
    feeType: string;
};

export type Transaction = {
    id: string;
    type: string;
    date: string;
    document: string;
    reference: string;
    beneficiaryRemmiter: string;
    account: string;
    amount: string;
    currency: string;
};

export type Credit = {
    id: string;
    type: string;
    name: string;
    amount: string;
    currency: string;
    interestRate: string;
    installmentDue: string;
    installmentDueDate: string;
    maturity: string;
};

export type Deposit = {
    id: string;
    name: string;
    number: string;
    currency: string;
    availability: string;
    accruedInterest: string;
    maturityDate: string;
};

export type Currency = {
    id: string;
    currency: string;
    perUnit: string;
    exchangeRate: string;
    reverseRate: string;
    name: string;
    flagURL: string;
};

export type PreferredAccount = {
    idUser: string;
    itemsID: string[];
};

export type BusinessClient = {
    id: string;
    name: string;
};

export type Notification = {
    id: string;
    userId: string;
    type: string;
    title: string;
    message: string;
    date: string;
    isRead: boolean;
    isDeleted: boolean;
}

export type NotificationResponse = {
    notifications: Notification[];
    countUnread: number;
};

export type User = {
    id: string,
    role: string,
    egn: string,
    passport: string,
    nameCyrillic: string,
    nameLatin: string,
    email: string,
    phone: string,
    address: string,
    username: string,
    password: string,
};

export type TableModel = {
    id: string;
    name: string;
    defaultOrder: number;
    order?: number;
    isRestricted: boolean;
    description: string;
};

export type TableNames = {
    name: string[];
};