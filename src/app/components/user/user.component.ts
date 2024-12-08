import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumService } from '../../services/breadcrum.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgIf],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {


  greeting: string;
  hasCards:boolean = true;
  hasTransactions:boolean = true;
  hasTransfers:boolean = true;
  showUpdateModal:boolean = false;
  
  breadcrumbs$!: Observable<{ label: string; url: string }[]>;

  constructor(private breadcrumbService:BreadcrumService,private router: Router) {
    this.greeting = this.getGreeting();
  }

  getGreeting(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  ngOnInit() {
    this.breadcrumbs$ = this.breadcrumbService.getBreadcrumbs();
  }

  onMenuItemSelect(menu: string) {
    console.log(this.breadcrumbs$);
    switch (menu) {
      case 'Transactions':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({ label: 'Transactions', url: '/dashboard/transactions' });
        this.router.navigate(['/dashboard/transactions']);
        break;
      case 'Transfer':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({ label: 'Transfer', url: '/dashboard/transfer' });
        this.router.navigate(['/dashboard/transfer']);
        break;
      case 'Bank Statement':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({ label: 'Bank Statements', url: '/dashboard/bankstatement' });
        this.router.navigate(['/dashboard/bankstatement']);
        break;
      case 'Cards':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({ label: 'Cards', url: '/dashboard/cards' });
        this.router.navigate(['/dashboard/cards']);
        break;
    }
  }

  toggleUpdateModal(){
    this.showUpdateModal=!this.showUpdateModal;
  }

}
