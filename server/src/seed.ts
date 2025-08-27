import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Account from './models/Account';
import Transaction from './models/Transaction';
import Card from './models/Card';
import Credit from './models/Credit';
import Deposit from './models/Deposit';
import Liability from './models/Liability';
import Payment from './models/Payment';
import Currency from './models/Currency';
import Notification from './models/Notification';
import BusinessClient from './models/BusinessClient';
import Table from './models/Table';
import SidebarMenu from './models/SidebarMenu';
import PreferredAccount from './models/Preferences/PreferredAccount';
import PreferredCard from './models/Preferences/PreferredCard';
import PreferredCredit from './models/Preferences/PreferredCredit';
import PreferredDeposit from './models/Preferences/PreferredDeposit';
import PreferredLiability from './models/Preferences/PreferredLiability';
import PreferredPayment from './models/Preferences/PreferredPayment';
import PreferredCurrency from './models/Preferences/PreferredCurrency';
import PreferredTable from './models/Preferences/PreferredTable';
import PreferredTransaction from './models/Preferences/PreferredTransaction';

dotenv.config();

// Import JSON data
const userData = require('./SeedFiles/Users.json');
const accountData = require('./SeedFiles/Accounts.json');
const transactionData = require('./SeedFiles/Transactions.json');
const cardData = require('./SeedFiles/Cards.json');
const creditData = require('./SeedFiles/Credits.json');
const depositData = require('./SeedFiles/Deposits.json');
const liabilityData = require('./SeedFiles/Liabilities.json');
const paymentData = require('./SeedFiles/Payments.json');
const currencyData = require('./SeedFiles/Currencies.json');
const notificationData = require('./SeedFiles/Notifications.json');
const businessClientData = require('./SeedFiles/BusinessClients.json');
const tableData = require('./SeedFiles/Tables.json');
const sidebarAdminData = require('./SeedFiles/SidebarAdmin.json');
const sidebarUserData = require('./SeedFiles/SidebarUser.json');
const preferredAccountData = require('./SeedFiles/Preferences/PreferredAccounts.json');
const preferredCardData = require('./SeedFiles/Preferences/PreferredCards.json');
const preferredCreditData = require('./SeedFiles/Preferences/PreferredCredits.json');
const preferredDepositData = require('./SeedFiles/Preferences/PreferredDeposits.json');
const preferredLiabilityData = require('./SeedFiles/Preferences/PreferredLiabilities.json');
const preferredPaymentData = require('./SeedFiles/Preferences/PreferredPayments.json');
const preferredCurrencyData = require('./SeedFiles/Preferences/PreferredCurrencies.json');
const preferredTableData = require('./SeedFiles/Preferences/PreferredTables.json');
const preferredTransactionData = require('./SeedFiles/Preferences/PreferredTransactions.json');

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('Connected to MongoDB');

        // Clear existing data (in reverse dependency order)
        console.log('Clearing existing data...');
        await PreferredTransaction.deleteMany({});
        await PreferredTable.deleteMany({});
        await PreferredCurrency.deleteMany({});
        await PreferredPayment.deleteMany({});
        await PreferredLiability.deleteMany({});
        await PreferredDeposit.deleteMany({});
        await PreferredCredit.deleteMany({});
        await PreferredCard.deleteMany({});
        await PreferredAccount.deleteMany({});
        await Transaction.deleteMany({});
        await Payment.deleteMany({});
        await Card.deleteMany({});
        await Credit.deleteMany({});
        await Deposit.deleteMany({});
        await Liability.deleteMany({});
        await Account.deleteMany({});
        await Notification.deleteMany({});
        await BusinessClient.deleteMany({});
        await Table.deleteMany({});
        await SidebarMenu.deleteMany({});
        await User.deleteMany({});
        console.log('All existing data cleared');

        // Step 1: Create Users (no dependencies)
        console.log('Creating users...');
        const createdUsers = await User.insertMany(userData);
        console.log(`${createdUsers.length} users created`);

        // Create a map of original _id to new ObjectId for foreign key references
        const userMap = new Map();
        const originalUserIds = [
            "6890bb5e0974857345641f61", // petar (index 0)
            "6890bb5e0974857345641f62", // ivan (index 1) 
            "6890bb5e0974857345641f63", // ivan2 (index 2)
            "6890bb5e0974857345641f64", // atanas (index 3)
            "6895c2626b58dfe73344c833"  // adminSasho (index 4)
        ];
        
        originalUserIds.forEach((originalId, index) => {
            userMap.set(originalId, createdUsers[index]._id);
        });

        // Step 2: Create Accounts (depends on Users)
        console.log('Creating accounts...');
        const accountsWithUserIds = accountData.map((account: any) => {
            // Map original userId to new ObjectId using the userMap
            const newUserId = userMap.get(account.userId);
            if (!newUserId) {
                throw new Error(`User not found for account: ${account.userId}`);
            }
            return {
                ...account,
                userId: newUserId
            };
        });
        const createdAccounts = await Account.insertMany(accountsWithUserIds);
        console.log(`${createdAccounts.length} accounts created`);

        // Create a map of original accountNumber to new ObjectId for foreign key references
        const accountMap = new Map();
        const originalAccountNumbers = [
            "915010BGNOVWVT",    // index 0
            "91501004592159",    // index 1
            "915010BGNOWQDF",    // index 2
            "915010GNORSTU",     // index 3
            "915010045924AB",    // index 4
            "91501004592444",    // index 5
            "915010GNORSTU",     // index 6 (duplicate)
            "915010045924AB",    // index 7 (duplicate)
            "91501004592444"     // index 8 (duplicate)
        ];
        
        originalAccountNumbers.forEach((accountNumber, index) => {
            accountMap.set(accountNumber, createdAccounts[index]._id);
        });

        // Step 3: Create Deposits (depends on Users)
        console.log('Creating deposits...');
        const depositsWithUserIds = depositData.map((deposit: any) => {
            const newUserId = userMap.get(deposit.userId);
            if (!newUserId) {
                throw new Error(`User not found for deposit: ${deposit.userId}`);
            }
            return {
                ...deposit,
                userId: newUserId
            };
        });
        const createdDeposits = await Deposit.insertMany(depositsWithUserIds);
        console.log(`${createdDeposits.length} deposits created`);

        // Create a map of original deposit number to new ObjectId for foreign key references
        const depositMap = new Map();
        const originalDepositNumbers = [
            "91502016356335",    // index 0
            "915010BGNOUCTZ",    // index 1
            "91501004592050",    // index 2
            "915010BGNOQRST",    // index 3
            "915010BGNOUCTZ",    // index 4 (duplicate)
            "91501004592050"     // index 5 (duplicate)
        ];
        
        originalDepositNumbers.forEach((depositNumber, index) => {
            depositMap.set(depositNumber, createdDeposits[index]._id);
        });

        // Step 4: Create Transactions (depends on Users, Accounts, and Deposits)
        console.log('Creating transactions...');
        const transactionsWithIds = transactionData.map((transaction: any) => { 
            // Map original userId to new ObjectId
            const newUserId = userMap.get(transaction.userId);
            if (!newUserId) {
                throw new Error(`User not found for transaction: ${transaction.userId}`);
            }

            let newAccountId = null;
            let newDepositId = null;

            // Handle accountID reference
            if (transaction.accountID) {
                // Map original accountID to new ObjectId
                // Note: accountID in transactions references specific account ObjectIds
                // We need to map these to the newly created account ObjectIds
                const originalAccountIds = [
                    "68ad76d540fb4b6dffe25b23", // maps to account index 0
                    "68ad76d540fb4b6dffe25b24", // maps to account index 1
                    "68ad76d540fb4b6dffe25b25", // maps to account index 2
                    "68ad76d540fb4b6dffe25b26", // maps to account index 3
                    "68ad76d540fb4b6dffe25b28", // maps to account index 4
                    "68ad76d540fb4b6dffe25b29"  // maps to account index 5
                ];
                
                const accountIndex = originalAccountIds.indexOf(transaction.accountID);
                if (accountIndex !== -1) {
                    newAccountId = createdAccounts[accountIndex]._id;
                } else {
                    throw new Error(`Account not found for transaction: ${transaction.accountID}`);
                }
            }

            // Handle depositID reference
            if (transaction.depositID) {
                // Map original depositID to new ObjectId
                const originalDepositIds = [
                    "689b3a0be4851b34c7b0e5e2", // maps to deposit index 0
                    "68ad72a2ec6b099998034193", // maps to deposit index 1
                    "68ad72a2ec6b099998034194", // maps to deposit index 2
                    "68ad72a2ec6b099998034195", // maps to deposit index 3
                    "68ad72a2ec6b099998034196", // maps to deposit index 4
                    "68ad72a2ec6b099998034197"  // maps to deposit index 5
                ];
                
                const depositIndex = originalDepositIds.indexOf(transaction.depositID);
                if (depositIndex !== -1) {
                    newDepositId = createdDeposits[depositIndex]._id;
                } else {
                    throw new Error(`Deposit not found for transaction: ${transaction.depositID}`);
                }
            }

            return {
                ...transaction,
                userId: newUserId,
                accountID: newAccountId,
                depositID: newDepositId
            };
        });
        const createdTransactions = await Transaction.insertMany(transactionsWithIds);
        console.log(`${createdTransactions.length} transactions created`);

        // Step 5: Create Currencies (no dependencies)
        console.log('Creating currencies...');
        const createdCurrencies = await Currency.insertMany(currencyData);
        console.log(`${createdCurrencies.length} currencies created`);

        // Step 6: Create other dependent models
        console.log('Creating other models...');
        
        // Cards (depends on Users)
        const cardsWithUserIds = cardData.map((card: any) => {
            const newUserId = userMap.get(card.userId);
            if (!newUserId) {
                throw new Error(`User not found for card: ${card.userId}`);
            }
            return {
                ...card,
                userId: newUserId
            };
        });
        const createdCards = await Card.insertMany(cardsWithUserIds);
        console.log(`${createdCards.length} cards created`);

        // Credits (depends on Users)
        const creditsWithUserIds = creditData.map((credit: any) => {
            const newUserId = userMap.get(credit.userId);
            if (!newUserId) {
                throw new Error(`User not found for credit: ${credit.userId}`);
            }
            return {
                ...credit,
                userId: newUserId
            };
        });
        const createdCredits = await Credit.insertMany(creditsWithUserIds);
        console.log(`${createdCredits.length} credits created`);

        // Liabilities (depends on Users)
        const liabilitiesWithUserIds = liabilityData.map((liability: any) => {
            const newUserId = userMap.get(liability.userId);
            if (!newUserId) {
                throw new Error(`User not found for liability: ${liability.userId}`);
            }
            return {
                ...liability,
                userId: newUserId
            };
        });
        const createdLiabilities = await Liability.insertMany(liabilitiesWithUserIds);
        console.log(`${createdLiabilities.length} liabilities created`);

        // Payments (depends on Users)
        const paymentsWithUserIds = paymentData.map((payment: any) => {
            const newUserId = userMap.get(payment.userId);
            if (!newUserId) {
                throw new Error(`User not found for payment: ${payment.userId}`);
            }
            return {
                ...payment,
                userId: newUserId
            };
        });
        const createdPayments = await Payment.insertMany(paymentsWithUserIds);
        console.log(`${createdPayments.length} payments created`);

        // Notifications (depends on Users)
            const notificationsWithUserIds = notificationData.map((notification: any) => {
            const newUserId = userMap.get(notification.userId);
            if (!newUserId) {
                throw new Error(`User not found for notification: ${notification.userId}`);
            }
            return {
                ...notification,
                userId: newUserId
            };
        });
        const createdNotifications = await Notification.insertMany(notificationsWithUserIds);
        console.log(`${createdNotifications.length} notifications created`);

        // BusinessClients (depends on Users)
        const businessClientsWithUserIds = businessClientData.map((client: any) => {
            const newUserId = userMap.get(client.userId);
            if (!newUserId) {
                throw new Error(`User not found for business client: ${client.userId}`);
            }
            return {
                ...client,
                userId: newUserId
            };
        });
        const createdBusinessClients = await BusinessClient.insertMany(businessClientsWithUserIds);
        console.log(`${createdBusinessClients.length} business clients created`);

        // Tables (no dependencies)
        const createdTables = await Table.insertMany(tableData);
        console.log(`${createdTables.length} tables created`);

        // Step 7: Create Sidebar Menus (no dependencies)
        console.log('Creating sidebar menus...');
        const createdSidebarMenus = await SidebarMenu.insertMany([
            sidebarAdminData,
            sidebarUserData
        ]);
        console.log(`${createdSidebarMenus.length} sidebar menus created`);

        // Step 8: Create Preferences (depends on Users and other models)
        console.log('Creating preferences...');
        
        // PreferredAccounts (depends on Users and Accounts)
        const preferredAccountsWithIds = preferredAccountData.map((pref: any) => {
            const newUserId = userMap.get(pref.userId);
            if (!newUserId) {
                throw new Error(`User not found for preferred account: ${pref.userId}`);
            }
            
            // Map original account IDs to new ObjectIds
            const newItemsID = pref.itemsID.map((accountId: string) => {
                const originalAccountIds = [
                    "68ad76d540fb4b6dffe25b23", // maps to account index 0
                    "68ad76d540fb4b6dffe25b24", // maps to account index 1
                    "68ad76d540fb4b6dffe25b25", // maps to account index 2
                    "68ad76d540fb4b6dffe25b26", // maps to account index 3
                    "68ad76d540fb4b6dffe25b28", // maps to account index 4
                    "68ad76d540fb4b6dffe25b29", // maps to account index 5
                    "68ad76d540fb4b6dffe25b2a", // maps to account index 6
                    "68ad76d540fb4b6dffe25b2b"  // maps to account index 7
                ];
                
                const accountIndex = originalAccountIds.indexOf(accountId);
                if (accountIndex !== -1) {
                    return createdAccounts[accountIndex]._id;
                } else {
                    throw new Error(`Account not found for preferred account: ${accountId}`);
                }
            });
            
            return {
                ...pref,
                userId: newUserId,
                itemsID: newItemsID
            };
        });
        const createdPreferredAccounts = await PreferredAccount.insertMany(preferredAccountsWithIds);
        console.log(`${createdPreferredAccounts.length} preferred accounts created`);

        // PreferredCards (depends on Users and Cards)
        const preferredCardsWithIds = preferredCardData.map((pref: any) => {
            const newUserId = userMap.get(pref.userId);
            if (!newUserId) {
                throw new Error(`User not found for preferred card: ${pref.userId}`);
            }
            
            // Map original card IDs to new ObjectIds
            const newItemsID = pref.itemsID.map((cardId: string) => {
                const originalCardIds = [
                    "6890bd145b417544b30bc669", // maps to card index 0
                    "68a6c48e537850e3667847a5"  // maps to card index 1
                ];
                
                const cardIndex = originalCardIds.indexOf(cardId);
                if (cardIndex !== -1) {
                    return createdCards[cardIndex]._id;
                } else {
                    throw new Error(`Card not found for preferred card: ${cardId}`);
                }
            });
            
            return {
                ...pref,
                userId: newUserId,
                itemsID: newItemsID
            };
        });
        const createdPreferredCards = await PreferredCard.insertMany(preferredCardsWithIds);
        console.log(`${createdPreferredCards.length} preferred cards created`);

        // PreferredCredits (depends on Users and Credits)
        const preferredCreditsWithIds = preferredCreditData.map((pref: any) => {
            const newUserId = userMap.get(pref.userId);
            if (!newUserId) {
                throw new Error(`User not found for preferred credit: ${pref.userId}`);
            }
            
            // Map original credit IDs to new ObjectIds
            const newItemsID = pref.itemsID.map((creditId: string) => {
                const originalCreditIds = [
                    "68ad74e101922705689076eb", // maps to credit index 0
                    "68ad74e101922705689076ec"  // maps to credit index 1
                ];
                
                const creditIndex = originalCreditIds.indexOf(creditId);
                if (creditIndex !== -1) {
                    return createdCredits[creditIndex]._id;
                } else {
                    throw new Error(`Credit not found for preferred credit: ${creditId}`);
                }
            });
            
            return {
                ...pref,
                userId: newUserId,
                itemsID: newItemsID
            };
        });
        const createdPreferredCredits = await PreferredCredit.insertMany(preferredCreditsWithIds);
        console.log(`${createdPreferredCredits.length} preferred credits created`);

        // PreferredDeposits (depends on Users and Deposits)
        const preferredDepositsWithIds = preferredDepositData.map((pref: any) => {
            const newUserId = userMap.get(pref.userId);
            if (!newUserId) {
                throw new Error(`User not found for preferred deposit: ${pref.userId}`);
            }
            
            // Map original deposit IDs to new ObjectIds
            const newItemsID = pref.itemsID.map((depositId: string) => {
                const originalDepositIds = [
                    "68ad72a2ec6b099998034193", // maps to deposit index 0
                    "68ad72a2ec6b099998034198", // maps to deposit index 1
                    "68ad72a2ec6b099998034197"  // maps to deposit index 2
                ];
                
                const depositIndex = originalDepositIds.indexOf(depositId);
                if (depositIndex !== -1) {
                    return createdDeposits[depositIndex]._id;
                } else {
                    throw new Error(`Deposit not found for preferred deposit: ${depositId}`);
                }
            });
            
            return {
                ...pref,
                userId: newUserId,
                itemsID: newItemsID
            };
        });
        const createdPreferredDeposits = await PreferredDeposit.insertMany(preferredDepositsWithIds);
        console.log(`${createdPreferredDeposits.length} preferred deposits created`);

        // PreferredLiabilities (depends on Users and Liabilities)
        const preferredLiabilitiesWithIds = preferredLiabilityData.map((pref: any) => {
            const newUserId = userMap.get(pref.userId);
            if (!newUserId) {
                throw new Error(`User not found for preferred liability: ${pref.userId}`);
            }
            
            // Map original liability IDs to new ObjectIds
            const newItemsID = pref.itemsID.map((liabilityId: string) => {
                const originalLiabilityIds = [
                    "68ad7bfbe4724fb395f2f009", // maps to liability index 0
                    "68ad7bfbe4724fb395f2f00c"  // maps to liability index 1
                ];
                
                const liabilityIndex = originalLiabilityIds.indexOf(liabilityId);
                if (liabilityIndex !== -1) {
                    return createdLiabilities[liabilityIndex]._id;
                } else {
                    throw new Error(`Liability not found for preferred liability: ${liabilityId}`);
                }
            });
            
            return {
                ...pref,
                userId: newUserId,
                itemsID: newItemsID
            };
        });
        const createdPreferredLiabilities = await PreferredLiability.insertMany(preferredLiabilitiesWithIds);
        console.log(`${createdPreferredLiabilities.length} preferred liabilities created`);

        // PreferredPayments (depends on Users and Payments)
        const preferredPaymentsWithIds = preferredPaymentData.map((pref: any) => {
            const newUserId = userMap.get(pref.userId);
            if (!newUserId) {
                throw new Error(`User not found for preferred payment: ${pref.userId}`);
            }
            
            // Map original payment IDs to new ObjectIds
            const newItemsID = pref.itemsID.map((paymentId: string) => {
                const originalPaymentIds = [
                    "68ad7e102904ecac58fa9d62", // maps to payment index 0
                    "68ad7e102904ecac58fa9d64"  // maps to payment index 1
                ];
                
                const paymentIndex = originalPaymentIds.indexOf(paymentId);
                if (paymentIndex !== -1) {
                    return createdPayments[paymentIndex]._id;
                } else {
                    throw new Error(`Payment not found for preferred payment: ${paymentId}`);
                }
            });
            
            return {
                ...pref,
                userId: newUserId,
                itemsID: newItemsID
            };
        });
        const createdPreferredPayments = await PreferredPayment.insertMany(preferredPaymentsWithIds);
        console.log(`${createdPreferredPayments.length} preferred payments created`);

        // PreferredCurrencies (depends on Users and Currencies)
        const preferredCurrenciesWithIds = preferredCurrencyData.map((pref: any) => {
            const newUserId = userMap.get(pref.userId);
            if (!newUserId) {
                throw new Error(`User not found for preferred currency: ${pref.userId}`);
            }
            
            // Map original currency IDs to new ObjectIds
            const newItemsID = pref.itemsID.map((currencyId: string) => {
                const originalCurrencyIds = [
                    "68ad6ef489a87a80d7e6d9f6", // maps to currency index 0
                    "68ad6e0f89a87a80d7e6d9ae", // maps to currency index 1
                    "68ad6e2e89a87a80d7e6d9b7", // maps to currency index 2
                    "68ad6eb989a87a80d7e6d9db"  // maps to currency index 3
                ];
                
                const currencyIndex = originalCurrencyIds.indexOf(currencyId);
                if (currencyIndex !== -1) {
                    return createdCurrencies[currencyIndex]._id;
                } else {
                    throw new Error(`Currency not found for preferred currency: ${currencyId}`);
                }
            });
            
            return {
                ...pref,
                userId: newUserId,
                itemsID: newItemsID
            };
        });
        const createdPreferredCurrencies = await PreferredCurrency.insertMany(preferredCurrenciesWithIds);
        console.log(`${createdPreferredCurrencies.length} preferred currencies created`);

        // PreferredTables (depends on Users and Tables)
        const preferredTablesWithIds = preferredTableData.map((pref: any) => {
            const newUserId = userMap.get(pref.userId);
            if (!newUserId) {
                throw new Error(`User not found for preferred table: ${pref.userId}`);
            }
            
            // Map original table IDs to new ObjectIds
            const newTables = pref.tables.map((tablePref: any) => {
                const originalTableIds = [
                    "68a7020ad44047a7664f29c2", // maps to table index 0
                    "68a7021dd44047a7664f29c4", // maps to table index 1
                    "68a70229d44047a7664f29c8", // maps to table index 2
                    "68a70224d44047a7664f29c6", // maps to table index 3
                    "68a7022fd44047a7664f29ca", // maps to table index 4
                    "68a70236d44047a7664f29cc", // maps to table index 5
                    "68a7023cd44047a7664f29ce", // maps to table index 6
                    "68a70242d44047a7664f29d0", // maps to table index 7
                    "68a70249d44047a7664f29d2"  // maps to table index 8
                ];
                
                const tableIndex = originalTableIds.indexOf(tablePref.tableId);
                if (tableIndex !== -1) {
                    return {
                        ...tablePref,
                        tableId: createdTables[tableIndex]._id
                    };
                } else {
                    throw new Error(`Table not found for preferred table: ${tablePref.tableId}`);
                }
            });
            
            return {
                ...pref,
                userId: newUserId,
                tables: newTables
            };
        });
        const createdPreferredTables = await PreferredTable.insertMany(preferredTablesWithIds);
        console.log(`${createdPreferredTables.length} preferred tables created`);

        // PreferredTransactions (depends on Users and Transactions)
        const preferredTransactionsWithIds = preferredTransactionData.map((pref: any) => {
            const newUserId = userMap.get(pref.userId);
            if (!newUserId) {
                throw new Error(`User not found for preferred transaction: ${pref.userId}`);
            }
            
            // Map original transaction IDs to new ObjectIds
            const newItemsID = pref.itemsID.map((transactionId: string) => {
                const originalTransactionIds = [
                    "68ad72a2ec6b099998034196", // maps to transaction index 0
                    "68ad76d540fb4b6dffe25b2a", // maps to transaction index 1
                    "68ad76d540fb4b6dffe25b2b", // maps to transaction index 2
                    "68ad72a2ec6b099998034197"  // maps to transaction index 3
                ];
                
                const transactionIndex = originalTransactionIds.indexOf(transactionId);
                if (transactionIndex !== -1) {
                    return createdTransactions[transactionIndex]._id;
                } else {
                    throw new Error(`Transaction not found for preferred transaction: ${transactionId}`);
                }
            });
            
            return {
                ...pref,
                userId: newUserId,
                itemsID: newItemsID
            };
        });
        const createdPreferredTransactions = await PreferredTransaction.insertMany(preferredTransactionsWithIds);
        console.log(`${createdPreferredTransactions.length} preferred transactions created`);

        console.log('Database seeded successfully!');
        console.log('\nSummary:');
        console.log(`- Users: ${createdUsers.length}`);
        console.log(`- Accounts: ${createdAccounts.length}`);
        console.log(`- Deposits: ${createdDeposits.length}`);
        console.log(`- Transactions: ${createdTransactions.length}`);
        console.log(`- Cards: ${createdCards.length}`);
        console.log(`- Credits: ${createdCredits.length}`);
        console.log(`- Liabilities: ${createdLiabilities.length}`);
        console.log(`- Payments: ${createdPayments.length}`);
        console.log(`- Currencies: ${createdCurrencies.length}`);
        console.log(`- Notifications: ${createdNotifications.length}`);
        console.log(`- Business Clients: ${createdBusinessClients.length}`);
        console.log(`- Tables: ${createdTables.length}`);
        console.log(`- Sidebar Menus: ${createdSidebarMenus.length}`);
        console.log(`- Preferred Accounts: ${createdPreferredAccounts.length}`);
        console.log(`- Preferred Cards: ${createdPreferredCards.length}`);
        console.log(`- Preferred Credits: ${createdPreferredCredits.length}`);
        console.log(`- Preferred Deposits: ${createdPreferredDeposits.length}`);
        console.log(`- Preferred Liabilities: ${createdPreferredLiabilities.length}`);
        console.log(`- Preferred Payments: ${createdPreferredPayments.length}`);
        console.log(`- Preferred Currencies: ${createdPreferredCurrencies.length}`);
        console.log(`- Preferred Tables: ${createdPreferredTables.length}`);
        console.log(`- Preferred Transactions: ${createdPreferredTransactions.length}`);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedDatabase();