import express from 'express';
import MainHeader from '../models/MainHeader';

const router = express.Router();

// GET /api/mainHeader - Fetch main header data
router.get('/', async (req, res, next) => {
    try {
        const mainHeader = await MainHeader.findOne().lean();
        
        if (!mainHeader) {
            return res.status(404).json({ message: 'Main header data not found' });
        }

        res.json(mainHeader.items || []);
    } catch (error) {
        next(error);
    }
});

// POST /api/mainHeader - Create or update main header data
router.post('/', async (req, res, next) => {
    try {
        const { items } = req.body;
        
        // Find existing or create new
        let mainHeader = await MainHeader.findOne();
        
        if (mainHeader) {
            // Update existing
            mainHeader.items = items;
            await mainHeader.save();
        } else {
            // Create new
            mainHeader = new MainHeader({ items });
            await mainHeader.save();
        }

        res.json(mainHeader.items);
    } catch (error) {
        next(error);
    }
});

export default router;
