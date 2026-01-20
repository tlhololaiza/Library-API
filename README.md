# 📖Library API

A comprehensive RESTful API for managing a library system with authors and books. Built with Express.js and TypeScript, featuring advanced search capabilities, pagination, sorting, security middleware, and comprehensive error handling.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Middleware](#middleware)
- [Security Features](#security-features)
- [Search & Filtering](#search--filtering)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)
- [Response Format](#response-format)

## Features

- ✅ Complete CRUD operations for Authors and Books
- ✅ Advanced search functionality across multiple resources
- ✅ Pagination and sorting on all list endpoints
- ✅ Comprehensive input validation and sanitization
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Security headers and input sanitization
- ✅ Detailed library statistics
- ✅ Structured error responses with timestamps
- ✅ Request logging middleware
- ✅ Data relationships and integrity checks

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd library-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set environment variables**
```bash
# .env file
NODE_ENV=development
PORT=3000
```

4. **Start the server**
```bash
# Development
npm run dev

# Production  
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authors

#### GET `/authors`
List all authors in the library.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "J.K. Rowling",
      "bio": "British author, best known for the Harry Potter series",
      "birthYear": 1965
    },
    {
      "id": 2,
      "name": "George Orwell",
      "bio": "English novelist and essayist",
      "birthYear": 1903
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### GET `/authors/:id`
Get a specific author by ID.

**Example:** `GET /authors/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "J.K. Rowling",
    "bio": "British author, best known for the Harry Potter series",
    "birthYear": 1965
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "message": "Author with ID 999 not found",
    "statusCode": 404,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/authors/999",
    "method": "GET"
  }
}
```

---

#### POST `/authors`
Create a new author.

**Request Body:**
```json
{
  "name": "J.R.R. Tolkien",
  "bio": "English writer and philologist",
  "birthYear": 1892
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "J.R.R. Tolkien",
    "bio": "English writer and philologist",
    "birthYear": 1892
  },
  "message": "Resource created successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Validation:**
- `name`: Required, non-empty string
- `birthYear`: Optional, must be a valid year (0 to current year)

---

#### PUT `/authors/:id`
Update an existing author.

**Example:** `PUT /authors/1`

**Request Body:**
```json
{
  "name": "Joanne Kathleen Rowling",
  "bio": "British author, creator of Harry Potter",
  "birthYear": 1965
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Joanne Kathleen Rowling",
    "bio": "British author, creator of Harry Potter",
    "birthYear": 1965
  },
  "message": "Resource updated successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### DELETE `/authors/:id`
Delete an author by ID.

**Example:** `DELETE /authors/1`

**Response (200):**
```json
{
  "success": true,
  "message": "Author deleted successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (Cannot delete author with books):**
```json
{
  "success": false,
  "error": {
    "message": "Cannot delete author with existing books. Delete associated books first.",
    "statusCode": 400,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/authors/1",
    "method": "DELETE"
  }
}
```

---

#### GET `/authors/:id/books`
Get all books by a specific author with pagination and sorting.

**Example:** `GET /authors/1/books?page=1&limit=5&sortBy=publishedYear&sortOrder=desc&search=harry`

**Query Parameters:**
- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Field to sort by (default: `id`)
- `sortOrder`: `asc` or `desc` (default: `asc`)
- `search`: Search term (min 2 characters)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Harry Potter and the Philosopher's Stone",
      "authorId": 1,
      "publishedYear": 1997,
      "genre": "Fantasy",
      "isbn": "978-0747532699"
    },
    {
      "id": 2,
      "title": "Harry Potter and the Chamber of Secrets",
      "authorId": 1,
      "publishedYear": 1998,
      "genre": "Fantasy",
      "isbn": "978-0747538493"
    }
  ],
  "message": "Books retrieved successfully",
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 5,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Books

#### GET `/books`
List all books in the library.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Harry Potter and the Philosopher's Stone",
      "authorId": 1,
      "publishedYear": 1997,
      "genre": "Fantasy",
      "isbn": "978-0747532699",
      "author": {
        "id": 1,
        "name": "J.K. Rowling"
      }
    }
  ],
  "message": "Books retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### GET `/books/:id`
Get a specific book by ID.

**Example:** `GET /books/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Harry Potter and the Philosopher's Stone",
    "authorId": 1,
    "publishedYear": 1997,
    "genre": "Fantasy",
    "isbn": "978-0747532699",
    "author": {
      "id": 1,
      "name": "J.K. Rowling",
      "bio": "British author, best known for the Harry Potter series",
      "birthYear": 1965
    }
  },
  "message": "Book retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### POST `/books`
Create a new book.

**Request Body:**
```json
{
  "title": "The Hobbit",
  "authorId": 6,
  "publishedYear": 1937,
  "genre": "Fantasy",
  "isbn": "978-0547928227"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 12,
    "title": "The Hobbit",
    "authorId": 6,
    "publishedYear": 1937,
    "genre": "Fantasy",
    "isbn": "978-0547928227",
    "author": {
      "id": 6,
      "name": "J.R.R. Tolkien"
    }
  },
  "message": "Book created successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Validation:**
- `title`: Required, non-empty string
- `authorId`: Required, must reference existing author
- `publishedYear`: Optional, valid year (0 to current year)
- `genre`: Optional, non-empty string
- `isbn`: Optional, must be unique (ISBN is the unique identifier for books)

**Error Response (Duplicate ISBN):**
```json
{
  "success": false,
  "error": {
    "message": "A book with this ISBN already exists",
    "statusCode": 409,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/books",
    "method": "POST"
  }
}
```

---

#### PUT `/books/:id`
Update an existing book.

**Example:** `PUT /books/1`

**Request Body:**
```json
{
  "title": "Harry Potter and the Sorcerer's Stone",
  "authorId": 1,
  "publishedYear": 1997,
  "genre": "Fantasy",
  "isbn": "978-0439136677"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Harry Potter and the Sorcerer's Stone",
    "authorId": 1,
    "publishedYear": 1997,
    "genre": "Fantasy",
    "isbn": "978-0439136677",
    "author": {
      "id": 1,
      "name": "J.K. Rowling"
    }
  },
  "message": "Book updated successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### DELETE `/books/:id`
Delete a book by ID.

**Example:** `DELETE /books/1`

**Response:**
```json
{
  "success": true,
  "message": "Book deleted successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Search

#### GET `/search`
Perform a global search across authors and books with relevance scoring.

**Example:** `GET /search?search=harry&type=book&page=1&limit=10&sortBy=relevance&sortOrder=desc`

**Query Parameters:**
- `search`: Search term (required, min 2 characters)
- `type`: Filter by type (`author` or `book`, optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Sort field - `relevance`, `id`, `name`, `title` (default: `relevance`)
- `sortOrder`: `asc` or `desc` (default: `desc`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "book",
      "id": 1,
      "title": "Harry Potter and the Philosopher's Stone",
      "author": {
        "id": 1,
        "name": "J.K. Rowling"
      },
      "publishedYear": 1997,
      "genre": "Fantasy",
      "isbn": "978-0747532699",
      "relevance": 100
    },
    {
      "type": "author",
      "id": 1,
      "name": "J.K. Rowling",
      "bio": "British author, best known for the Harry Potter series",
      "birthYear": 1965,
      "relevance": 25
    }
  ],
  "message": "Found 2 results for \"harry\"",
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### GET `/search/books`
Advanced search for books with specific filter criteria.

**Example:** `GET /search/books?title=Harry&author=Rowling&genre=Fantasy&year=1997&isbn=978&page=1&limit=10`

**Query Parameters:**
- `title`: Search by book title
- `author`: Search by author name
- `year`: Filter by publication year
- `genre`: Filter by genre
- `isbn`: Search by ISBN
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Sort field (default: `id`)
- `sortOrder`: `asc` or `desc` (default: `asc`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Harry Potter and the Philosopher's Stone",
      "author": {
        "id": 1,
        "name": "J.K. Rowling"
      },
      "publishedYear": 1997,
      "genre": "Fantasy",
      "isbn": "978-0747532699"
    }
  ],
  "message": "Books retrieved successfully",
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### GET `/search/authors`
Advanced search for authors with specific filter criteria.

**Example:** `GET /search/authors?name=Rowling&birthYear=1965&page=1&limit=10`

**Query Parameters:**
- `name`: Search by author name
- `birthYear`: Filter by birth year
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Sort field (default: `id`)
- `sortOrder`: `asc` or `desc` (default: `asc`)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "J.K. Rowling",
      "bio": "British author, best known for the Harry Potter series",
      "birthYear": 1965
    }
  ],
  "message": "Authors retrieved successfully",
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Statistics

#### GET `/stats`
Get comprehensive library statistics including book and author information.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalAuthors": 5,
      "totalBooks": 11,
      "authorsWithoutBooks": 0,
      "averageBooksPerAuthor": 2.2
    },
    "authors": {
      "mostProlific": {
        "name": "J.K. Rowling",
        "bookCount": 3
      }
    },
    "books": {
      "averagePublicationYear": 1945,
      "oldest": {
        "title": "Pride and Prejudice",
        "year": 1813,
        "author": "Jane Austen"
      },
      "newest": {
        "title": "Harry Potter and the Prisoner of Azkaban",
        "year": 1999,
        "author": "J.K. Rowling"
      }
    },
    "genres": {
      "total": 6,
      "topGenres": [
        {
          "genre": "Fantasy",
          "count": 3
        },
        {
          "genre": "Horror",
          "count": 2
        },
        {
          "genre": "Mystery",
          "count": 2
        },
        {
          "genre": "Dystopian Fiction",
          "count": 1
        },
        {
          "genre": "Political Satire",
          "count": 1
        }
      ]
    }
  },
  "message": "Library statistics retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

#### GET `/stats/authors`
Get detailed statistics for each author.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "J.K. Rowling",
      "bio": "British author, best known for the Harry Potter series",
      "birthYear": 1965,
      "bookCount": 3,
      "genres": ["Fantasy"],
      "averagePublicationYear": 1998,
      "oldestBook": {
        "title": "Harry Potter and the Philosopher's Stone",
        "year": 1997
      },
      "newestBook": {
        "title": "Harry Potter and the Prisoner of Azkaban",
        "year": 1999
      }
    }
  ],
  "message": "Author statistics retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Health Check

#### GET `/`
Health check endpoint to verify the API is running.

**Response:**
```json
{
  "message": "Library API is running!",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Data Models

### Author

```typescript
interface Author {
  id: number;
  name: string;        // Required
  bio?: string;        // Optional
  birthYear?: number;  // Optional
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `birthYear`: Optional, valid year (0 to current year)

**Example:**
```json
{
  "id": 1,
  "name": "J.K. Rowling",
  "bio": "British author, best known for the Harry Potter series",
  "birthYear": 1965
}
```

### Book

```typescript
interface Book {
  id: number;
  title: string;         // Required
  authorId: number;      // Required, must exist
  publishedYear?: number; // Optional
  genre?: string;        // Optional
  isbn?: string;         // Optional
}
```

**Validation Rules:**
- `title`: Required, non-empty string
- `authorId`: Required, must reference existing author
- `publishedYear`: Optional, valid year (0 to current year)
- `isbn`: Optional, non-empty string if provided
- `title` + `authorId` combination must be unique

**Example:**
```json
{
  "id": 1,
  "title": "Harry Potter and the Philosopher's Stone",
  "authorId": 1,
  "publishedYear": 1997,
  "genre": "Fantasy",
  "isbn": "978-0747532699"
}
```

## Middleware

The API includes several middleware layers for enhanced functionality and security:

### 1. Logger (`logger.ts`)
- Logs all incoming requests with timestamp, method, and URL
- Format: `[timestamp] METHOD /path`

### 2. Error Handler (`errorHandler.ts`)
- Global error handling with structured responses
- Custom error types (ValidationError, NotFoundError, etc.)
- Stack traces in development mode
- 404 handler for unmatched routes
- Async error wrapper for route handlers

### 3. Security (`security.ts`)
- **Rate Limiting**: 100 requests per 15-minute window per IP
- **Request Size Limiting**: Default 1MB maximum
- **Security Headers**:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
- **Input Sanitization**: Removes dangerous characters
- **CORS Headers**: Configurable cross-origin access

### 4. Validation (`validation.ts`)
- Author validation (name requirements, birth year validation)
- Book validation (title, author existence, year validation)
- Uniqueness validation (prevents duplicate book titles per author)

### 5. Search Middleware (`search.ts`)
- Query parameter parsing and validation
- Support for pagination, sorting, and filtering
- Type-safe query processing

## Security Features

### Rate Limiting
- **Window**: 15 minutes
- **Limit**: 100 requests per IP
- **Response**: 429 status with retry information
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Input Sanitization
- Removes `<` and `>` characters to prevent XSS
- Trims whitespace from string inputs
- Recursive sanitization for nested objects

### Security Headers
- Prevents clickjacking attacks
- Blocks MIME type sniffing
- Enables XSS protection
- Removes server fingerprinting

## Search & Filtering

### Query Parameters

#### Pagination
- `page`: Page number (default: 1, min: 1)
- `limit`: Items per page (default: 10, max: 100)

#### Sorting
- `sortBy`: Field to sort by (validated against allowed fields)
- `sortOrder`: `asc` or `desc` (default: `asc`)

#### Search
- `search`: Text search across specified fields (minimum 2 characters)

#### Filtering
- Any field can be used as a filter parameter
- Supports exact matches and partial string matches
- Automatic type conversion for numeric values

### Search Relevance

The search algorithm calculates relevance scores:
- **Exact match**: 100 points
- **Starts with term**: 50 points  
- **Contains term**: 25 points
- **Partial word matches**: 10 points per match

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/authors/123",
    "method": "GET"
  },
  "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `429`: Too Many Requests (rate limit)
- `500`: Internal Server Error

### Custom Error Types

- `ValidationError`: Input validation failures
- `NotFoundError`: Resource not found
- `ConflictError`: Data conflicts (duplicates)
- `BadRequestError`: Invalid request format

## Usage Examples

### Create an Author

```bash
POST /authors
Content-Type: application/json

{
  "name": "Stephen King",
  "bio": "American author of horror fiction",
  "birthYear": 1947
}
```

### Create a Book

```bash
POST /books
Content-Type: application/json

{
  "title": "The Shining",
  "authorId": 4,
  "publishedYear": 1977,
  "genre": "Horror",
  "isbn": "978-0307743657"
}
```

### Search Books

```bash
# Global search
GET /search?search=harry&type=book&page=1&limit=5

# Advanced book search
GET /search/books?author=rowling&genre=fantasy&year=1997

# Author's books with pagination
GET /authors/1/books?page=2&limit=5&sortBy=publishedYear&sortOrder=desc
```

### Get Statistics

```bash
# Library overview
GET /stats

# Detailed author statistics
GET /stats/authors
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "message": "Data retrieved successfully",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Statistics Response

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalAuthors": 5,
      "totalBooks": 11,
      "authorsWithoutBooks": 0,
      "averageBooksPerAuthor": 2.2
    },
    "authors": {
      "mostProlific": {
        "name": "J.K. Rowling",
        "bookCount": 3
      }
    },
    "books": {
      "averagePublicationYear": 1945,
      "oldest": {
        "title": "Pride and Prejudice",
        "year": 1813,
        "author": "Jane Austen"
      },
      "newest": {
        "title": "Harry Potter and the Prisoner of Azkaban",
        "year": 1999,
        "author": "J.K. Rowling"
      }
    },
    "genres": {
      "total": 6,
      "topGenres": [
        { "genre": "Fantasy", "count": 3 },
        { "genre": "Horror", "count": 2 }
      ]
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Sample Data

The API comes pre-loaded with sample data:

**Authors**: J.K. Rowling, George Orwell, Agatha Christie, Stephen King, Jane Austen

**Books**: Harry Potter series, 1984, Animal Farm, Murder on the Orient Express, The Shining, Pride and Prejudice, and more

## Development Notes

- Built with **Express.js** and **TypeScript**
- Uses **in-memory storage** (suitable for development/testing)
- **Modular architecture** with separate concerns
- **Type-safe** throughout the application
- **Comprehensive logging** and **error tracking**
- **Production-ready** security features

---

**API Version**: 1.0.0  
**Node.js Version**: 14+ recommended  
**TypeScript**: Required for development
