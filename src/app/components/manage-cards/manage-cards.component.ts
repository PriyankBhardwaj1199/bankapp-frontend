import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards.service';
import { AdminService } from '../../services/admin.service';
import { Cards } from '../../model/cards';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { CardRequest } from '../../model/card-request';
import { Statistics } from '../../model/statistics';

@Component({
  selector: 'app-manage-cards',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './manage-cards.component.html',
  styleUrl: './manage-cards.component.css'
})
export class ManageCardsComponent implements OnInit{

  statistics!:Statistics;

  userCards: Cards[] = [];
  pendingApprovalCards: Cards[] = [];
  currentPage: number = 1; // The current page
  itemsPerPage: number = 6; // Items per page
  totalItems: number = 0;
  currentPageUser: number = 1; // The current page
  itemsPerPageUser: number = 6; // Items per page
  totalItemsUser: number = 0;
  showActionDropdown: boolean[] = [];
  showActionDropdownUserCards: boolean[] = [];
  cardRequest: CardRequest = new CardRequest();

  constructor(private adminService: AdminService,private alertService:AlertService,private router:Router,private cardsService:CardsService){}
  
  ngOnInit(): void {
    this.adminService
      .getAllCards()
      .subscribe(
        (response) => {
          this.pendingApprovalCards = response.filter((value)=>{
              value.cardStatus === 'REQUESTED'
          });
          this.userCards = response;
          this.showActionDropdown = Array(this.pendingApprovalCards.length).fill(false);
          this.showActionDropdownUserCards = Array(response.length).fill(false);
          this.totalItemsUser = response.length;
          this.totalItems = this.pendingApprovalCards.length;
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

  getDate(inputDate: string) {
    const date = new Date(inputDate);

    // Format the date and time components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Combine into desired format
    return `${month}/${year}`;
  }

  get totalPagesUser(): number {
    return Math.ceil(this.totalItemsUser / this.itemsPerPageUser);
  }

  // Get the cards to display for the current page
  get currentUserCards(): any[] {
    const startIndex = (this.currentPageUser - 1) * this.itemsPerPageUser;
    return this.userCards.slice(startIndex, startIndex + this.itemsPerPageUser);
  }

  // Method to handle page change
  setPageUser(page: number) {
    this.currentPageUser= page;
  }

  // Handle previous page
  prevPageUser() {
    if (this.currentPageUser > 1) {
      this.currentPageUser--;
    }
  }

  // Handle next page
  nextPageUser() {
    if (this.currentPageUser < this.totalPagesUser) {
      this.currentPageUser++;
    }
  }

  get rangeStartUser(): number {
    return (this.currentPageUser - 1) * this.itemsPerPageUser + 1;
  }

  get rangeEndUser(): number {
    return Math.min(this.currentPageUser * this.itemsPerPageUser, this.totalItemsUser);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Get the transactions to display for the current page
  get currentCards(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.pendingApprovalCards.slice(startIndex, startIndex + this.itemsPerPage);
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

  toggleActionDropdown(index: number) {
    this.showActionDropdown.forEach((_,i)=>{
      if(i===index){
        this.showActionDropdown[index] = !this.showActionDropdown[index];
      } else {
        this.showActionDropdown[i] = false;
      }
    })
  }
  toggleActionDropdownUserCards(index: number) {
    this.showActionDropdownUserCards.forEach((_,i)=>{
      if(i===index){
        this.showActionDropdownUserCards[index] = !this.showActionDropdownUserCards[index];
      } else {
        this.showActionDropdownUserCards[i] = false;
      }
    })
  }

  revokeCard(card: Cards) {
    this.cardRequest.accountNumber =
    card.accountNumber;
    this.cardRequest.cardNumber = card.cardNumber;
    this.adminService.cardAction(this.cardRequest,'REVOKE').subscribe(
      (response) => {
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
      }
    );
  }

  blockCard(card: Cards) {
    this.cardRequest.accountNumber =
      card.accountNumber;
    this.cardRequest.cardNumber = card.cardNumber;
    this.adminService.cardAction(this.cardRequest,'BLOCK').subscribe(
      (response) => {
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
          window.location.reload();
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
      }
    );
  }

  unblockCard(card: Cards) {
    this.cardRequest.accountNumber =
      card.accountNumber;
    this.cardRequest.cardNumber = card.cardNumber;
    this.adminService.cardAction(this.cardRequest,'ACTIVATE').subscribe(
      (response) => {
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
          window.location.reload();
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
      }
    );
  }

  approveCard(card: Cards) {
    this.cardRequest.accountNumber =
      card.accountNumber;
    this.cardRequest.cardNumber = card.cardNumber;
    this.adminService.cardAction(this.cardRequest,'ACTIVATE').subscribe(
      (response) => {
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
          window.location.reload();
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
      }
    );
  }

  deactivateCard(card: Cards) {
    this.cardRequest.accountNumber =
      card.accountNumber;
    this.cardRequest.cardNumber = card.cardNumber;
    this.adminService.cardAction(this.cardRequest,'INACTIVATE').subscribe(
      (response) => {
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
          window.location.reload();
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
      }
    );
  }

  deleteCard(card: Cards) {
    this.cardRequest.accountNumber =
      card.accountNumber;
    this.cardRequest.cardNumber = card.cardNumber;
    this.adminService.cardAction(this.cardRequest,'DELETE').subscribe(
      (response) => {
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
          window.location.reload();
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
      }
    );
  }

  expireCard(card: Cards) {
    this.cardRequest.accountNumber =
      card.accountNumber;
    this.cardRequest.cardNumber = card.cardNumber;
    this.adminService.cardAction(this.cardRequest,'EXPIRE').subscribe(
      (response) => {
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
          window.location.reload();
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
      }
    );
  }
  
}
