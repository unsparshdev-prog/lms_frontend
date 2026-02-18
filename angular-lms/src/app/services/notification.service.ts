import { Injectable } from '@angular/core';
import { BookRequest } from '../models/request.model';

const MAIL_LOG_KEY = 'lms_mail_log';

export interface MailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: string;
  sentAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  getMailLog(): MailLog[] {
    const data = localStorage.getItem(MAIL_LOG_KEY);
    return data ? JSON.parse(data) : [];
  }

  private addToLog(log: Omit<MailLog, 'id' | 'sentAt'>): void {
    const logs = this.getMailLog();
    logs.unshift({
      ...log,
      id: 'mail-' + Date.now(),
      sentAt: new Date().toISOString()
    });
    localStorage.setItem(MAIL_LOG_KEY, JSON.stringify(logs.slice(0, 500)));
  }

  sendBookingRequestEmail(req: BookRequest): void {
    this.addToLog({
      to: req.memberEmail,
      subject: `LMS - Book Request Submitted: ${req.requestId}`,
      body: `Your book borrow request for "${req.bookTitle}" has been submitted. Request ID: ${req.requestId}. Awaiting librarian approval.`,
      type: 'booking_request'
    });
  }

  sendReturnRequestEmail(req: BookRequest): void {
    this.addToLog({
      to: req.memberEmail,
      subject: `LMS - Return Request Submitted: ${req.requestId}`,
      body: `Your return request for "${req.bookTitle}" has been submitted. Request ID: ${req.requestId}.`,
      type: 'return_request'
    });
  }

  sendApprovalEmail(req: BookRequest): void {
    this.addToLog({
      to: req.memberEmail,
      subject: `LMS - Request Approved: ${req.requestId}`,
      body: `Your borrow request for "${req.bookTitle}" has been approved. Due date: ${req.dueDate}. Request ID: ${req.requestId}.`,
      type: 'approval'
    });
  }

  sendFineEmail(email: string, req: BookRequest, amount: number): void {
    this.addToLog({
      to: email,
      subject: `LMS - Late Return Fine: ${req.requestId}`,
      body: `You have been charged a fine of $${amount} for returning "${req.bookTitle}" after the due date (${req.dueDate}). Please pay at the library.`,
      type: 'fine'
    });
  }

  sendDueReminder(req: BookRequest): void {
    this.addToLog({
      to: req.memberEmail,
      subject: `LMS - Due Date Reminder: ${req.bookTitle}`,
      body: `Reminder: Your book "${req.bookTitle}" is due on ${req.dueDate}. Request ID: ${req.requestId}. Please return on time to avoid fines.`,
      type: 'reminder'
    });
  }
}
