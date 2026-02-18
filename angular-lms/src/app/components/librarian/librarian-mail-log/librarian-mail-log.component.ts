import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { ReminderSchedulerService } from '../../../services/reminder-scheduler.service';

@Component({
  selector: 'app-librarian-mail-log',
  templateUrl: './librarian-mail-log.component.html',
  styleUrls: ['./librarian-mail-log.component.scss']
})
export class LibrarianMailLogComponent implements OnInit {
  mails: any[] = [];

  constructor(
    private notification: NotificationService,
    private reminder: ReminderSchedulerService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.mails = this.notification.getMailLog();
  }

  runRemindersNow(): void {
    this.reminder.runNow();
    this.load();
  }
}
