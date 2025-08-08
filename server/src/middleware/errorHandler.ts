import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error("Global error handler:", err);

    const statusCode = err.statusCode || err.status || 500; // поддържаме няколко варианта
    const message = err.message || "Internal server error";

    res.status(statusCode).json({
        error: true,
        message,
    });
}
