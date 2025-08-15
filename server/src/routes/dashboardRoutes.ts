import Account from "../models/Account";
import Card from "../models/Card";
import Liability from "../models/Liability";
import Payment from "../models/Payment";
import { NextFunction, Request, Response, Router } from 'express';
import Transaction from "../models/Transaction";
import Credit from "../models/Credit";
import Deposit from "../models/Deposit";
import PreferredAccount from "../models/Preferences/PreferredAccount";
import PreferredCard from "../models/Preferences/PreferredCard";
import PreferredPayment from "../models/Preferences/PreferredPayment";
import PreferredLiability from "../models/Preferences/PreferredLiability";
import PreferredCredit from "../models/Preferences/PreferredCredit";
import PreferredDeposit from "../models/Preferences/PreferredDeposit";
import Currency from "../models/Currency";
import PreferredCurrency from "../models/Preferences/PreferredCurrency";
import PreferredTransaction from "../models/Preferences/PreferredTransaction";
import mongoose from 'mongoose';


const router = Router();

//verifyToken is a middleware function which is executed before the route- the defense of the route
//req and res are handler functions which are executed after the middleware function
router.get('/UserDashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {

    const user = (req as any).user;

    //.lean() - transform the json response into js object
    const preferredAccountsIDS = await PreferredAccount.findOne({ userId: user.userId }).select('itemsID').lean();

    const accounts = await Account.find({ _id: { $in: preferredAccountsIDS?.itemsID } }).select('-__v').lean();

    //works only with js objects
    const cleanedAccounts = accounts.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest
    }));


    const preferredCardsIDS = await PreferredCard.findOne({ userId: user.userId }).select('itemsID').lean();

    const cards = await Card.find({ _id: { $in: preferredCardsIDS?.itemsID } }).select('-__v').lean();

    const cleanedCards = cards.map(({ _id, repaymentDate, ...rest }) => ({
      id: _id.toString(),
      repaymentDate: repaymentDate ? repaymentDate.toISOString().split('T')[0].replace(/-/g, '/') : "",
      ...rest
    }));


    const preferredPaymentsIDS = await PreferredPayment.findOne({ userId: user.userId }).select('itemsID').lean();

    const payments = await Payment.find({ _id: { $in: preferredPaymentsIDS?.itemsID } }).select('-__v').lean();

    const cleanedPayments = payments.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest
    }));


    const preferredLiabilitiesIDS = await PreferredLiability.findOne({ userId: user.userId }).select('itemsID').lean();

    const liabilities = await Liability.find({ _id: { $in: preferredLiabilitiesIDS?.itemsID } }).select('-__v').lean();

    const cleanedLiabilities = liabilities.map(({ _id, Date, ...rest }) => ({
      id: _id.toString(),
      Date: Date ? Date.toISOString().split('T')[0].replace(/-/g, '/') : "",
      ...rest
    }));

    const preferredTransactionsIDS = await PreferredTransaction.findOne({ userId: user.userId }).select('itemsID').lean();

    const transactions = await Transaction.find({
      $or: [{ accountID: { $in: preferredTransactionsIDS?.itemsID } },
      { depositID: { $in: preferredTransactionsIDS?.itemsID } }]
    }).select('-__v').lean();

    // Sort by date (newest first) and limit to 5
    const sortedTransactions = transactions
        .sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA; // newest first
        })
        .slice(0, 5);

    const cleanedTransactions = sortedTransactions.map(({ _id, date, ...rest }) => ({
      id: _id.toString(),
      date: date ? date.toISOString().split('T')[0].replace(/-/g, '/') : "",
      ...rest
    }));


    const preferredCreditsIDS = await PreferredCredit.findOne({ userId: user.userId }).select('itemsID').lean();

    const credits = await Credit.find({ _id: { $in: preferredCreditsIDS?.itemsID } }).select('-__v').lean();

    const cleanedCredits = credits.map(({ _id, installmentDueDate, maturity, ...rest }) => ({
      id: _id.toString(),
      installmentDueDate: installmentDueDate ? installmentDueDate.toISOString().split('T')[0].replace(/-/g, '/') : "",
      maturity: maturity ? maturity.toISOString().split('T')[0].replace(/-/g, '/') : "",
      ...rest
    }));


    const preferredDepositsIDS = await PreferredDeposit.findOne({ userId: user.userId }).select('itemsID').lean();

    const deposits = await Deposit.find({ _id: { $in: preferredDepositsIDS?.itemsID } }).select('-__v').lean();

    const cleanedDeposits = deposits.map(({ _id, maturityDate, ...rest }) => ({
      id: _id.toString(),
      maturityDate: maturityDate ? maturityDate.toISOString().split('T')[0].replace(/-/g, '/') : "",
      ...rest
    }));


    const preferredCurrenciesIDS = await PreferredCurrency.findOne({ userId: user.userId }).select('itemsID').lean();

    const currencies = await Currency.find({ _id: { $in: preferredCurrenciesIDS?.itemsID } }).select('-__v').lean();

    const cleanedCurrencies = currencies.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest
    }));

    return res.status(200).json({
      message: `Cards for ${user.username}`,
      userId: user.userId,
      accounts: cleanedAccounts,
      payments: cleanedPayments,
      cards: cleanedCards,
      liabilities: cleanedLiabilities,
      transactions: cleanedTransactions,
      credits: cleanedCredits,
      deposits: cleanedDeposits,
      currencies: cleanedCurrencies
    });
  }
  catch (error) {
    next(error);
  }
});

router.get('/Module/:modelType', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const { modelType } = req.params;

    // Special case for transactions - return both accounts and deposits
    if (modelType === 'transactions') {
      const accounts = await Account.find({ userId: user.userId }).select('-__v').lean();
      const deposits = await Deposit.find({ userId: user.userId }).select('-__v').lean();

      const cleanedAccounts = accounts.map(({ _id, ...rest }: any) => ({
        id: _id.toString(),
        ...rest
      }));

      const cleanedDeposits = deposits.map(({ _id, ...rest }: any) => ({
        id: _id.toString(),
        ...rest
      }));

      return res.status(200).json({
        message: `Accounts and deposits for ${user.username}`,
        accounts: cleanedAccounts,
        deposits: cleanedDeposits
      });
    }

    const modelMap: { [key: string]: any } = {
      'accounts': Account,
      'cards': Card,
      'payments': Payment,
      'liabilities': Liability,
      'transactions': Transaction,
      'credits': Credit,
      'deposits': Deposit,
      'currencies': Currency
    };

    const Model = modelMap[modelType];

    if (!Model) {
      return res.status(400).json({
        message: `Invalid model type: ${modelType}`,
        validTypes: Object.keys(modelMap)
      });
    }

    let items: any;
    if (Model === Currency) {
      items = await Currency.find().select('-__v').lean();
    }
    else {
      items = await Model.find({ userId: user.userId }).select('-__v').lean();
    }

    const cleanedItems = items.map(({ _id, ...rest }: any) => ({
      id: _id.toString(),
      ...rest
    }));

    return res.status(200).json({
      message: `${modelType} for ${user.username}`,
      items: cleanedItems
    });
  }
  catch (error) {
    next(error);
  }
});

router.get('/AdminDashboard', async (req: Request, res: Response, next: NextFunction) => {

});

export default router;