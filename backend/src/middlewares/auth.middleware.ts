import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../helpers/jwt.helper';
import { UserRole } from '../models/user.model';

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Bearer token first, then cookie
    const authHeader = req.headers.authorization
    let token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.accessToken

    if (!token) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }

    const decoded = verifyAccessToken(token)
    req.user = { id: decoded.id, role: decoded.role as UserRole }
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
};

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }
    next();
  };
};