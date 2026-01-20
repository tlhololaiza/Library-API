import { Request, Response, NextFunction } from 'express';
import { authors } from '../models/Author';
import { ConflictError } from '../types/error';

// Validation for Author creation/update
export const validateAuthor = (req: Request, res: Response, next: NextFunction) => {
  const { name, birthYear } = req.body;
  
  // Required field validation
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      error: 'Name is required and must be a non-empty string'
    });
  }
  
  // Optional field validation
  if (birthYear !== undefined && (typeof birthYear !== 'number' || birthYear < 0 || birthYear > new Date().getFullYear())) {
    return res.status(400).json({
      error: 'Birth year must be a valid year'
    });
  }
  
  next();
};

// Validation for Book creation/update
export const validateBook = (req: Request, res: Response, next: NextFunction) => {
  const { title, authorId, publishedYear, isbn } = req.body;
  
  // Required field validation
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      error: 'Title is required and must be a non-empty string'
    });
  }
  
  if (!authorId || typeof authorId !== 'number') {
    return res.status(400).json({
      error: 'Author ID is required and must be a number'
    });
  }
  
  // Check if author exists
  const authorExists = authors.find(author => author.id === authorId);
  if (!authorExists) {
    return res.status(400).json({
      error: 'Invalid author ID - author does not exist'
    });
  }
  
  // Optional field validation
  if (publishedYear !== undefined && (typeof publishedYear !== 'number' || publishedYear < 0 || publishedYear > new Date().getFullYear())) {
    return res.status(400).json({
      error: 'Published year must be a valid year'
    });
  }
  
  if (isbn !== undefined && (typeof isbn !== 'string' || isbn.trim().length === 0)) {
    return res.status(400).json({
      error: 'ISBN must be a non-empty string if provided'
    });
  }
  
  next();
};

// Validation for checking if book title already exists for the same author
export const validateBookUniqueness = (req: Request, res: Response, next: NextFunction) => {
  const { title, authorId } = req.body;
  const bookId = req.params.id ? parseInt(req.params.id) : undefined;
  
  const { books } = require('../models/Book');
  
  const existingBook = books.find((book: any) => 
    book.title.toLowerCase() === title.toLowerCase() && 
    book.authorId === authorId &&
    book.id !== bookId // Exclude current book when updating
  );
  
  if (existingBook) {
    throw new ConflictError('A book with this title already exists for this author');
  }
  
  next();
};