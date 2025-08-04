import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    //reads the authorization header
    const authHeader = req.headers['authorization'];
    //splits the authorization header into an array[0] - Bearer, [1] - token and takes the token
    const token = authHeader?.split(' ')[1];

    //if no exist a token
    if (!token) {
        return res.status(401).json({ errorKey: 'errors.noToken' });
    }

    try {
        //compares the token's signature with the secret key
        //if the token is valid in decoded will be saved the payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        //saves the payload in the req.user so we can use it in the routes
        (req as any).user = decoded;
        //if everything is ok, continue to the next middleware function or route
        next();
    }
    catch (error) {
        return res.status(403).json({ errorKey: 'errors.invalidToken' });
    }
};

export default verifyToken;