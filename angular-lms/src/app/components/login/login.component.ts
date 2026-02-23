import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
    private memberService: MemberService,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.toast.success('Login successful! Welcome back.');

        const user = this.auth.getCurrentUser();
        if (user?.role === 'LIBRARIAN') {
          this.router.navigate(['/librarian/dashboard']);
        } else if (user?.role === 'MEMBER') {
          // Check membership status
          const member = this.memberService.getMemberByEmail(user.email);
          const isActive = this.checkMembershipActive(member);

          // Update the stored user with membership status
          user.membershipActive = isActive;
          this.auth.updateStoredUser(user);

          if (isActive) {
            this.router.navigate(['/member/dashboard']);
          } else {
            this.toast.warning(
              "You don't have an active membership. Please choose a plan to continue.",
            );
            this.router.navigate(['/member/membership']);
          }
        }
      },
      error: (err) => {
        this.loading = false;
        const message =
          err.error?.message ||
          err.error?.error ||
          'Login failed. Please check your credentials.';
        this.toast.danger(message);
      },
    });
  }

  private checkMembershipActive(member: any): boolean {
    if (!member) return false;
    if (member.status !== 'approved') return false;
    const expiry = new Date(member.membershipExpiry);
    return expiry > new Date();
  }
}
