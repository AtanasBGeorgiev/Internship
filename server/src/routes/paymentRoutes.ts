import { Request, Response, Router } from 'express';
import Payment from "../models/Payment";

const router = Router();

router.post('/payment', async (req: Request, res: Response) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json({ success: 'New payment!', payment });
    }
    catch (error) {
        console.error('Error saving payment:', error);
        res.status(500).json({ error: 'Could not save payment' });
    }
});

export default router;