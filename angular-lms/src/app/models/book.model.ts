export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  createdAt: string;
}

export type BookCategory = 'Fiction' | 'Non-Fiction' | 'Science' | 'Technology' | 'History' | 'Biography' | 'Children' | 'Other';
