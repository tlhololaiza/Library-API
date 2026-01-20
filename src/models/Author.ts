export interface Author {
  id: number;
  name: string;
  bio?: string;
  birthYear?: number;
}

// In-memory storage for authors
export const authors: Author[] = [
  {
    id: 1,
    name: "J.K. Rowling",
    bio: "British author, best known for the Harry Potter series",
    birthYear: 1965
  },
  {
    id: 2,
    name: "George Orwell",
    bio: "English novelist and essayist",
    birthYear: 1903
  }
];

let nextAuthorId = 3;