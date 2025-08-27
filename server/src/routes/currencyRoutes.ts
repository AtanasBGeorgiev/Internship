import { NextFunction, Request, Response, Router } from 'express';
import Currency from '../models/Currency';

const router = Router();

// GET /api/currency - Get all currencies
router.get('/getAllCurencies', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currencies = await Currency.find({}).lean();

        if (!currencies || currencies.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No currencies found',
                data: []
            });
        }

        // Create a dictionary of currencies and their reverse rates
        const dictionary = currencies.reduce((acc: Record<string, number>, item: any) => {
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

// POST Create or update currency
router.post('/postCurrency', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currency, perUnit, exchangeRate, reverseRate, name_bg, name_en } = req.body;

        const countryMap: Record<string, string> = {
            EUR: 'eu', AUD: 'au', BRL: 'br', CAD: 'ca', CHF: 'ch',
            CNY: 'cn', CZK: 'cz', DKK: 'dk', GBP: 'gb', HKD: 'hk',
            HUF: 'hu', IDR: 'id', ILS: 'il', INR: 'in', ISK: 'is',
            JPY: 'jp', KRW: 'kr', MXN: 'mx', MYR: 'my', NOK: 'no',
            NZD: 'nz', PHP: 'ph', PLN: 'pl', RON: 'ro', SEK: 'se',
            SGD: 'sg', THB: 'th', TRY: 'tr', USD: 'us', ZAR: 'za'
        };

        const countryCode = countryMap[currency];
        if (!countryCode) {
            return res.status(400).json({
                success: false,
                message: 'Invalid currency'
            });
        }

        const flagURL = `https://flagcdn.com/w320/${countryCode}.png`;

        // Check if currency already exists
        let existingCurrency = await Currency.findOne({ currency });

        if (existingCurrency) {
            // Update existing currency
            existingCurrency.perUnit = perUnit;
            existingCurrency.exchangeRate = exchangeRate;
            existingCurrency.reverseRate = reverseRate;
            existingCurrency.name_bg = name_bg;
            existingCurrency.name_en = name_en;
            existingCurrency.flagURL = flagURL;
            await existingCurrency.save();
        } else {
            // Create new currency
            const newCurrency = new Currency({
                currency, perUnit, exchangeRate,
                reverseRate, name_bg, name_en, flagURL
            });
            await newCurrency.save();
        }

        return res.status(201).json({
            success: true,
            message: `Currency ${currency} saved successfully`,
            data: existingCurrency || { currency, perUnit, exchangeRate, reverseRate, name_bg, name_en, flagURL }
        });
    } catch (error) {
        next(error);
    }
});

export default router;