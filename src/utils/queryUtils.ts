import { Request } from 'express';
import { ValidationError } from '../types/error';

export interface QueryParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search?: string;
  filters: Record<string, any>;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class QueryProcessor {
  static parseQuery(req: Request, allowedSortFields: string[] = []): QueryParams {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'asc',
      search,
      ...filters
    } = req.query;

    // Parse and validate page
    const parsedPage = parseInt(page as string);
    if (isNaN(parsedPage) || parsedPage < 1) {
      throw new ValidationError('Page must be a positive integer');
    }

    // Parse and validate limit
    const parsedLimit = parseInt(limit as string);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
      throw new ValidationError('Limit must be between 1 and 100');
    }

    // Validate sort field
    if (allowedSortFields.length > 0 && !allowedSortFields.includes(sortBy as string)) {
      throw new ValidationError(`Invalid sort field. Allowed fields: ${allowedSortFields.join(', ')}`);
    }

    // Validate sort order
    const parsedSortOrder = (sortOrder as string).toLowerCase();
    if (!['asc', 'desc'].includes(parsedSortOrder)) {
      throw new ValidationError('Sort order must be "asc" or "desc"');
    }

    return {
      page: parsedPage,
      limit: parsedLimit,
      sortBy: sortBy as string,
      sortOrder: parsedSortOrder as 'asc' | 'desc',
      search: search as string | undefined,
      filters: this.sanitizeFilters(filters)
    };
  }

  private static sanitizeFilters(filters: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== '') {
        // Convert numeric strings to numbers
        if (typeof value === 'string' && /^\d+$/.test(value)) {
          sanitized[key] = parseInt(value);
        } else if (typeof value === 'string' && /^\d+\.\d+$/.test(value)) {
          sanitized[key] = parseFloat(value);
        } else {
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  }

  static filterData<T>(data: T[], filters: Record<string, any>, searchFields: string[] = []): T[] {
    let filtered = [...data];

    // Apply search across specified fields
    if (filters.search && searchFields.length > 0) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const fieldValue = this.getNestedValue(item, field);
          return fieldValue && fieldValue.toString().toLowerCase().includes(searchTerm);
        })
      );
    }

    // Apply other filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'search') return; // Already handled above

      filtered = filtered.filter(item => {
        const itemValue = this.getNestedValue(item, key);
        
        if (typeof value === 'string' && typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        
        return itemValue === value;
      });
    });

    return filtered;
  }

  static sortData<T>(data: T[], sortBy: string, sortOrder: 'asc' | 'desc'): T[] {
    return [...data].sort((a, b) => {
      const aValue = this.getNestedValue(a, sortBy);
      const bValue = this.getNestedValue(b, sortBy);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? 1 : -1;
      if (bValue == null) return sortOrder === 'asc' ? -1 : 1;

      // Compare values
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;

      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  static paginateData<T>(data: T[], page: number, limit: number): PaginationResult<T> {
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = data.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  static processQuery<T>(
    data: T[],
    queryParams: QueryParams,
    searchFields: string[] = []
  ): PaginationResult<T> {
    // Filter data
    let processed = this.filterData(data, { ...queryParams.filters, search: queryParams.search }, searchFields);
    
    // Sort data
    processed = this.sortData(processed, queryParams.sortBy, queryParams.sortOrder);
    
    // Paginate data
    return this.paginateData(processed, queryParams.page, queryParams.limit);
  }
}