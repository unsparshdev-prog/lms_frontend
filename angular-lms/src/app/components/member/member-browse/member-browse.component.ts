import { Component, OnInit } from '@angular/core';
import { Book } from '../../../models/book.model';
import { AuthService } from '../../../services/auth.service';
import { BookService } from '../../../services/book.service';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-member-browse',
  templateUrl: './member-browse.component.html',
  styleUrls: ['./member-browse.component.scss']
})
export class MemberBrowseComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  categories: string[] = [];
  selectedCategory = '';

  constructor(
    private bookService: BookService,
    private auth: AuthService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.categories = this.bookService.getCategories();
    this.filter();
  }

  filter(): void {
    if (this.selectedCategory) {
      this.filteredBooks = this.bookService.getBooksByCategory(this.selectedCategory);
    } else {
      this.filteredBooks = this.bookService.getAvailableBooks();
    }
  }

  requestBook(book: Book): void {
    const user = this.auth.getCurrentUser();
    if (!user?.memberId) return;
    const result = this.requestService.createBorrowRequest(user.memberId!, user.email, book.id);
    if ('error' in result) {
      alert((result as any).error);
    } else {
      alert('Request submitted! ID: ' + (result as any).requestId);
      this.filter();
    }
  }
}
