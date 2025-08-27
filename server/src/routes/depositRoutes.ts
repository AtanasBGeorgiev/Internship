import { NextFunction, Request, Response, Router } from 'express';
import Deposit from "../models/Deposit";

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deposit = new Deposit(req.body);
        await deposit.save();
        res.status(201).json({ success: 'New deposit!', deposit });
    } catch (error) {
        next(error);
    }
});

export default router;