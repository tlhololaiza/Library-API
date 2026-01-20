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
    title: "Harry Potter and the Prisoner of Azkaban",
    authorId: 1,
    publishedYear: 1999,
    genre: "Fantasy",
    isbn: "978-0747542155"
  },
  {
    id: 4,
    title: "1984",
    authorId: 2,
    publishedYear: 1949,
    genre: "Dystopian Fiction",
    isbn: "978-0451524935"
  },
  {
    id: 5,
    title: "Animal Farm",
    authorId: 2,
    publishedYear: 1945,
    genre: "Political Satire",
    isbn: "978-0451526342"
  },
  {
    id: 6,
    title: "Murder on the Orient Express",
    authorId: 3,
    publishedYear: 1934,
    genre: "Mystery",
    isbn: "978-0062693662"
  },
  {
    id: 7,
    title: "The Murder of Roger Ackroyd",
    authorId: 3,
    publishedYear: 1926,
    genre: "Mystery",
    isbn: "978-0062073563"
  },
  {
    id: 8,
    title: "The Shining",
    authorId: 4,
    publishedYear: 1977,
    genre: "Horror",
    isbn: "978-0307743657"
  },
  {
    id: 9,
    title: "It",
    authorId: 4,
    publishedYear: 1986,
    genre: "Horror",
    isbn: "978-1501142970"
  },
  {
    id: 10,
    title: "Pride and Prejudice",
    authorId: 5,
    publishedYear: 1813,
    genre: "Romance",
    isbn: "978-0141439518"
  },
  {
    id: 11,
    title: "Emma",
    authorId: 5,
    publishedYear: 1815,
    genre: "Romance",
    isbn: "978-0141439587"
  }
];

let nextBookId = 12;