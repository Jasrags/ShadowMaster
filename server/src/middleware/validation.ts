import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validate email format
 */
export const validateEmail = body('email')
  .isEmail()
  .withMessage('Invalid email format')
  .normalizeEmail();

/**
 * Validate password strength
 * Minimum 8 characters, recommend mixed case, numbers, special chars
 */
export const validatePassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password should contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password should contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password should contain at least one number')
  .optional({ nullable: true })
  .matches(/[^A-Za-z0-9]/)
  .withMessage('Password should contain at least one special character');

/**
 * Validate username
 */
export const validateUsername = body('username')
  .trim()
  .isLength({ min: 3, max: 50 })
  .withMessage('Username must be between 3 and 50 characters')
  .matches(/^[a-zA-Z0-9_-]+$/)
  .withMessage('Username can only contain letters, numbers, underscores, and hyphens');

/**
 * Check validation results
 */
export function checkValidation(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
    return;
  }
  next();
}

