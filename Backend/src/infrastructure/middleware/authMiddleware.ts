import { Response, Request, NextFunction } from "express";

const authenticateToken = (request: Request, response: Response, next: NextFunction): void => {
  const authHeader = request.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    response.status(401).json({
      message: "Invalid Token Perro malparido",
    });
    return;
  }
  try {
    const payload = token;
    next();
  } catch (error) {
    response.status(403).json({
      message: "Invalid Token",
    });
  }
};

export default authenticateToken;
