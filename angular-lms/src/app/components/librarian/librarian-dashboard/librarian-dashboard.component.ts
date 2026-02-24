import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { MemberService } from '../../../services/member.service';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-librarian-dashboard',
  templateUrl: './librarian-dashboard.component.html',
  styleUrls: ['./librarian-dashboard.component.scss']
})
export class LibrarianDashboardComponent implements OnInit {
  stats = { books: 0, members: 0, pendingRequests: 0, overdue: 0 };

  constructor(
    private bookService: BookService,
    private memberService: MemberService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.stats.books = this.bookService.getAllBooks().length;
    this.stats.members = this.memberService.getAllMembers().filter(m => m.status === 'approved').length;
    this.stats.pendingRequests = this.requestService.getPendingRequests().length;
    this.stats.overdue = this.requestService.getOverdueRequests().length;
  }
}
