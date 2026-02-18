import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { NotificationService } from './notification.service';

const REMINDER_SENT_KEY = 'lms_reminders_sent';

@Injectable({ providedIn: 'root' })
export class ReminderSchedulerService {
  private intervalId: any;
  private readonly REMIND_DAYS_AHEAD = 2;

  constructor(
    private requestService: RequestService,
    private notification: NotificationService
  ) {}

  start(): void {
    this.runReminders();
    this.intervalId = setInterval(() => this.runReminders(), 60000); // Every minute (demo); use 86400000 for daily
  }

  stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private getSentReminders(): string[] {
    const data = localStorage.getItem(REMINDER_SENT_KEY);
    return data ? JSON.parse(data) : [];
  }

  private markReminderSent(requestId: string): void {
    const sent = this.getSentReminders();
    if (!sent.includes(requestId)) {
      sent.push(requestId);
      localStorage.setItem(REMINDER_SENT_KEY, JSON.stringify(sent.slice(-1000)));
    }
  }

  private runReminders(): void {
    const dueSoon = this.requestService.getDueSoonRequests(this.REMIND_DAYS_AHEAD);
    const sent = this.getSentReminders();
    dueSoon.forEach(req => {
      if (!sent.includes(req.requestId)) {
        this.notification.sendDueReminder(req);
        this.markReminderSent(req.requestId);
      }
    });
  }

  runNow(): void {
    this.runReminders();
  }
}
