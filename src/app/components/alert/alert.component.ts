import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass,NgIf],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnInit{
  @Input() message: string = '';
  @Input() type: string = '';
  duration: number = 2000;

  showAlert: boolean = false;

  constructor(private alertService: AlertService){}

  ngOnInit(): void {
    this.alertService.alert$.subscribe(alert => {
      this.message = alert.message;
      this.type = alert.type;
      this.duration = alert.duration;
      this.showAlert = true;

      // Hide alert after the specified duration
      setTimeout(() => {
        this.showAlert = false;
      }, this.duration);
    });
  }

  // Dynamic class based on alert type
  get alertClass(): string {
    switch (this.type) {
      case 'success':
        return 'flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-500 dark:text-green-400';
      case 'error':
        return 'flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-500 dark:text-red-400';
      case 'warning':
        return 'flex items-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-500 dark:text-yellow-300';
      case 'info':
      default:
        return 'flex items-center p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-500 dark:text-blue-400';
    }
  }
}
