import { Response } from 'express';

interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

interface PaginatedResponse<T = any> extends SuccessResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class ResponseUtils {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200): Response {
    const response: SuccessResponse<T> = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  static paginated<T>(
    res: Response, 
    data: T[], 
    total: number, 
    page: number, 
    limit: number,
    message?: string
  ): Response {
    const totalPages = Math.ceil(total / limit);
    
    const response: PaginatedResponse<T> = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    };

    return res.status(200).json(response);
  }

  static noContent(res: Response, message = 'Resource deleted successfully'): Response {
    return res.status(200).json({
      success: true,
      message,
      timestamp: new Date().toISOString()
    });
  }
}