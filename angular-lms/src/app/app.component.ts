import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ReminderSchedulerService } from './services/reminder-scheduler.service';

@Component({
  selector: 'app-root',
  template: '<app-toast></app-toast><router-outlet></router-outlet>',
  styles: [],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private reminder: ReminderSchedulerService,
  ) {}

  ngOnInit(): void {
    this.reminder.start();
  }
}
