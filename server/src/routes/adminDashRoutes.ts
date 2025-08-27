import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User";

const router = Router();

router.get("/getUsers", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({ role: "user" }).select("-password -__v").lean();
        const cleanedUsers = users.map(({ _id, ...rest }) => ({
            id: _id.toString(),
            ...rest
        }));
        return res.status(200).json(cleanedUsers);
    } catch (error) {
        next(error);
    }
});

router.put("/updateRole", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usersIds = req.body;
        res.status(200).json(usersIds);
        for (const userId of usersIds) {
            const user = await User.findByIdAndUpdate(userId, { role: "admin" }, { new: true });
            return res.status(200).json(user);
        }
    } catch (error) {
        next(error);
    }
});

export default router;