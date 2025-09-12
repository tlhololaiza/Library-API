import { Router, Request, Response } from 'express';
import { Book, books } from '../models/Book';
import { authors } from '../models/Author';
import { validateBook, validateBookUniqueness } from '../middleware/validation';

const router = Router();
let nextBookId = 5;

// Create New Book - POST /books
router.post('/', validateBook, validateBookUniqueness, (req: Request, res: Response) => {
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
  
  res.status(201).json({
    ...newBook,
    author: author ? { id: author.id, name: author.name } : null
  });
});

// List All Books - GET /books
router.get('/', (req: Request, res: Response) => {

  //author information
  const booksWithAuthors = books.map(book => {
    const author = authors.find(a => a.id === book.authorId);
    return {
      ...book,
      author: author ? { id: author.id, name: author.name } : null
    };
  });
  
  res.status(200).json(booksWithAuthors);
});

// Get Book By ID - GET /books/:id
router.get('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ 
      error: 'Invalid book ID' 
    });
  }
  
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return res.status(404).json({ 
      error: 'Book not found' 
    });
  }
  
  //author information
  const author = authors.find(a => a.id === book.authorId);
  
  res.status(200).json({
    ...book,
    author: author ? author : null
  });
});

// Update Book - PUT /books/:id
router.put('/:id', validateBook, validateBookUniqueness, (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ 
      error: 'Invalid book ID' 
    });
  }
  
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ 
      error: 'Book not found' 
    });
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
  
  // author information
  const author = authors.find(a => a.id === authorId);
  
  res.status(200).json({
    ...books[bookIndex],
    author: author ? { id: author.id, name: author.name } : null
  });
});

// Delete Book - DELETE /books/:id
router.delete('/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({ 
      error: 'Invalid book ID' 
    });
  }
  
  const bookIndex = books.findIndex(b => b.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({ 
      error: 'Book not found' 
    });
  }
  
  const deletedBook = books.splice(bookIndex, 1)[0];
  
  res.status(200).json({
    message: 'Book deleted successfully',
    book: deletedBook
  });
});

export default router;