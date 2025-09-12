import { Request, Response, NextFunction } from 'express';
import { QueryProcessor } from '../utils/queryUtils';

// Middleware to parse and validate query parameters
export const parseQueryParams = (allowedSortFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.queryParams = QueryProcessor.parseQuery(req, allowedSortFields);
      next();
    } catch (error) {
      next(error);
    }
  };
};

declare global {
  namespace Express {
    interface Request {
      queryParams?: {
        page: number;
        limit: number;
        sortBy: string;
        sortOrder: 'asc' | 'desc';
        search?: string;
        filters: Record<string, any>;
      };
    }
  }
}