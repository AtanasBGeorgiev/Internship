import { NextFunction, Request, Response, Router } from 'express';
import Account from "../models/Account";

const router = Router();

router.post('/account', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const account = new Account(req.body);
        await account.save();
        res.status(201).json({ success: 'New account!', account });
    } catch (error) {
        next(error);
    }
});

export default router;
