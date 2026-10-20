import { validationResult } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export const handleValidationError = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
}