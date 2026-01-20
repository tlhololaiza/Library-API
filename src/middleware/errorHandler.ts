import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/error';

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
  };
  stack?: string;
}

// Global error handler
export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Check if it's custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
    isOperational = true;
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON format';
    isOperational = true;
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && !isOperational) {
    errorResponse.stack = err.stack;
  }

  // Log error details
  console.error(`[ERROR ${statusCode}] ${req.method} ${req.originalUrl} - ${message}`);
  if (!isOperational) {
    console.error('Stack trace:', err.stack);
  }

  res.status(statusCode).json(errorResponse);
};

// 404 handler for unmatched routes
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};