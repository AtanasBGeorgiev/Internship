import { NextFunction, Request, Response, Router } from 'express';
import Credit from "../models/Credit";

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const credit = new Credit(req.body);
        await credit.save();
        res.status(201).json({ success: 'New credit!', credit });
    } catch (error) {
        next(error);
    }
});

export default router;