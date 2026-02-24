import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:8082/api/membership';

export interface MembershipApplyRequest {
  userId: string;
  membershipType: string;
}

export interface MembershipApplyResponse {
  message: string;
  processInstanceKey: string;
}

@Injectable({ providedIn: 'root' })
export class MembershipApiService {
  constructor(private http: HttpClient) {}

  applyMembership(
    userId: string,
    membershipType: string,
  ): Observable<MembershipApplyResponse> {
    const body: MembershipApplyRequest = { userId, membershipType };
    return this.http.post<MembershipApplyResponse>(`${API_BASE}/apply`, body);
  }
}
