import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, Router } from 'express';

dotenv.config();
const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'User is logged in' });
});

export default router;