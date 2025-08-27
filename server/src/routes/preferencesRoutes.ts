import { NextFunction, Request, Response, Router } from 'express';
import PreferredAccount from '../models/Preferences/PreferredAccount';
import PreferredCard from '../models/Preferences/PreferredCard';
import PreferredLiability from '../models/Preferences/PreferredLiability';
import PreferredCredit from '../models/Preferences/PreferredCredit';
import PreferredDeposit from '../models/Preferences/PreferredDeposit';
import PreferredPayment from '../models/Preferences/PreferredPayment';
import PreferredCurrency from '../models/Preferences/PreferredCurrency';
import PreferredTransaction from '../models/Preferences/PreferredTransaction';
import PreferredTable from '../models/Preferences/PreferredTable';
import Table from '../models/Table';

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

router.post('/postPreferredTable', async (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /postPreferredTable accepted!');
    try {
        const { userId, tables } = req.body;
        const existing = await PreferredTable.findOne({ userId: userId });

        if (existing) {
            await PreferredTable.updateOne({ userId: userId }, { $set: { tables: tables } });
            return res.status(200).json({
                message: "Preferred table updated successfully",
                userId,
                tables,
            });
        }

        const preferredTable = new PreferredTable({ userId: userId, tables: tables });
        await preferredTable.save();
        return res.status(200).json({
            message: "Preferred table saved successfully",
            userId,
            tables,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/getPreferredTables', async (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /getPreferredTables accepted!');

    try {
        const userId = req.query.userId;
        
        // Get language preference from request headers
        const language = req.headers['accept-language'] || 'bg'; // Default to Bulgarian if no language specified
        
        const preferredTables = await PreferredTable.findOne({ userId: userId });

        if (!preferredTables || !preferredTables.tables || preferredTables.tables.length === 0) {
            return res.status(200).json({
                message: "No preferred tables found",
                tableNames: [],
            });
        }

        // Extract tableIds from the tables array: [{ tableId: "id1" }, { tableId: "id2" }]
        const tableIds = preferredTables.tables.map((table: any) => table.tableId);

        const tableNames = await Table.find({ _id: { $in: tableIds } }).select("name_bg name_en _id").lean();

        // Sort tableNames to match the order of tableIds and return appropriate language version
        const orderedTableNames = tableIds
            .map(id => {
                const table = tableNames.find(t => t._id.toString() === id.toString());
                if (table) {
                    return {
                        _id: table._id,
                        name: language === 'en' ? table.name_en : table.name_bg
                    };
                }
                return null;
            })
            .filter(Boolean);

        return res.status(200).json({
            message: "Preferred tables fetched successfully",
            tableNames: orderedTableNames,
        });
    } catch (error) {
        next(error);
    }
});

export default router;