import { Component, OnInit } from '@angular/core';
import { BookRequest } from '../../../models/request.model';
import { AuthService } from '../../../services/auth.service';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-member-my-requests',
  templateUrl: './member-my-requests.component.html',
  styleUrls: ['./member-my-requests.component.scss']
})
export class MemberMyRequestsComponent implements OnInit {
  requests: BookRequest[] = [];
  borrowed: BookRequest[] = [];

  constructor(
    private auth: AuthService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user?.memberId) {
      const all = this.requestService.getRequestsByMember(user.memberId);
      this.requests = all.filter(r => r.type === 'borrow' && ['pending', 'approved', 'extension_requested'].includes(r.status));
      this.borrowed = all.filter(r => r.type === 'borrow' && r.status === 'approved');
    }
  }

  requestReturn(req: BookRequest): void {
    const user = this.auth.getCurrentUser();
    if (!user?.memberId) return;
    const result = this.requestService.createReturnRequest(user.memberId, user.email, req.requestId);
    if ('error' in result) {
      alert((result as any).error);
    } else {
      alert('Return request submitted: ' + (result as any).requestId);
      this.ngOnInit();
    }
  }

  requestExtension(req: BookRequest): void {
    const user = this.auth.getCurrentUser();
    if (!user?.memberId) return;
    const result = this.requestService.requestExtension(req.requestId, user.memberId);
    if ('error' in result) {
      alert((result as any).error);
    } else {
      alert('Extension requested. Awaiting librarian approval.');
      this.ngOnInit();
    }
  }

  isOverdue(req: BookRequest): boolean {
    if (!req.dueDate) return false;
    return new Date(req.dueDate) < new Date();
  }
}
