import express, { Request, Response, NextFunction } from 'express';
import Table from '../models/Table';
import PreferredTable from '../models/Preferences/PreferredTable';

const router = express.Router();

router.post('/post', async (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /postTable accepted!');
    try {
        const { name, defaultOrder, isRestricted, description } = req.body;
        const table = new Table({ name, defaultOrder, isRestricted, description });

        await table.save();
        res.status(201).json(
            {
                message: "Table created successfully",
                table
            }
        );
    } catch (error) {
        next(error);
    }
});

router.get('/get', async (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /get accepted!');
    try {
        const { role } = req.query;
        let tables;

        if (role === "admin") {
            tables = await Table.find().select("-__v").lean();
        }
        else {
            tables = await Table.find({ isRestricted: false }).select("-__v").lean();
        }
        const cleanedTables = tables?.map(({ _id, ...rest }) => ({
            id: _id.toString(),
            ...rest
        }));
        res.status(200).json(cleanedTables);
    } catch (error) {
        next(error);
    }
});

router.put('/updatePreferredOrder', async (req: Request, res: Response, next: NextFunction) => {
    console.log('PUT /updatePreferredOrder accepted!');

    try {
        const { userId, tables } = req.body;

        let preferredTable = await PreferredTable.findOne({ userId });

        if (preferredTable) {
            // Update existing entry
            preferredTable.tables = tables.map((table: any) => ({
                tableId: table.id,
                order: table.order
            }));
        }
        else {
            // Create new entry
            preferredTable = new PreferredTable({
                userId,
                tables: tables.map((table: any) => ({
                    tableId: table.id,
                    order: table.order
                }))
            });
        }

        await preferredTable.save();

        return res.status(200).json({ message: "Preferred table order updated successfully" });
    }
    catch (error) {
        next(error);
    }
});

router.get('/getPreferredOrder/:userId', async (req: Request, res: Response, next: NextFunction) => {
    console.log('GET /getPreferredOrder accepted!');

    try {
        const { userId } = req.params;

        const preferredTable = await PreferredTable.findOne({ userId });

        if (preferredTable) {
            return res.status(200).json(preferredTable.tables);
        }
        else {
            return res.status(200).json([]);
        }
    }
    catch (error) {
        next(error);
    }
});

export default router;