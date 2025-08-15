import { Router, Request, Response, NextFunction } from "express";
import BusinessClient from "../models/BusinessClient";

const router = Router();

router.post("/post", async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const businessClient = new BusinessClient({ name });
    await businessClient.save();

    return res.status(201).json(businessClient);
});

router.get("/get", async (req: Request, res: Response, next: NextFunction) => {
    const businessClients = await BusinessClient.find();

    const cleanedBusinessClients = businessClients.map((client) => ({
        id: client._id.toString(),
        name: client.name
    }));

    return res.status(200).json(cleanedBusinessClients);
});

export default router;