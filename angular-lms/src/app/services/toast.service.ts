import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private show(message: string, type: Toast['type'], duration = 4000): void {
    const toast: Toast = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      message,
      type,
      duration,
    };
    const current = this.toastsSubject.value;
    this.toastsSubject.next([...current, toast]);

    setTimeout(() => this.dismiss(toast.id), duration);
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  danger(message: string, duration?: number): void {
    this.show(message, 'danger', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: string): void {
    const current = this.toastsSubject.value.filter((t) => t.id !== id);
    this.toastsSubject.next(current);
  }
}
