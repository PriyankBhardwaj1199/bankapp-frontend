import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject = new Subject<{ message: string; type: string; duration: number }>();
  alert$ = this.alertSubject.asObservable();

  // Method to trigger an alert
  showAlert(message: string, type: string, duration: number = 2000): void {
    this.alertSubject.next({ message, type, duration });
  }
}
