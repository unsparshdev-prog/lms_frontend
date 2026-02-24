import { Component, OnInit } from '@angular/core';
import { BookRequest } from '../../../models/request.model';
import { BookService } from '../../../services/book.service';
import { MemberService } from '../../../services/member.service';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-librarian-reports',
  templateUrl: './librarian-reports.component.html',
  styleUrls: ['./librarian-reports.component.scss']
})
export class LibrarianReportsComponent implements OnInit {
  allRequests: BookRequest[] = [];

  constructor(
    private requestService: RequestService,
    private bookService: BookService,
    private memberService: MemberService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.allRequests = this.requestService.getAllRequests().sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  }
}
