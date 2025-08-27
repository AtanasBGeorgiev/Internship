import { NextFunction, Request, Response, Router } from 'express';
import Liability from "../models/Liability";

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const liability = new Liability(req.body);
        await liability.save();
        res.status(201).json({ success: 'New liability!', liability });
    } catch (error) {
        next(error);
    }
});

export default router;