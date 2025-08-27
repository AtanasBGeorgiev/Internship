import { rateLimit } from 'express-rate-limit';

//rateLimit - counts requests from each IP address

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: { errorKey: 'errors.tooManyAttempts' },
    keyGenerator: (req) => {
        // Use username from request body or IP address if username is not provided
        return req.body.username || req.ip;
    },
    skipSuccessfulRequests: true, // Reset counter on successful login
    standardHeaders: true,//Adds standart HTTP headers to show rate limit info in responses
    legacyHeaders: false,//Disables legacy headers(old HTTP format with X- prefix)
});

export default loginLimiter;