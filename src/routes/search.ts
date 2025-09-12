import { Router, Request, Response } from 'express';
import { authors } from '../models/Author';
import { books } from '../models/Book';
import { parseQueryParams } from '../middleware/search';
import { ResponseUtils } from '../utils/responseUtils';
import { QueryProcessor } from '../utils/queryUtils';
import { ValidationError } from '../types/error';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Global search across authors and books - GET /search
router.get('/', parseQueryParams(['relevance', 'type', 'title', 'name']), asyncHandler(async (req: Request, res: Response) => {
  const queryParams = req.queryParams!;
  const { search } = queryParams;
  
  if (!search || search.trim().length < 2) {
    throw new ValidationError('Search query must be at least 2 characters long');
  }
  
  const searchTerm = search.toLowerCase().trim();
  const results: any[] = [];
  
  // Search authors
  const matchingAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchTerm) ||
    (author.bio && author.bio.toLowerCase().includes(searchTerm))
  ).map(author => ({
    type: 'author',
    id: author.id,
    name: author.name,
    bio: author.bio,
    birthYear: author.birthYear,
    relevance: calculateRelevance(searchTerm, [author.name, author.bio || ''])
  }));
  
  // Search books
  const matchingBooks = books.map(book => {
    const author = authors.find(a => a.id === book.authorId);
    return {
      ...book,
      author: author ? { id: author.id, name: author.name } : null,
      authorName: author?.name || ''
    };
  }).filter(book => 
    book.title.toLowerCase().includes(searchTerm) ||
    (book.genre && book.genre.toLowerCase().includes(searchTerm)) ||
    (book.isbn && book.isbn.toLowerCase().includes(searchTerm)) ||
    book.authorName.toLowerCase().includes(searchTerm)
  ).map(book => ({
    type: 'book',
    id: book.id,
    title: book.title,
    author: book.author,
    publishedYear: book.publishedYear,
    genre: book.genre,
    isbn: book.isbn,
    relevance: calculateRelevance(searchTerm, [book.title, book.genre || '', book.authorName])
  }));
  
  // Combine and sort by relevance
  results.push(...matchingAuthors, ...matchingBooks);
  
  // Apply additional filters if specified
  let filteredResults = results;
  if (queryParams.filters.type) {
    filteredResults = results.filter(item => item.type === queryParams.filters.type);
  }
  
  // Sort by relevance (highest first) or by specified field
  if (queryParams.sortBy === 'relevance') {
    filteredResults.sort((a, b) => b.relevance - a.relevance);
  } else {
    filteredResults = QueryProcessor.sortData(filteredResults, queryParams.sortBy, queryParams.sortOrder);
  }
  
  // Paginate results
  const paginatedResult = QueryProcessor.paginateData(filteredResults, queryParams.page, queryParams.limit);
  
  return ResponseUtils.paginated(
    res,
    paginatedResult.data,
    paginatedResult.total,
    paginatedResult.page,
    paginatedResult.limit,
    `Found ${paginatedResult.total} results for "${search}"`
  );
}));

// Search books by multiple criteria - GET /search/books
router.get('/books', parseQueryParams(['id', 'title', 'publishedYear', 'genre', 'relevance']), asyncHandler(async (req: Request, res: Response) => {
  const queryParams = req.queryParams!;
  const { title, author, year, genre, isbn } = queryParams.filters;
  
  let filteredBooks = books.map(book => {
    const bookAuthor = authors.find(a => a.id === book.authorId);
    return {
      ...book,
      author: bookAuthor ? bookAuthor : null,
      authorName: bookAuthor?.name || ''
    };
  });
  
  // Apply specific filters
  if (title) {
    filteredBooks = filteredBooks.filter(book => 
      book.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  
  if (author) {
    filteredBooks = filteredBooks.filter(book => 
      book.authorName.toLowerCase().includes(author.toLowerCase())
    );
  }
  
  if (year) {
    filteredBooks = filteredBooks.filter(book => book.publishedYear === parseInt(year));
  }
  
  if (genre) {
    filteredBooks = filteredBooks.filter(book => 
      book.genre && book.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }
  
  if (isbn) {
    filteredBooks = filteredBooks.filter(book => 
      book.isbn && book.isbn.includes(isbn)
    );
  }
  
  // Calculate relevance if search term is provided
  if (queryParams.search) {
    const searchTerm = queryParams.search.toLowerCase();
    filteredBooks = filteredBooks.map(book => ({
      ...book,
      relevance: calculateRelevance(searchTerm, [book.title, book.genre || '', book.authorName])
    }));
  }
  
  // Sort and paginate
  const searchFields = ['title', 'genre', 'isbn', 'authorName'];
  const result = QueryProcessor.processQuery(filteredBooks, queryParams, searchFields);
  
  // Clean up temporary fields
  const cleanedData = result.data.map(({ authorName, ...book }) => book);
  
  return ResponseUtils.paginated(
    res,
    cleanedData,
    result.total,
    result.page,
    result.limit,
    'Book search completed'
  );
}));

// Search authors - GET /search/authors  
router.get('/authors', parseQueryParams(['id', 'name', 'birthYear', 'relevance']), asyncHandler(async (req: Request, res: Response) => {
  const queryParams = req.queryParams!;
  const searchFields = ['name', 'bio'];
  
  let filteredAuthors = [...authors];
  
  // Apply specific filters
  if (queryParams.filters.name) {
    filteredAuthors = filteredAuthors.filter(author => 
      author.name.toLowerCase().includes(queryParams.filters.name.toLowerCase())
    );
  }
  
  if (queryParams.filters.birthYear) {
    filteredAuthors = filteredAuthors.filter(author => 
      author.birthYear === queryParams.filters.birthYear
    );
  }
  
  // Calculate relevance if search term provided
  if (queryParams.search) {
    const searchTerm = queryParams.search.toLowerCase();
    filteredAuthors = filteredAuthors.map(author => ({
      ...author,
      relevance: calculateRelevance(searchTerm, [author.name, author.bio || ''])
    }));
  }
  
  // Process query
  const result = QueryProcessor.processQuery(filteredAuthors, queryParams, searchFields);
  
  // Clean up relevance field if it was added
  const cleanedData = result.data.map(({...author }) => author);
  
  return ResponseUtils.paginated(
    res,
    cleanedData,
    result.total,
    result.page,
    result.limit,
    'Author search completed'
  );
}));

// Helper function to calculate search relevance
function calculateRelevance(searchTerm: string, fields: string[]): number {
  let score = 0;
  
  fields.forEach(field => {
    if (field) {
      const fieldLower = field.toLowerCase();
      const termLower = searchTerm.toLowerCase();
      
      // Exact match gets highest score
      if (fieldLower === termLower) {
        score += 100;
      }
      // Starts with search term
      else if (fieldLower.startsWith(termLower)) {
        score += 50;
      }
      // Contains search term
      else if (fieldLower.includes(termLower)) {
        score += 25;
      }
      // Partial word matches
      else {
        const words = fieldLower.split(' ');
        const searchWords = termLower.split(' ');
        
        searchWords.forEach(searchWord => {
          words.forEach(word => {
            if (word.includes(searchWord)) {
              score += 10;
            }
          });
        });
      }
    }
  });
  
  return score;
}

export default router;