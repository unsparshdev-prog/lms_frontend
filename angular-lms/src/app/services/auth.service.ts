import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

const USERS_KEY = 'lms_users';
const CURRENT_USER_KEY = 'lms_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    this.seedInitialUsers();
  }

  private seedInitialUsers(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      const defaultUsers: User[] = [
        { id: '1', email: 'librarian@lms.com', password: 'librarian123', name: 'Librarian', role: 'librarian' },
        { id: '2', email: 'member@lms.com', password: 'member123', name: 'John Member', role: 'member', memberId: 'mem-1' }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    }
  }

  private getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private getStoredUser(): User | null {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  login(email: string, password: string): { success: boolean; message?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isLibrarian(): boolean {
    return this.getCurrentUser()?.role === 'librarian';
  }

  isMember(): boolean {
    return this.getCurrentUser()?.role === 'member';
  }
}
