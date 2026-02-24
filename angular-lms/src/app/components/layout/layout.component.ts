import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MemberService } from '../../services/member.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  membershipActive = false;
  private sub!: Subscription;

  constructor(
    public auth: AuthService,
    private router: Router,
    private memberService: MemberService,
  ) {}

  ngOnInit(): void {
    this.sub = this.auth.currentUser$.subscribe((user) => {
      if (user && user.role === 'MEMBER') {
        this.membershipActive = user.membershipActive === true;
      } else {
        this.membershipActive = true; // Librarian always has access
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  logout(): void {
    this.auth.logout();
  }
}
