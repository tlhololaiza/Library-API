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

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| `GET` | `/authors` | List all authors | - |
| `GET` | `/authors/:id` | Get author by ID | - |
| `POST` | `/authors` | Create new author | - |
| `PUT` | `/authors/:id` | Update author | - |
| `DELETE` | `/authors/:id` | Delete author | - |
| `GET` | `/authors/:id/books` | Get books by author | `page`, `limit`, `sortBy`, `sortOrder`, `search` |

### Books

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| `GET` | `/books` | List all books | - |
| `GET` | `/books/:id` | Get book by ID | - |
| `POST` | `/books` | Create new book | - |
| `PUT` | `/books/:id` | Update book | - |
| `DELETE` | `/books/:id` | Delete book | - |

### Search

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| `GET` | `/search` | Global search (authors & books) | `search`, `type`, `page`, `limit`, `sortBy`, `sortOrder` |
| `GET` | `/search/books` | Advanced book search | `title`, `author`, `year`, `genre`, `isbn`, `page`, `limit` |
| `GET` | `/search/authors` | Advanced author search | `name`, `birthYear`, `page`, `limit` |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats` | Get library statistics |
| `GET` | `/stats/authors` | Get detailed author statistics |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API health check |

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
