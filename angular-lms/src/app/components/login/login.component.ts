import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.error = '';
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    const result = this.auth.login(email, password);
    if (result.success) {
      const user = this.auth.getCurrentUser();
      if (user?.role === 'librarian') {
        this.router.navigate(['/librarian/dashboard']);
      } else {
        this.router.navigate(['/member/dashboard']);
      }
    } else {
      this.error = result.message || 'Login failed';
    }
  }
}
