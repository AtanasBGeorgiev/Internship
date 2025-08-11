import { NextFunction, Request, Response, Router } from 'express';
import Currency from '../models/Currency';

const router = Router();

// GET /api/currency - Get all currencies
router.get('/getAllCurencies', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currencyDocument = await Currency.findOne({}).lean();

        if (!currencyDocument) {
            return res.status(200).json({
                success: true,
                message: 'No currencies found',
                data: []
            });
        }

        // Create a dictionary of currencies and their reverse rates
        const dictionary = (currencyDocument.data || []).reduce((acc: Record<string, number>, item: any) => {
            acc[item.currency] = item.reverseRate;
            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            message: 'Currencies fetched successfully',
            data: dictionary
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/currency - Create or update currency array
router.post('/postCurrency', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { data: currenciesData } = req.body;

        // Check if data exists and is an array
        if (!currenciesData || !Array.isArray(currenciesData)) {
            return res.status(400).json({
                success: false,
                message: 'Request body must have a data array of currencies'
            });
        }

        // Validation for each currency in the array
        for (const currencyData of currenciesData) {
            if (!currencyData.currency || currencyData.reverseRate === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Each currency must have currency and reverseRate fields'
                });
            }
        }

        // Check if currency document already exists
        let currencyDocument = await Currency.findOne({});

        if (currencyDocument) {
            // Update existing document
            currencyDocument.data = currenciesData as any;
            await currencyDocument.save();
        } else {
            // Create new document
            currencyDocument = new Currency({
                data: currenciesData
            });
            await currencyDocument.save();
        }

        return res.status(201).json({
            success: true,
            message: `${currenciesData.length} currencies saved successfully`,
            data: currencyDocument
        });
    } catch (error) {
        next(error);
    }
});

export default router;