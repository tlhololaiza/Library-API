export interface Book {
  id: number;
  title: string;
  authorId: number;
  publishedYear?: number;
  genre?: string;
  isbn?: string;
}

// In-memory storage for books
export const books: Book[] = [
  {
    id: 1,
    title: "Harry Potter and the Philosopher's Stone",
    authorId: 1,
    publishedYear: 1997,
    genre: "Fantasy",
    isbn: "978-0747532699"
  },
  {
    id: 2,
    title: "Harry Potter and the Chamber of Secrets",
    authorId: 1,
    publishedYear: 1998,
    genre: "Fantasy",
    isbn: "978-0747538493"
  },
  {
    id: 3,
    title: "1984",
    authorId: 2,
    publishedYear: 1949,
    genre: "Dystopian Fiction",
    isbn: "978-0451524935"
  },
  {
    id: 4,
    title: "Animal Farm",
    authorId: 2,
    publishedYear: 1945,
    genre: "Political Satire",
    isbn: "978-0451526342"
  }
];

let nextBookId = 5;