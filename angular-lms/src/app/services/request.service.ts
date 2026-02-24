import { Injectable } from '@angular/core';
import { BookRequest, RequestStatus, RequestType } from '../models/request.model';
import { generateUniqueId } from '../utils/unique-id.util';
import { BookService } from './book.service';
import { MemberService } from './member.service';
import { NotificationService } from './notification.service';

const REQUESTS_KEY = 'lms_requests';
const BORROW_DAYS = 14;
const FINE_PER_DAY = 5;

@Injectable({ providedIn: 'root' })
export class RequestService {
  constructor(
    private bookService: BookService,
    private memberService: MemberService,
    private notification: NotificationService
  ) {}

  private getRequests(): BookRequest[] {
    const data = localStorage.getItem(REQUESTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private setRequests(requests: BookRequest[]): void {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  }

  createBorrowRequest(memberId: string, memberEmail: string, bookId: string): BookRequest | { error: string } {
    const book = this.bookService.getBookById(bookId);
    const member = this.memberService.getMemberById(memberId);
    if (!book) return { error: 'Book not found' };
    if (!member) return { error: 'Member not found' };
    if (member.status !== 'approved') return { error: 'Membership not approved' };
    if (member.fineBalance > 0) return { error: 'Clear outstanding fines first' };
    if (book.availableQuantity <= 0) return { error: 'Book not available' };

    const requests = this.getRequests();
    const activeBorrow = requests.find(r => r.memberId === memberId && r.bookId === bookId && ['pending', 'approved'].includes(r.status) && r.type === 'borrow');
    if (activeBorrow) return { error: 'Already has this book borrowed or requested' };

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

    const req: BookRequest = {
      id: 'req-' + Date.now(),
      requestId: generateUniqueId(),
      memberId,
      memberEmail,
      bookId,
      bookTitle: book.title,
      type: 'borrow',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      dueDate: dueDate.toISOString().split('T')[0]
    };
    requests.push(req);
    this.setRequests(requests);
    this.notification.sendBookingRequestEmail(req);
    return req;
  }

  createReturnRequest(memberId: string, memberEmail: string, requestId: string): BookRequest | { error: string } {
    const requests = this.getRequests();
    const borrowReq = requests.find(r => r.requestId === requestId && r.memberId === memberId && r.type === 'borrow' && r.status === 'approved');
    if (!borrowReq) return { error: 'Borrow request not found or already returned' };

    const returnReq: BookRequest = {
      id: 'req-' + Date.now() + 1,
      requestId: generateUniqueId(),
      memberId,
      memberEmail,
      bookId: borrowReq.bookId,
      bookTitle: borrowReq.bookTitle,
      type: 'return',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      returnedAt: new Date().toISOString()
    };
    requests.push(returnReq);
    this.setRequests(requests);
    this.notification.sendReturnRequestEmail(returnReq);
    return returnReq;
  }

  approveBorrow(requestId: string): BookRequest | null {
    const requests = this.getRequests();
    const req = requests.find(r => r.requestId === requestId && r.type === 'borrow' && r.status === 'pending');
    if (!req) return null;
    if (!this.bookService.decrementAvailability(req.bookId)) return null;

    req.status = 'approved';
    req.approvedAt = new Date().toISOString();
    this.setRequests(requests);
    this.notification.sendApprovalEmail(req);
    return req;
  }

  rejectRequest(requestId: string): BookRequest | null {
    const requests = this.getRequests();
    const req = requests.find(r => r.requestId === requestId && r.status === 'pending');
    if (!req) return null;
    req.status = 'rejected';
    this.setRequests(requests);
    return req;
  }

  processReturn(requestId: string): boolean {
    const requests = this.getRequests();
    const returnReq = requests.find(r => r.requestId === requestId && r.type === 'return' && r.status === 'pending');
    if (!returnReq) return false;

    const borrowReq = requests.find(r => r.memberId === returnReq.memberId && r.bookId === returnReq.bookId && r.type === 'borrow' && r.status === 'approved');
    if (!borrowReq) return false;

    this.bookService.incrementAvailability(returnReq.bookId);
    borrowReq.status = 'returned';
    borrowReq.returnedAt = new Date().toISOString();
    returnReq.status = 'returned';

    const due = new Date(borrowReq.dueDate!);
    const returned = new Date();
    if (returned > due) {
      const daysLate = Math.ceil((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
      const fine = daysLate * FINE_PER_DAY;
      borrowReq.fineAmount = fine;
      this.memberService.addFine(returnReq.memberId, fine);
      this.notification.sendFineEmail(returnReq.memberEmail, borrowReq, fine);
    }
    this.setRequests(requests);
    return true;
  }

  requestExtension(requestId: string, memberId: string): BookRequest | { error: string } {
    const requests = this.getRequests();
    const req = requests.find(r => r.requestId === requestId && r.memberId === memberId && r.type === 'borrow' && r.status === 'approved');
    if (!req) return { error: 'Request not found' };
    if (req.extensionRequested) return { error: 'Extension already requested' };

    req.extensionRequested = true;
    req.status = 'extension_requested';
    this.setRequests(requests);
    return req;
  }

  approveExtension(requestId: string): BookRequest | null {
    const requests = this.getRequests();
    const req = requests.find(r => r.requestId === requestId && r.extensionRequested && !r.extensionApproved);
    if (!req) return null;

    const due = new Date(req.dueDate!);
    due.setDate(due.getDate() + BORROW_DAYS);
    req.dueDate = due.toISOString().split('T')[0];
    req.extensionApproved = true;
    req.extensionRequested = false;
    req.status = 'approved';
    this.setRequests(requests);
    return req;
  }

  rejectExtension(requestId: string): BookRequest | null {
    const requests = this.getRequests();
    const req = requests.find(r => r.requestId === requestId && r.extensionRequested);
    if (!req) return null;
    req.extensionRequested = false;
    req.status = 'approved';
    this.setRequests(requests);
    return req;
  }

  getAllRequests(): BookRequest[] {
    return this.getRequests();
  }

  getRequestsByMember(memberId: string): BookRequest[] {
    return this.getRequests().filter(r => r.memberId === memberId);
  }

  getPendingRequests(): BookRequest[] {
    return this.getRequests().filter(r => r.status === 'pending' || r.status === 'extension_requested');
  }

  getOverdueRequests(): BookRequest[] {
    const now = new Date().toISOString().split('T')[0];
    return this.getRequests().filter(r => r.type === 'borrow' && r.status === 'approved' && r.dueDate && r.dueDate < now);
  }

  getDueSoonRequests(daysAhead: number): BookRequest[] {
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + daysAhead);
    return this.getRequests().filter(r => {
      if (r.type !== 'borrow' || r.status !== 'approved' || !r.dueDate) return false;
      const d = new Date(r.dueDate);
      return d >= now && d <= future;
    });
  }
}
