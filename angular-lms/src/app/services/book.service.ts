import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';

const BOOKS_KEY = 'lms_books';

@Injectable({ providedIn: 'root' })
export class BookService {
  private getBooks(): Book[] {
    const data = localStorage.getItem(BOOKS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private setBooks(books: Book[]): void {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }

  constructor() {
    this.seedBooks();
  }

  private seedBooks(): void {
    const books = this.getBooks();
    if (books.length === 0) {
      const defaultBooks: Book[] = [
        { id: 'b1', title: 'Clean Code', author: 'Robert Martin', isbn: '978-0132350884', category: 'Technology', quantity: 5, availableQuantity: 4, createdAt: new Date().toISOString() },
        { id: 'b2', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', isbn: '978-0135957059', category: 'Technology', quantity: 3, availableQuantity: 3, createdAt: new Date().toISOString() },
        { id: 'b3', title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: 'Fiction', quantity: 4, availableQuantity: 4, createdAt: new Date().toISOString() },
        { id: 'b4', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', category: 'Science', quantity: 2, availableQuantity: 2, createdAt: new Date().toISOString() },
        { id: 'b5', title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', category: 'History', quantity: 3, availableQuantity: 3, createdAt: new Date().toISOString() }
      ];
      this.setBooks(defaultBooks);
    }
  }

  getAllBooks(): Book[] {
    return this.getBooks();
  }

  getAvailableBooks(): Book[] {
    return this.getBooks().filter(b => b.availableQuantity > 0);
  }

  getBooksByCategory(category: string): Book[] {
    return this.getAvailableBooks().filter(b => b.category === category);
  }

  getCategories(): string[] {
    const books = this.getBooks();
    const cats = new Set(books.map(b => b.category));
    return Array.from(cats).sort();
  }

  getBookById(id: string): Book | undefined {
    return this.getBooks().find(b => b.id === id);
  }

  addBook(book: Omit<Book, 'id' | 'createdAt'>): Book {
    const books = this.getBooks();
    const id = 'b' + (books.length + 1);
    const newBook: Book = {
      ...book,
      id,
      createdAt: new Date().toISOString()
    };
    books.push(newBook);
    this.setBooks(books);
    return newBook;
  }

  updateBook(id: string, updates: Partial<Book>): Book | null {
    const books = this.getBooks();
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return null;
    books[idx] = { ...books[idx], ...updates };
    this.setBooks(books);
    return books[idx];
  }

  decrementAvailability(bookId: string): boolean {
    const book = this.getBookById(bookId);
    if (!book || book.availableQuantity <= 0) return false;
    return !!this.updateBook(bookId, { availableQuantity: book.availableQuantity - 1 });
  }

  incrementAvailability(bookId: string): boolean {
    const book = this.getBookById(bookId);
    if (!book) return false;
    return !!this.updateBook(bookId, { availableQuantity: Math.min(book.availableQuantity + 1, book.quantity) });
  }
}
