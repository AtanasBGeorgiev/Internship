import { NextFunction, Request, Response, Router } from 'express';
import Transaction from "../models/Transaction";

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).json({ success: 'New transaction!', transaction });
    } catch (error) {
        next(error);
    }
});

export default router;