import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumService {
  constructor(private router: Router) {}

  private breadcrumbs: Breadcrumb[] = [];

  setInitalBreadcrum(): void {
    switch (this.router.url) {
      case '/dashboard/user-dashboard':
        this.breadcrumbs = [
          { label: 'Dashboard', url: '/dashboard/user-dashboard' },
        ];
        break;
      case '/dashboard/admin-dashboard':
        this.breadcrumbs = [
          { label: 'Dashboard', url: '/dashboard/admin-dashboard' },
        ];
        break;
      case '/dashboard/transactions':
        this.breadcrumbs = [
          { label: 'Transactions', url: '/dashboard/transactions' },
        ];
        break;
      case '/dashboard/cards':
        this.breadcrumbs = [{ label: 'Cards', url: '/dashboard/cards' }];
        break;
      case '/dashboard/bankstatement':
        this.breadcrumbs = [
          { label: 'Bank Statement', url: '/dashboard/bankstatement' },
        ];
        break;
    }
    this.breadcrumbSubject.next(this.breadcrumbs);
  }

  private breadcrumbSubject = new BehaviorSubject<Breadcrumb[]>(
    this.breadcrumbs
  );

  getBreadcrumbs() {
    return this.breadcrumbSubject.asObservable();
  }

  addBreadcrumb(breadcrumb: Breadcrumb) {
    this.breadcrumbs.push(breadcrumb);
    this.breadcrumbSubject.next(this.breadcrumbs);
  }

  removeBreadcrumb() {
    this.breadcrumbs.pop();
    this.breadcrumbSubject.next(this.breadcrumbs);
  }

  clearBreadcrumbs() {
    this.breadcrumbs = [];
    this.breadcrumbSubject.next(this.breadcrumbs);
  }
}
