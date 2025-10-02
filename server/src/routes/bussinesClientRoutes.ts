import { Router, Request, Response, NextFunction } from "express";
import BusinessClient from "../models/BusinessClient";

const router = Router();

router.post("/post", async (req: Request, res: Response, next: NextFunction) => {
    const { userId, name_bg, name_en } = req.body;

    const businessClient = new BusinessClient({ userId, name_bg, name_en });
    await businessClient.save();

    return res.status(201).json(businessClient);
});

router.get("/getBusinessClients", async (req: Request, res: Response, next: NextFunction) => {
    // Get language preference from request headers
    const language = req.headers['accept-language'] || 'bg';
    
    const user = (req as any).user;
    const userId = user.userId;

    const businessClients = await BusinessClient.find({ userId: userId });

    const cleanedBusinessClients = businessClients.map(({ _id, name_bg, name_en, ...rest }) => ({
        id: _id.toString(),
        name: language === 'en' ? name_en : name_bg,
        ...rest
    }));

    return res.status(200).json(cleanedBusinessClients);
});

export default router;