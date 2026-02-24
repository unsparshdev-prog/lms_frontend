import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MemberService } from '../../../services/member.service';
import { MembershipApiService } from '../../../services/membership.service';
import { ToastService } from '../../../services/toast.service';
import { Member } from '../../../models/member.model';

interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  months: number;
  price: string;
  features: string[];
  popular: boolean;
}

@Component({
  selector: 'app-member-membership',
  templateUrl: './member-membership.component.html',
  styleUrls: ['./member-membership.component.scss'],
})
export class MemberMembershipComponent implements OnInit {
  member: Member | undefined;
  isActive = false;
  activatingPlanId: string | null = null;

  plans: MembershipPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      duration: '3 Months',
      months: 3,
      price: '₹499',
      features: [
        'Borrow up to 2 books',
        'Access to general collection',
        'Email notifications',
      ],
      popular: false,
    },
    {
      id: 'standard',
      name: 'Standard',
      duration: '6 Months',
      months: 6,
      price: '₹899',
      features: [
        'Borrow up to 5 books',
        'Access to all collections',
        'Email & SMS notifications',
        'Priority requests',
      ],
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      duration: '12 Months',
      months: 12,
      price: '₹1499',
      features: [
        'Borrow up to 10 books',
        'Access to all collections',
        'Email & SMS notifications',
        'Priority requests',
        'Extended due dates',
        'Fine discount (50%)',
      ],
      popular: false,
    },
  ];

  constructor(
    private auth: AuthService,
    private memberService: MemberService,
    private membershipApi: MembershipApiService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadMember();
  }

  private loadMember(): void {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.member = this.memberService.getMemberByEmail(user.email);
      this.isActive = this.checkMembershipActive();
    }
  }

  private checkMembershipActive(): boolean {
    if (!this.member) return false;
    if (this.member.status !== 'approved') return false;
    const expiry = new Date(this.member.membershipExpiry);
    return expiry > new Date();
  }

  activatePlan(plan: MembershipPlan): void {
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.toast.danger('User not found. Please log in again.');
      return;
    }

    this.activatingPlanId = plan.id;

    this.membershipApi.applyMembership(user.id, plan.id).subscribe({
      next: (res) => {
        this.activatingPlanId = null;

        // Update the stored user to include membership info
        user.membershipActive = true;
        this.auth.updateStoredUser(user);

        this.toast.success(
          res.message || `${plan.name} plan activated successfully!`,
        );

        this.loadMember();

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/member/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.activatingPlanId = null;
        const message =
          err.error?.message ||
          err.error?.error ||
          'Failed to activate membership. Please try again.';
        this.toast.danger(message);
      },
    });
  }

  getDaysLeft(): number {
    if (!this.member) return 0;
    const expiry = new Date(this.member.membershipExpiry);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
