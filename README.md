# 📖 Library API

A RESTful API for managing a simple library system, built with **TypeScript** and **Express.js**.  
It uses an **in-memory data store** for authors and books and demonstrates clean architecture,
maintainability, and standardized responses.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+  
- **npm** v8+

### Installation
Clone the repository and install dependencies:
```bash
npm install
Development Server
Start the API in development mode (auto-restarts on file changes):

bash
Copy code
npm run dev
The server will run at http://localhost:3000.

📝 API Endpoints
All endpoints are prefixed with http://localhost:3000.

Authors /authors ✍️
Method	Endpoint	Description
POST	/	Create a new author.
GET	/	Retrieve all authors.
GET	/:id	Retrieve a single author by ID.
PUT	/:id	Update an author’s details.
DELETE	/:id	Delete an author (fails if the author has published books).
GET	/:id/books	List all books by an author (supports ?page & ?limit).

Books /books 📚
Method	Endpoint	Description
POST	/	Create a new book (requires existing authorId).
GET	/	Retrieve all books with author details.
GET	/:id	Retrieve a single book by ID.
PUT	/:id	Update a book’s details.
DELETE	/:id	Delete a book.

Search & Statistics /search, /stats 📊
Method	Endpoint	Description
GET	/search	Global search across authors and books. Requires ?search query.
GET	/search/books	Filter books by title, author, year, or genre.
GET	/search/authors	Search authors by name or birthYear.
GET	/stats	General library stats (total authors, top genres, prolific author).
GET	/stats/authors	Detailed statistics for each author.

🔍 Example Requests
Create a new author:

bash
Copy code
curl -X POST http://localhost:3000/authors \
-H "Content-Type: application/json" \
-d '{"name":"Jane Doe","birthYear":1985}'
Example JSON response:

json
Copy code
{
  "success": true,
  "data": { "id": "1", "name": "Jane Doe", "birthYear": 1985 },
  "timestamp": "2025-09-12T08:00:00Z"
}
🛡️ Security & Error Handling
Security Middleware: Rate limiting, request-size limits, and standard HTTP security headers.

Centralized Error Handler: Uniform 400/404 responses with clear messages.

Standardized Responses: Every response includes success, data, and timestamp.

🛠️ Tech Stack
TypeScript for static typing

Express.js for routing and middleware

In-memory data store (no external DB required)

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/my-feature)

Commit your changes (git commit -m 'Add new feature')

Push to the branch (git push origin feature/my-feature)

Open a Pull Request
