import express from 'express';
import { logger } from './middleware/logger';
import authorRoutes from './routes/authors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/authors', authorRoutes);

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
});

export default app;