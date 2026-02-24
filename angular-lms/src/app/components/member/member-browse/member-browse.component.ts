import { Component, OnInit } from '@angular/core';
import { BookApiService, ApiBook } from '../../../services/book-api.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-member-browse',
  templateUrl: './member-browse.component.html',
  styleUrls: ['./member-browse.component.scss'],
})
export class MemberBrowseComponent implements OnInit {
  books: ApiBook[] = [];
  filteredBooks: ApiBook[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private bookApi: BookApiService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.loading = true;
    this.bookApi.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.filteredBooks = books;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        const message =
          err.error?.message ||
          err.error?.error ||
          'Failed to fetch books. Please try again.';
        this.toast.danger(message);
      },
    });
  }

  filterBooks(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredBooks = this.books;
      return;
    }
    this.filteredBooks = this.books.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.isbn.toLowerCase().includes(term) ||
        b.category.toLowerCase().includes(term),
    );
  }

  onSummary(book: ApiBook): void {
    this.toast.success(`AI Summary requested for "${book.title}"`);
    // TODO: Integrate with AI summary API
  }

  onBorrow(book: ApiBook): void {
    this.toast.success(`Borrow request sent for "${book.title}"`);
    // TODO: Integrate with borrow API
  }
}
