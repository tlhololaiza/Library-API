import { Router, Request, Response } from 'express';
import { Author, authors } from '../models/Author';
import { asyncHandler } from '../middleware/errorHandler';
import { BadRequestError, NotFoundError } from '../types/error';
import { books } from '../models/Book';
import { ResponseUtils } from '../utils/responseUtils';
import { parseQueryParams } from '../middleware/search';
import { QueryProcessor } from '../utils/queryUtils';

const router = Router();
let nextAuthorId = 6;

// Create New Author - POST /authors
router.post('/', (req: Request, res: Response) => {
  const { name, bio, birthYear } = req.body;
  
  if (!name) {
    return res.status(400).json({ 
      error: 'Name is required' 
    });
  }
  
  const newAuthor: Author = {
    id: nextAuthorId++,
    name,
    bio,
    birthYear
  };
  
  authors.push(newAuthor);
  
  res.status(201).json(newAuthor);
});

// List All Authors - GET /authors
router.get('/', (req: Request, res: Response) => {
  res.status(200).json(authors);
});

// Get Author By ID - GET /authors/:id
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ 
      error: 'Invalid author ID' 
    });
  }
  
  const author = authors.find(a => a.id === id);
  
  if (!author) {
    return res.status(404).json({ 
      error: 'Author not found' 
    });
  }
  
  res.status(200).json(author);
});

// Update Author - PUT /authors/:id
router.put('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ 
      error: 'Invalid author ID' 
    });
  }
  
  const authorIndex = authors.findIndex(a => a.id === id);
  
  if (authorIndex === -1) {
    return res.status(404).json({ 
      error: 'Author not found' 
    });
  }
  
  const { name, bio, birthYear } = req.body;
  
  if (!name) {
    return res.status(400).json({ 
      error: 'Name is required' 
    });
  }
  
  authors[authorIndex] = {
    ...authors[authorIndex],
    name,
    bio,
    birthYear
  };
  
  res.status(200).json(authors[authorIndex]);
});

// Delete Author - DELETE /authors/:id
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    throw new BadRequestError('Invalid author ID');
  }
  
  const authorIndex = authors.findIndex(a => a.id === id);
  
  if (authorIndex === -1) {
    throw new NotFoundError('Author', id);
  }
  
  // Check if author has books
  const authorHasBooks = books.some(book => book.authorId === id);
  if (authorHasBooks) {
    throw new BadRequestError('Cannot delete author with existing books. Delete associated books first.');
  }
  
  const deletedAuthor = authors.splice(authorIndex, 1)[0];
  
  return ResponseUtils.noContent(res, 'Author deleted successfully');
}));

// List Books By an Author - GET /authors/:id/books
router.get('/:id/books', parseQueryParams(['id', 'title', 'publishedYear', 'genre']), asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const queryParams = req.queryParams!;
  
  if (isNaN(id)) {
    throw new BadRequestError('Invalid author ID');
  }
  
  const author = authors.find(a => a.id === id);
  
  if (!author) {
    throw new NotFoundError('Author', id);
  }
  
  // Get all books by this author
  const authorBooks = books.filter(book => book.authorId === id);
  
  // Apply search fields for books
  const searchFields = ['title', 'genre', 'isbn'];
  
  // Process query with filtering, sorting, and pagination
  const result = QueryProcessor.processQuery(authorBooks, queryParams, searchFields);
  
  const responseData = {
    author: {
      id: author.id,
      name: author.name,
      bio: author.bio,
      birthYear: author.birthYear
    },
    books: result.data,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasNext: result.hasNext,
      hasPrev: result.hasPrev
    }
  };
  
  return ResponseUtils.success(res, responseData, 'Author books retrieved successfully');
}));

export default router;