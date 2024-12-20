import { Component, OnInit } from '@angular/core';
import { Statistics } from '../../model/statistics';
import { AdminService } from '../../services/admin.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { BreadcrumService } from '../../services/breadcrum.service';
import { Observable } from 'rxjs';
import { Cards } from '../../model/cards';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  breadcrumbs$!: Observable<{ label: string; url: string }[]>;
  statistics!:Statistics;
  userCards: Cards[] = [];
  
  constructor(private adminService:AdminService,private alertService:AlertService,private router:Router,private breadcrumbService: BreadcrumService,private cardsService: CardsService){}
  
  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbService.getBreadcrumbs();
    this.adminService.getStatistics().subscribe((response)=>{
      this.statistics=response;
    },
    (error) => {
      if (error.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('accountNumber');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('name');
        this.alertService.showAlert(
          'You have been logged out. Please login again.',
          'info'
        );

        this.router.navigate(['/login']);
      }
    })
  }


}
