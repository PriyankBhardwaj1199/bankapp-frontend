import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { AlertService } from '../../services/alert.service';
import { CardsService } from '../../services/cards.service';
import { User } from '../../model/user';
import { Statistics } from '../../model/statistics';
import { NgFor, NgIf } from '@angular/common';
import { FetchAccount } from '../../model/fetch-account';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent {
  users: User[] = [];
  statistics!: Statistics;
  showActionDropdown: boolean[] = [];
  fetchAccount: FetchAccount = new FetchAccount();
  currentPage: number = 1; // The current page
  itemsPerPage: number = 6; // Items per page
  totalItems: number = 0;

  constructor(
    private adminService: AdminService,
    private alertService: AlertService,
    private router: Router,
    private cardsService: CardsService
  ) {}

  ngOnInit(): void {
    this.adminService.getAllAccounts().subscribe(
      (response) => {
        this.users = response;
        this.showActionDropdown = Array(this.users.length).fill(false);
        this.totalItems = response.length;
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
      }
    );

    this.adminService.getStatistics().subscribe(
      (response) => {
        this.statistics = response;
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
      }
    );
  }

  toggleActionDropdown(index: number) {
    this.showActionDropdown.forEach((_,i)=>{
      if(i===index){
        this.showActionDropdown[index] = !this.showActionDropdown[index];
      } else {
        this.showActionDropdown[i] = false;
      }
    })
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Get the transactions to display for the current page
  get currentUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.users.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Method to handle page change
  setPage(page: number) {
    this.currentPage = page;
  }

  // Handle previous page
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Handle next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get rangeStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  closeAccount(user: User) {

    this.fetchAccount.accountNumber = user.accountNumber ?? '';
    this.fetchAccount.email = user.email ?? '';

    this.adminService.accountAction(this.fetchAccount,"CLOSE").subscribe((response)=>{
      if (response.responseCode === 200) {
        this.alertService.showAlert(response.responseMessage, 'success');
      } else if (
        response.responseCode === 404 ||
        response.responseCode === 409
      ) {
        this.alertService.showAlert(response.responseMessage, 'info');
      } else {
        this.alertService.showAlert(response.responseMessage, 'error');
      }

      setTimeout(() => {
        window.location.reload()
      }, 3000);
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
  suspendAccount(user: User) {
    this.fetchAccount.accountNumber = user.accountNumber ?? '';
    this.fetchAccount.email = user.email ?? '';

    this.adminService.accountAction(this.fetchAccount,"SUSPEND").subscribe((response)=>{
      if (response.responseCode === 200) {
        this.alertService.showAlert(response.responseMessage, 'success');
      } else if (
        response.responseCode === 404 ||
        response.responseCode === 409
      ) {
        this.alertService.showAlert(response.responseMessage, 'info');
      } else {
        this.alertService.showAlert(response.responseMessage, 'error');
      }

      setTimeout(() => {
        window.location.reload()
      }, 3000);
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
  deleteAccount(user: User) {
    this.fetchAccount.accountNumber = user.accountNumber ?? '';
    this.fetchAccount.email = user.email ?? '';

    this.adminService.accountAction(this.fetchAccount,"DELETE").subscribe((response)=>{
      if (response.responseCode === 200) {
        this.alertService.showAlert(response.responseMessage, 'success');
      } else if (
        response.responseCode === 404 ||
        response.responseCode === 409
      ) {
        this.alertService.showAlert(response.responseMessage, 'info');
      } else {
        this.alertService.showAlert(response.responseMessage, 'error');
      }

      setTimeout(() => {
        window.location.reload()
      }, 3000);
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
  deActivateAccount(user: User) {
    this.fetchAccount.accountNumber = user.accountNumber ?? '';
    this.fetchAccount.email = user.email ?? '';

    this.adminService.accountAction(this.fetchAccount,"DEACTIVATE").subscribe((response)=>{
      if (response.responseCode === 200) {
        this.alertService.showAlert(response.responseMessage, 'success');
      } else if (
        response.responseCode === 404 ||
        response.responseCode === 409
      ) {
        this.alertService.showAlert(response.responseMessage, 'info');
      } else {
        this.alertService.showAlert(response.responseMessage, 'error');
      }

      setTimeout(() => {
        window.location.reload()
      }, 3000);
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
  approveAccount(user: User) {
    this.fetchAccount.accountNumber = user.accountNumber ?? '';
    this.fetchAccount.email = user.email ?? '';

    this.adminService.accountAction(this.fetchAccount,"ACTIVATE").subscribe((response)=>{
      if (response.responseCode === 200) {
        this.alertService.showAlert(response.responseMessage, 'success');
      } else if (
        response.responseCode === 404 ||
        response.responseCode === 409
      ) {
        this.alertService.showAlert(response.responseMessage, 'info');
      } else {
        this.alertService.showAlert(response.responseMessage, 'error');
      }

      setTimeout(() => {
        window.location.reload()
      }, 3000);
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
