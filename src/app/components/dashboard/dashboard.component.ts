import { Component } from '@angular/core';
import { SliderComponent } from "../slider/slider.component";
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreadcrumService } from '../../services/breadcrum.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SliderComponent,NgIf,RouterOutlet,RouterLink,RouterLinkActive,NgFor,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  blurTimeout: any;
  breadcrumbs$!: Observable<{ label: string; url: string }[]>;
  showModal:boolean = false;
  constructor(private breadcrumbService: BreadcrumService, private router: Router) {}

  showUserDropDown: boolean = false;

  ngOnInit() {
    this.breadcrumbs$ = this.breadcrumbService.getBreadcrumbs();
  }

  toggleDropDown(){
    this.showUserDropDown=!this.showUserDropDown;
  }

  onMenuItemSelect(menu: string) {
    console.log(this.breadcrumbs$);
    switch (menu) {
      case 'Dashboard':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({ label: 'Dashboard', url: '/dashboard/user-dashboard' });
        this.router.navigate(['/dashboard/user-dashboard']);
        break;
      case 'Accounts':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({ label: 'Accounts', url: '/dashboard/accounts' });
        this.router.navigate(['/dashboard/accounts']);
        break;
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

  toggleModal(){
    this.showModal=!this.showModal;
  }

  logout(){
    this.router.navigate(['/home']);
  }

  handleBlur() {
    // Clear any existing timeout to prevent multiple calls
    clearTimeout(this.blurTimeout);
  
    // Set a timeout to delay the dropdown toggle
    this.blurTimeout = setTimeout(() => {
      this.toggleDropDown();
    }, 500);
  }

}
