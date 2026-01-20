import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../types/error';

// Rate limiting(15 min window, 100 requests max)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100; 

export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  
  const clientData = requestCounts.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    // First request or window expired
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return next();
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    const remainingTime = Math.ceil((clientData.resetTime - now) / 1000);
    
    res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests, please try again later',
        statusCode: 429,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
        retryAfter: remainingTime
      }
    });
    return;
  }
  
  // Increment counter
  clientData.count++;
  requestCounts.set(clientIP, clientData);
  
  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUESTS - clientData.count));
  res.setHeader('X-RateLimit-Reset', new Date(clientData.resetTime).toISOString());
  
  next();
};

// Request size limiter
export const requestSizeLimiter = (maxSize = 1024 * 1024) => { // 1MB default
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.get('content-length') || '0');
    
    if (contentLength > maxSize) {
      throw new BadRequestError(`Request body too large. Maximum size is ${maxSize} bytes`);
    }
    
    next();
  };
};

// Security headers
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Basic CORS headers (customize as needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  next();
};

// Input sanitization
export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
  
    const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      return value
        .replace(/[<>]/g, '') // Remove < and > characters
        .trim(); 
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };
  
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  next();
};