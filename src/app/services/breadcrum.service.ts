import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumService {

  constructor() { }

  private breadcrumbs: Breadcrumb[] = [{ label: 'Dashboard', url: '/dashboard/user-dashboard' }];
  private breadcrumbSubject = new BehaviorSubject<Breadcrumb[]>(this.breadcrumbs);

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
