Library API
This is a RESTful API for managing a library system, built with TypeScript and Express.js. It provides a set of endpoints for handling authors, books, searching, and library statistics.

Getting Started
To run the API, you'll need Node.js and npm installed.

Install dependencies:

Bash

npm install
Start the server in development mode:

Bash

npm run dev
The server will run on http://localhost:3000 and automatically restart on file changes.

API Endpoints
The API is structured around four main resources: authors, books, search, and stats. The base URL for all endpoints is http://localhost:3000.

Authors Endpoints (/authors) ✍️
Method	Endpoint	Description	Request Body	Example Response
POST	/authors	Creates a new author.	{"name": "string", "bio": "string", "birthYear": "number"}	201 Created
GET	/authors	Retrieves a list of all authors.	N/A	200 OK (array of authors)
GET	/authors/:id	Retrieves a single author by their ID.	N/A	200 OK (author object)
PUT	/authors/:id	Updates an existing author by ID.	{"name": "string", "bio": "string", "birthYear": "number"}	200 OK (updated author object)
DELETE	/authors/:id	Deletes an author. Fails if the author has associated books.	N/A	200 OK ("No Content")
GET	/authors/:id/books	Lists all books by a specific author. Supports pagination, filtering, and sorting.	N/A	200 OK (paginated list of books)

Export to Sheets
Books Endpoints (/books) 📚
Method	Endpoint	Description	Request Body	Example Response
POST	/books	Creates a new book. Requires an existing authorId.	{"title": "string", "authorId": "number", "publishedYear": "number"}	201 Created
GET	/books	Retrieves a list of all books. Includes author details for each book.	N/A	200 OK (array of books with author info)
GET	/books/:id	Retrieves a single book by its ID.	N/A	200 OK (book object with author info)
PUT	/books/:id	Updates an existing book by its ID.	{"title": "string", "authorId": "number", ...}	200 OK (updated book object)
DELETE	/books/:id	Deletes a book.	N/A	200 OK ("No Content")

Export to Sheets
Search Endpoints (/search) 🔎
Method	Endpoint	Description	Query Parameters	Example Response
GET	/search	Global search across both authors and books. Requires a search term of at least two characters.	?search=your_query	200 OK (array of combined search results)
GET	/search/books	Searches for books by various criteria.	?title=string&author=string&year=number&genre=string&isbn=string	200 OK (paginated list of books)
GET	/search/authors	Searches for authors by name or birth year.	?name=string&birthYear=number	200 OK (paginated list of authors)

Export to Sheets
Statistics Endpoints (/stats) 📊
Method	Endpoint	Description	Example Response
GET	/stats	Retrieves general library statistics, including total counts, most prolific author, and top genres.	200 OK (statistics object)
GET	/stats/authors	Retrieves detailed statistics for each author, such as total books and publication span.	200 OK (array of author statistics)

Export to Sheets
Middleware and Utilities
The API uses various middleware and utility functions to handle common tasks:

Error Handling: errorHandler.ts provides a global error handler that catches and formats responses for different HTTP errors like 404 Not Found and 400 Bad Request.

Security: security.ts includes middleware for rate limiting, request size limiting, and setting standard security headers.

Validation: validation.ts defines middleware to validate incoming request data for both authors and books, ensuring required fields are present and correctly formatted.

Query Processing: queryUtils.ts contains a QueryProcessor class that handles the parsing, filtering, sorting, and pagination of data, making it reusable across various endpoints.

Response Formatting: responseUtils.ts provides helper functions to standardize all API responses, ensuring they consistently include a success flag, data, and a timestamp.
