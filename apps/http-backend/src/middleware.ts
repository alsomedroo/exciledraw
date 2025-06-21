import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}


export function middleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader) {
    
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader;

  try {
    
    //@ts-ignore
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.userId;

    if (typeof userId === "string") {
      req.userId = userId;
      return next();
    } else {
      return res.status(403).json({ message: "Invalid token payload" });
    }
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized" });
  }
}
