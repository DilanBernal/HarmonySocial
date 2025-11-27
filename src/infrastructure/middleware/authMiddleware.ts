import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import envs from "../config/environment-vars";
import { RequestHandler } from "express";

const authenticateToken = (request: Request, response: Response, next: NextFunction): void => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    response.status(401).json({
      message: "Invalid Credentials",
    });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, envs.JWT_SECRET);

    let userId: number | undefined;
    if (decoded) {
      if (decoded.payload) {
        const p = decoded.payload;
        if (Array.isArray(p) && p.length >= 3) {
          userId = Number(p[2]);
        } else if (p && (p as any).id) {
          userId = Number((p as any).id);
        }
      }

      if (!userId && (decoded as any).id) {
        userId = Number((decoded as any).id);
      }
    }

    if (!userId || Number.isNaN(userId)) {
      response.status(401).json({ message: "Invalid token payload: user id not found" });
      return;
    }

    (request as any).userId = userId;
    next();
  } catch (error: any) {
    console.error("Error verifying token: ", error);

    if (error && (error.name === "TokenExpiredError" || error instanceof jwt.TokenExpiredError)) {
      response.status(401).json({ message: "Token expired", expiredAt: error.expiredAt });
      return;
    }

    if (error && (error.name === "JsonWebTokenError" || error instanceof jwt.JsonWebTokenError)) {
      response.status(401).json({ message: "Invalid token" });
      return;
    }

    response.status(500).json({ message: "Token verification failed" });
    return;
  }
};
export const authMiddleware: RequestHandler = (_req, _res, next) => {
  next();
};

export default authenticateToken;
