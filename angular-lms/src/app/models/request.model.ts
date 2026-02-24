export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue' | 'extension_requested';
export type RequestType = 'borrow' | 'return' | 'extension';

export interface BookRequest {
  id: string;
  requestId: string; // LMS-2025-0001 format
  memberId: string;
  memberEmail: string;
  bookId: string;
  bookTitle: string;
  type: RequestType;
  status: RequestStatus;
  requestedAt: string;
  approvedAt?: string;
  dueDate?: string;
  returnedAt?: string;
  extensionRequested?: boolean;
  extensionApproved?: boolean;
  fineAmount?: number;
  finePaid?: boolean;
}
