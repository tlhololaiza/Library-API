import { Router, Request, Response } from 'express';
import { authors } from '../models/Author';
import { books } from '../models/Book';
import { ResponseUtils } from '../utils/responseUtils';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Get library statistics - GET /stats
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  // Basic counts
  const totalAuthors = authors.length;
  const totalBooks = books.length;
  
  // Author statistics
  const authorsWithBooks = authors.map(author => ({
    ...author,
    bookCount: books.filter(book => book.authorId === author.id).length
  }));
  
  const mostProlificAuthor = authorsWithBooks.reduce((prev, current) => 
    prev.bookCount > current.bookCount ? prev : current
  );
  
  const authorsWithoutBooks = authorsWithBooks.filter(author => author.bookCount === 0).length;
  
  // Book statistics
  const booksWithYear = books.filter(book => book.publishedYear);
  const averagePublicationYear = booksWithYear.length > 0 ? 
    Math.round(booksWithYear.reduce((sum, book) => sum + (book.publishedYear || 0), 0) / booksWithYear.length) : null;
  
  const oldestBook = booksWithYear.reduce((prev, current) => 
    (prev.publishedYear || 0) < (current.publishedYear || 0) ? prev : current
  );
  
  const newestBook = booksWithYear.reduce((prev, current) => 
    (prev.publishedYear || 0) > (current.publishedYear || 0) ? prev : current
  );
  
  // Genre statistics
  const genreCounts: Record<string, number> = {};
  books.forEach(book => {
    if (book.genre) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });
  
  const topGenres = Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([genre, count]) => ({ genre, count }));
  
  const statsData = {
    summary: {
      totalAuthors,
      totalBooks,
      authorsWithoutBooks,
      averageBooksPerAuthor: totalAuthors > 0 ? Math.round((totalBooks / totalAuthors) * 10) / 10 : 0
    },
    authors: {
      mostProlific: {
        name: mostProlificAuthor.name,
        bookCount: mostProlificAuthor.bookCount
      }
    },
    books: {
      averagePublicationYear,
      oldest: booksWithYear.length > 0 ? {
        title: oldestBook.title,
        year: oldestBook.publishedYear,
        author: authors.find(a => a.id === oldestBook.authorId)?.name
      } : null,
      newest: booksWithYear.length > 0 ? {
        title: newestBook.title,
        year: newestBook.publishedYear,
        author: authors.find(a => a.id === newestBook.authorId)?.name
      } : null
    },
    genres: {
      total: Object.keys(genreCounts).length,
      topGenres
    }
  };
  
  return ResponseUtils.success(res, statsData, 'Library statistics retrieved successfully');
}));

// Get author statistics - GET /stats/authors
router.get('/authors', asyncHandler(async (req: Request, res: Response) => {
  const authorsWithStats = authors.map(author => {
    const authorBooks = books.filter(book => book.authorId === author.id);
    const publishedYears = authorBooks
      .filter(book => book.publishedYear)
      .map(book => book.publishedYear!)
      .sort((a, b) => a - b);
    
    const genres = [...new Set(authorBooks
      .filter(book => book.genre)
      .map(book => book.genre!))];
    
    return {
      id: author.id,
      name: author.name,
      bio: author.bio,
      birthYear: author.birthYear,
      statistics: {
        totalBooks: authorBooks.length,
        genres: genres,
        genreCount: genres.length,
        publicationSpan: publishedYears.length > 1 ? {
          earliest: publishedYears[0],
          latest: publishedYears[publishedYears.length - 1],
          yearsActive: publishedYears[publishedYears.length - 1] - publishedYears[0]
        } : null,
        books: authorBooks.map(book => ({
          id: book.id,
          title: book.title,
          publishedYear: book.publishedYear,
          genre: book.genre
        }))
      }
    };
  });
  
  return ResponseUtils.success(res, authorsWithStats, 'Author statistics retrieved successfully');
}));

export default router;
