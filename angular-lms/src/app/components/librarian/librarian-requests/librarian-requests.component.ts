import { Component, OnInit } from '@angular/core';
import { BookRequest } from '../../../models/request.model';
import { RequestService } from '../../../services/request.service';

@Component({
  selector: 'app-librarian-requests',
  templateUrl: './librarian-requests.component.html',
  styleUrls: ['./librarian-requests.component.scss']
})
export class LibrarianRequestsComponent implements OnInit {
  borrowRequests: BookRequest[] = [];
  returnRequests: BookRequest[] = [];
  extensionRequests: BookRequest[] = [];

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const all = this.requestService.getAllRequests();
    this.borrowRequests = all.filter(r => r.type === 'borrow' && r.status === 'pending');
    this.returnRequests = all.filter(r => r.type === 'return' && r.status === 'pending');
    this.extensionRequests = all.filter(r => r.extensionRequested);
  }

  approveBorrow(id: string): void {
    this.requestService.approveBorrow(id);
    this.load();
  }

  rejectRequest(id: string): void {
    this.requestService.rejectRequest(id);
    this.load();
  }

  processReturn(id: string): void {
    this.requestService.processReturn(id);
    this.load();
  }

  approveExtension(id: string): void {
    this.requestService.approveExtension(id);
    this.load();
  }

  rejectExtension(id: string): void {
    this.requestService.rejectExtension(id);
    this.load();
  }
}
