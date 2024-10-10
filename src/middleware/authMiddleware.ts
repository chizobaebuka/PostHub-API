import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

// Middleware to verify JWT token before accessing protected routes
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const headers = req.headers.authorization;
    if(!headers){
        return res.status(401).json({ message: "Token is required" });
    }

    const token = headers.split(" ")[1];
    if(!token){
        return res.status(401).json({ message: "Token is not provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!)
        req.user = decoded;
        next();
    } catch (err: any) {
        return res.status(401).json({ message: "Invalid token" });
    }
} 