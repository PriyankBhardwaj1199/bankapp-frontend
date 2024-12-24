import { Component, OnInit, ViewChild } from '@angular/core';
import { Statistics } from '../../model/statistics';
import { AdminService } from '../../services/admin.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { BreadcrumService } from '../../services/breadcrum.service';
import { Observable } from 'rxjs';
import { Cards } from '../../model/cards';
import { CardsService } from '../../services/cards.service';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { NgIf } from '@angular/common';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgApexchartsModule,NgIf],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  public chartOptionsCards!: Partial<ChartOptions>;
  public chartOptionsApprovals!: Partial<ChartOptions>;

  breadcrumbs$!: Observable<{ label: string; url: string }[]>;
  statistics!:Statistics;
  userCards: Cards[] = [];
  
  constructor(private adminService:AdminService,private alertService:AlertService,private router:Router,private breadcrumbService: BreadcrumService,private cardsService: CardsService){}
  
  ngOnInit(): void {
    this.breadcrumbs$ = this.breadcrumbService.getBreadcrumbs();
    this.adminService.getStatistics().subscribe((response)=>{
      this.statistics=response;

      this.chartOptions = {
        series: [
          this.statistics.activeUsers,
          this.statistics.inactiveUsers,
          this.statistics.suspendedUsers,
          this.statistics.closedAccounts,
        ],
        chart: {
          type: 'donut',
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 5,
            opacity: 0.6,
          },
        },
        labels: ['Active Accounts', 'In-active Accounts', 'Suspended Accounts', 'Closed Accounts'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };

      this.chartOptionsCards = {
        series: [
          this.statistics.activeCreditCards,
          this.statistics.activeDebitCards,
          this.statistics.inactiveCreditCards,
          this.statistics.inactiveDebitCards,
        ],
        chart: {
          type: 'donut',
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 5,
            opacity: 0.6,
          },
        },
        labels: ['Active Credit Cards', 'Active Debit Cards', 'In-active Credit Cards', 'In-active Debit Cards'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };

      this.chartOptionsApprovals = {
        series: [
          this.statistics.pendingCardApprovals,
          this.statistics.pendingAccountApprovals,
        ],
        chart: {
          width:330,
          height:330,
          type: 'donut',
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 5,
            opacity: 0.6,
          },
        },
        labels: ['Pending Card Approvals', 'Pending Account Approvals'],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };
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
