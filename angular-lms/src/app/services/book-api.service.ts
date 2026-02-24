import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:8082/api';

export interface ApiBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  createdAt: string;
  [key: string]: any; // allow extra fields from the backend
}

@Injectable({ providedIn: 'root' })
export class BookApiService {
  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<ApiBook[]> {
    return this.http.get<ApiBook[]>(`${API_BASE}/books`);
  }
}
