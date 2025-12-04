import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService.js';
import { getUserById } from '../services/userStorage.js';
import { User, UserRole } from '../types/user.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Authenticate token and attach user to request
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      req.user = undefined;
      return next();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      req.user = undefined;
      return next();
    }

    const user = await getUserById(decoded.id);
    if (!user) {
      req.user = undefined;
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    req.user = undefined;
    next();
  }
}

/**
 * Require authentication
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}

/**
 * Require administrator role
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  
  if (req.user.role !== 'administrator') {
    res.status(403).json({ error: 'Administrator access required' });
    return;
  }
  
  next();
}

/**
 * Require specific role
 */
export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    if (req.user.role !== role) {
      res.status(403).json({ error: `${role} access required` });
      return;
    }
    
    next();
  };
}

