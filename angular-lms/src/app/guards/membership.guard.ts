import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({ providedIn: 'root' })
export class MembershipGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {}

  canActivate(): boolean {
    // Librarians bypass membership check
    if (this.auth.isLibrarian()) return true;

    if (this.auth.isMembershipActive()) {
      return true;
    }

    this.toast.warning(
      'Please activate a membership plan to access this feature.',
    );
    this.router.navigate(['/member/membership']);
    return false;
  }
}
