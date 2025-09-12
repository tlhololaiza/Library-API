import { Router, Request, Response } from 'express';
import { Book, books } from '../models/Book';
import { authors } from '../models/Author';
import { validateBook, validateBookUniqueness } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { BadRequestError, NotFoundError } from '../types/error';
import { ResponseUtils } from '../utils/responseUtils';

const router = Router();
let nextBookId = 12;

// Create New Book - POST /books
router.post('/', validateBook, validateBookUniqueness, asyncHandler(async (req: Request, res: Response) => {
  const { title, authorId, publishedYear, genre, isbn } = req.body;
  
  const newBook: Book = {
    id: nextBookId++,
    title: title.trim(),
    authorId,
    publishedYear,
    genre: genre?.trim(),
    isbn: isbn?.trim()
  };
  
  books.push(newBook);
  
  // Include author information in response
  const author = authors.find(a => a.id === authorId);
  
  const bookWithAuthor = {
    ...newBook,
    author: author ? { id: author.id, name: author.name } : null
  };
  
  return ResponseUtils.created(res, bookWithAuthor, 'Book created successfully');
}));

// List All Books - GET /books
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  // Include author information with each book
  const booksWithAuthors = books.map(book => {
    const author = authors.find(a => a.id === book.authorId);
    return {
      ...book,
      author: author ? { id: author.id, name: author.name } : null
    };
  });
  
  return ResponseUtils.success(res, booksWithAuthors, 'Books retrieved successfully');
}));

// Get Book By ID - GET /books/:id
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    throw new BadRequestError('Invalid book ID');
  }
  
  const book = books.find(b => b.id === id);
  
  if (!book) {
    throw new NotFoundError('Book', id);
  }
  
  // Include author information
  const author = authors.find(a => a.id === book.authorId);
  
  const bookWithAuthor = {
    ...book,
    author: author ? author : null
  };
  
  return ResponseUtils.success(res, bookWithAuthor, 'Book retrieved successfully');
}));

// Update Book - PUT /books/:id
router.put('/:id', validateBook, validateBookUniqueness, asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    throw new BadRequestError('Invalid book ID');
  }
  
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    throw new NotFoundError('Book', id);
  }
  
  const { title, authorId, publishedYear, genre, isbn } = req.body;
  
  books[bookIndex] = {
    ...books[bookIndex],
    title: title.trim(),
    authorId,
    publishedYear,
    genre: genre?.trim(),
    isbn: isbn?.trim()
  };
  
  // Include author information in response
  const author = authors.find(a => a.id === authorId);
  
  const updatedBookWithAuthor = {
    ...books[bookIndex],
    author: author ? { id: author.id, name: author.name } : null
  };
  
  return ResponseUtils.success(res, updatedBookWithAuthor, 'Book updated successfully');
}));

// Delete Book - DELETE /books/:id
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    throw new BadRequestError('Invalid book ID');
  }
  
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    throw new NotFoundError('Book', id);
  }
  
  const deletedBook = books.splice(bookIndex, 1)[0];
  
  return ResponseUtils.noContent(res, 'Book deleted successfully');
}));

export default router;