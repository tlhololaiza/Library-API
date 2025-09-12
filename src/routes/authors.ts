import { Router, Request, Response } from 'express';
import { Author, authors } from '../models/Author';
import { books } from '../models/Book';

const router = Router();
let nextAuthorId = 3;

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
router.delete('/:id', (req: Request, res: Response) => {
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
  
  // Check if author has books
  const authorHasBooks = books.some(book => book.authorId === id);
  if (authorHasBooks) {
    return res.status(400).json({
      error: 'Cannot delete author with existing books. Delete associated books first.'
    });
  }
  
  const deletedAuthor = authors.splice(authorIndex, 1)[0];
  
  res.status(200).json({
    message: 'Author deleted successfully',
    author: deletedAuthor
  });
});

// List Books By an Author - GET /authors/:id/books
router.get('/:id/books', (req: Request, res: Response) => {
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
  
  const authorBooks = books.filter(book => book.authorId === id);
  
  res.status(200).json({
    author: {
      id: author.id,
      name: author.name
    },
    books: authorBooks,
    totalBooks: authorBooks.length
  });
});

export default router;