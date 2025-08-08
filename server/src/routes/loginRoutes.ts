import { Request, Response, Router, NextFunction } from 'express';
import loginLimiter from '../middleware/rateLimiter';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

router.post('/Login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
    console.log('POST /Login received!');
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ errorKey: 'errors.wrongUsername' });
        }

        //user.password have to be string but the compiler doesn't know that and we have to check the type
        //as string means i am sure that the password is a string
        const passwordMatch = await bcrypt.compare(password, user.password as string);

        if (!passwordMatch) {
            return res.status(401).json({ errorKey: 'errors.wrongPassword' });
        }

        //generate JWT token
        const SECRET_KEY = process.env.JWT_SECRET as string;
        //header default
        const token = jwt.sign(
            { userId: user._id, role: user.role, username: username },//payload
            SECRET_KEY,//signature
            { expiresIn: '0.5h' }
        );

        console.log(`Успешен вход за потребител: ${username}`);
        //send token to client
        return res.status(200).json({ messageKey: 'success.login', token });

    } catch (error) {
        next(error);
    }
});

export default router;