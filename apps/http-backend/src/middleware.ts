import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";  

export function middleware(req:Request, res:Response, next:NextFunction) {
    // Middleware logic here
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_SECRET)
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized" });
    }else{
        //@ts-ignore
        req.userId = decoded.userId; // Assuming the token contains a userId field
        next();
    }

    console.log("Middleware executed");
    next();
}