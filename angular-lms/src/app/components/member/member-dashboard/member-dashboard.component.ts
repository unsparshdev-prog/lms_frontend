import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MemberService } from '../../../services/member.service';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-member-dashboard',
  templateUrl: './member-dashboard.component.html',
  styleUrls: ['./member-dashboard.component.scss']
})
export class MemberDashboardComponent implements OnInit {
  member: any;
  myBorrowed: any[] = [];
  pendingCount = 0;
  overdueCount = 0;

  constructor(
    private auth: AuthService,
    private memberService: MemberService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    if (user?.memberId) {
      this.member = this.memberService.getMemberById(user.memberId);
      const requests = this.requestService.getRequestsByMember(user.memberId);
      this.myBorrowed = requests.filter(r => r.type === 'borrow' && r.status === 'approved');
      this.pendingCount = requests.filter(r => r.status === 'pending' || r.status === 'extension_requested').length;
      const now = new Date().toISOString().split('T')[0];
      this.overdueCount = this.myBorrowed.filter(r => r.dueDate && r.dueDate < now).length;
    }
  }
}
