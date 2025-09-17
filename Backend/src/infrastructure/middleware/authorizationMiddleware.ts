import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import envs from "../config/environment-vars";
import RolePermissionAdapter from "../adapter/data/RolePermissionAdapter";

// Cache simple en memoria (puede mejorarse con TTL)
const permissionCache = new Map<string, string[]>(); // key: roles sorted joined, value: permissions
const rolePermissionAdapter = new RolePermissionAdapter();

export const enrichPermissionsFromToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next();
  try {
    const decoded: any = jwt.verify(token, envs.JWT_SECRET);
    let roles: string[] = [];
    if (decoded?.roles && Array.isArray(decoded.roles)) roles = decoded.roles;
    else if (decoded?.payload && Array.isArray(decoded.payload) && decoded.payload[3]) {
      // Fallback if roles positioned differently
      roles = decoded.payload[3];
    }
    (req as any).roles = roles;
    if (roles.length) {
      const key = roles.slice().sort().join("|");
      if (permissionCache.has(key)) {
        (req as any).permissions = permissionCache.get(key);
        return next();
      }
      const permsResp = await rolePermissionAdapter.getPermissionsByRoleNames(roles);
      if (permsResp.success && permsResp.data) {
        const permNames = permsResp.data.map((p) => p.name);
        permissionCache.set(key, permNames);
        (req as any).permissions = permNames;
      }
    }
  } catch {
    // Ignorar errores de token aquí; auth principal se maneja en authMiddleware
  }
  next();
};

export const requirePermissions = (...required: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPerms: string[] = (req as any).permissions || [];
    const missing = required.filter((rp) => !userPerms.includes(rp));
    if (missing.length) {
      return res.status(403).json({
        message: "Faltan permisos",
        required,
        missing,
      });
    }
    next();
  };
};
