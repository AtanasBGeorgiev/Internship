import { NextFunction, Request, Response, Router } from 'express';
import Card from "../models/Card";

const router = Router();

router.post('/card', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const card = new Card(req.body);
        await card.save();
        res.status(201).json({ success: 'New card!', card });
    } catch (error) {
        next(error);
    }
});

export default router;