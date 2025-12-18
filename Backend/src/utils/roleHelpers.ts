import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to allow access only to certain roles
 */
export const allowRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
