import { NextFunction, Request, Response, Router } from 'express';
import PreferredAccount from '../models/Preferences/PreferredAccount';
import PreferredCard from '../models/Preferences/PreferredCard';
import PreferredLiability from '../models/Preferences/PreferredLiability';
import PreferredCredit from '../models/Preferences/PreferredCredit';
import PreferredDeposit from '../models/Preferences/PreferredDeposit';
import PreferredPayment from '../models/Preferences/PreferredPayment';
import PreferredCurrency from '../models/Preferences/PreferredCurrency';
import PreferredTransaction from '../models/Preferences/PreferredTransaction';

const router = Router();

router.post('/postPreferrence/:itemType', async (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /postPreference accepted!');
    try {
        const { itemType } = req.params;
        const userId = req.body.userId;
        const itemsID = req.body.itemsID;

        const modelMap: { [key: string]: any } = {
            'accounts': PreferredAccount,
            'payments': PreferredPayment,
            'cards': PreferredCard,
            'liabilities': PreferredLiability,
            'transactions': PreferredTransaction,
            'credits': PreferredCredit,
            'deposits': PreferredDeposit,
            'currencies': PreferredCurrency
        };

        const Model = modelMap[itemType];

        if (!Model) {
            return res.status(400).json({
                message: `Invalid model type: ${itemType}`,
                validTypes: Object.keys(modelMap)
            });
        }

        const existing = await Model.findOne({ userId: userId });

        if (existing) {
            await Model.updateOne({ userId: userId }, { $set: { itemsID: itemsID } });
            return res.status(200).json({
                message: "Preferrence updated successfully",
                userId,
                itemsID,
            });
        }

        const preferredItem = new Model({ userId: userId, itemsID });

        await preferredItem.save();
        return res.status(200).json({
            message: 'Preferrence saved successfully',
            userId,
            itemsID,
            preferredItem
        });
    } catch (error) {
        next(error);
    }
});

export default router;