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
  },
  {
    id: 3,
    name: "Agatha Christie",
    bio: "English writer known for her detective novels",
    birthYear: 1890
  },
  {
    id: 4,
    name: "Stephen King",
    bio: "American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels",
    birthYear: 1947
  },
  {
    id: 5,
    name: "Jane Austen",
    bio: "English novelist known primarily for her six major novels",
    birthYear: 1775
  }
];

let nextAuthorId = 6;