import express from 'express';
import { logger }  from './middleware/logger';
import authorRoutes from './routes/authors';
import bookRoutes from './routes/books';
import searchRoutes from './routes/search';
import statsRoutes from './routes/stats';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);
app.use('/search', searchRoutes);
app.use('/stats', statsRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Library API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Library API server running on port ${PORT}`);
  console.log(`Ready to manage authors and books!`);
  console.log(`Security features enabled`);
  console.log(`Rate limiting: 100 requests per 15 minutes`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;