import { Component, OnInit } from '@angular/core';
import { Book } from '../../../models/book.model';
import { BookService } from '../../../services/book.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-librarian-books',
  templateUrl: './librarian-books.component.html',
  styleUrls: ['./librarian-books.component.scss']
})
export class LibrarianBooksComponent implements OnInit {
  books: Book[] = [];
  form: FormGroup;
  showForm = false;

  constructor(
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      isbn: ['', Validators.required],
      category: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.books = this.bookService.getAllBooks();
  }

  openForm(): void {
    this.showForm = true;
    this.form.reset({ quantity: 1 });
  }

  closeForm(): void {
    this.showForm = false;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const val = this.form.value;
    this.bookService.addBook({
      title: val.title,
      author: val.author,
      isbn: val.isbn,
      category: val.category,
      quantity: val.quantity,
      availableQuantity: val.quantity
    });
    this.loadBooks();
    this.closeForm();
  }

  get categories(): string[] {
    return ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Children', 'Other'];
  }
}
