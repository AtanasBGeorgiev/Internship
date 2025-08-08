import Account from "../models/Account";
import Card from "../models/Card";
import Payment from "../models/Payment";
import verifyToken from "../middleware/verifyToken";
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

//verifyToken is a middleware function which is executed before the route- the defense of the route
//req and res are handler functions which are executed after the middleware function
router.get('/Dashboard', verifyToken, async (req: Request, res: Response, next: NextFunction) => {
  try {

    const user = (req as any).user;

    const accounts = await Account.find({ userId: user.userId }).select('-__v').lean();

    const cleanedAccounts = accounts.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest
    }));

    // Fetch cards for the authenticated user, excluding __v
    const cards = await Card.find({ userId: user.userId }).select('-__v').lean();

    const cleanedCards = cards.map(({ _id, repaymentDate, ...rest }) => ({
      id: _id.toString(),
      repaymentDate: repaymentDate ? repaymentDate.toISOString().split('T')[0].replace(/-/g, '/') : "",
      ...rest
    }));

    //.lean() - transform the json response into js object
    const payments = await Payment.find({ userId: user.userId }).select('-__v').lean();

    //works only with js objects
    const cleanedPayments = payments.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest
    }));

    return res.status(200).json({
      message: `Cards for ${user.username}`,
      userId: user.userId,
      accounts: cleanedAccounts,
      payments: cleanedPayments,
      cards: cleanedCards
    });
  }
  catch (error) {
    next(error);
  }
});

export default router;