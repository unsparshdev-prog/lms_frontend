import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class LibrarianGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLibrarian()) return true;
    this.router.navigate(['/member/dashboard']);
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class MemberGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isMember()) return true;
    this.router.navigate(['/librarian/dashboard']);
    return false;
  }
}
