import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import envs from "../config/environment-vars";

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

    // Try to extract user id from known token shapes:
    // - Auth token created in AuthAdapter: { credentials, payload } where payload is an array and id is at index 2
    // - Other tokens might include an `id` property directly
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

    // Attach user id to the request for downstream handlers
    (request as any).userId = userId;
    next();
  } catch (error: any) {
    // Log the verification error for diagnostics
    console.error("Error verifying token: ", error);

    // Token expired
    if (error && (error.name === "TokenExpiredError" || error instanceof jwt.TokenExpiredError)) {
      response.status(401).json({ message: "Token expired", expiredAt: error.expiredAt });
      return;
    }

    // Other JWT errors (invalid signature, malformed, etc.)
    if (error && (error.name === "JsonWebTokenError" || error instanceof jwt.JsonWebTokenError)) {
      response.status(401).json({ message: "Invalid token" });
      return;
    }

    // Fallback for unexpected errors
    response.status(500).json({ message: "Token verification failed" });
    return;
  }
};

export default authenticateToken;
