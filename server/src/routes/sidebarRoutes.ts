import { NextFunction, Request, Response, Router } from 'express';
import SidebarMenu from "../models/SidebarMenu";

const router = Router();

// GET /api/sidebar - Get sidebar menu
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = (req as any).user.role;

        let sidebarMenu;

        if (userRole === "user") {
            sidebarMenu = await SidebarMenu.findOne({ userRole: "user" }).lean();
        }
        else if (userRole === "admin") {
            sidebarMenu = await SidebarMenu.findOne({ userRole: "admin" }).lean();
        }

        if (!sidebarMenu) {
            return res.status(404).json({
                success: false,
                message: 'Sidebar menu not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Sidebar menu fetched successfully',
            data: (sidebarMenu as any).menu 
        });
    }
    catch (error) {
        next(error);
    }
});

// POST /api/sidebar - Create or update sidebar menu
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userMenu } = req.body;

        if (!userMenu || !Array.isArray(userMenu)) {
            return res.status(400).json({
                success: false,
                message: 'userMenu array is required'
            });
        }

        // Find existing menu or create new one
        let sidebarMenu = await SidebarMenu.findOne({});

        if (sidebarMenu) {
            // Update existing
            sidebarMenu.userMenu = userMenu;
            await sidebarMenu.save();
        } else {
            // Create new
            sidebarMenu = new SidebarMenu({ userMenu });
            await sidebarMenu.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Sidebar menu updated successfully',
            data: sidebarMenu.userMenu
        });
    }
    catch (error) {
        next(error);
    }
});

export default router;