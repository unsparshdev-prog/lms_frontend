import { Component, OnInit } from '@angular/core';
import { BookRequest } from '../../../models/request.model';
import { AuthService } from '../../../services/auth.service';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-member-reports',
  templateUrl: './member-reports.component.html',
  styleUrls: ['./member-reports.component.scss']
})
export class MemberReportsComponent implements OnInit {
  history: BookRequest[] = [];

  constructor(
    private auth: AuthService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user?.memberId) {
      this.history = this.requestService.getRequestsByMember(user.memberId)
        .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    }
  }
}
