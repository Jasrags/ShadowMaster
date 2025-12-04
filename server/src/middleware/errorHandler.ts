import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

export interface AppError extends Error {
  statusCode?: number;
  errors?: ValidationError[];
}

/**
 * Centralized error handling middleware
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Validation errors
  if (err.errors && Array.isArray(err.errors)) {
    res.status(400).json({
      error: 'Validation failed',
      details: isDevelopment ? err.errors : undefined,
    });
    return;
  }

  // Log error in development
  if (isDevelopment) {
    console.error('Error:', err);
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(isDevelopment && { stack: err.stack }),
  });
}

/**
 * 404 handler
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404).json({ error: 'Route not found' });
}

