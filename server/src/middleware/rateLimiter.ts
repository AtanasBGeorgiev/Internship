import { rateLimit } from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,//15 minutes 
    max: 5,//5 attempts per 15 minutes
    message: { errorKey: 'errors.tooManyAttempts' }
});

export default loginLimiter;