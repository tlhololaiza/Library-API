📖 Library API
This is a RESTful API for managing a library system, built with TypeScript and Express.js. It uses an in-memory data store for authors and books. The API is designed to be a simple, yet robust, example of a backend service with a clear structure and a focus on maintainability.

🚀 Getting Started
To get the API running on your local machine, follow these steps:

Install dependencies:

npm install

Start the server in development mode:

npm run dev

The API server will start on http://localhost:3000 and automatically restart whenever you make changes to the source code.

📝 API Endpoints
The API endpoints are organized by resource. The base URL for all requests is http://localhost:3000.

Authors (/authors) ✍️
Method

Endpoint

Description

POST

/

Creates a new author.

GET

/

Retrieves a list of all authors.

GET

/:id

Retrieves a single author by their unique ID.

PUT

/:id

Updates an existing author's details.

DELETE

/:id

Deletes an author. Fails if the author has published books.

GET

/:id/books

Lists all books by a specific author. Supports pagination and filtering.

Books (/books) 📚
Method

Endpoint

Description

POST

/

Creates a new book. Requires an existing authorId.

GET

/

Retrieves a list of all books, with author details.

GET

/:id

Retrieves a single book by its ID.

PUT

/:id

Updates an existing book's details.

DELETE

/:id

Deletes a book.

Search & Statistics (/search, /stats) 📊
Method

Endpoint

Description

GET

/search

Performs a global search across authors and books. Requires a ?search query parameter.

GET

/search/books

Searches for books using various filters like title, author, year, and genre.

GET

/search/authors

Searches for authors by name or birthYear.

GET

/stats

Provides general library statistics (e.g., total authors, top genres, most prolific author).

GET

/stats/authors

Provides detailed statistics for each author.

🛡️ Security and Error Handling
The API is equipped with robust features to ensure reliability and security:

Security Middleware: Includes rate limiting, request size limiting, and sets standard HTTP security headers to protect against common attacks [cite: uploaded:security.ts].

Error Handling: A centralized global error handler catches and formats responses for different HTTP errors, providing clear messages for issues like 404 Not Found and 400 Bad Request [cite: uploaded:errorHandler.ts].

Response Formatting: All API responses are standardized with a success flag, data, and a timestamp for consistency [cite: uploaded:responseUtils.ts].
