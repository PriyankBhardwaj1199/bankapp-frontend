import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cards } from '../../model/cards';
import { CardsService } from '../../services/cards.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [NgFor, NgClass,CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  showActionDropdown:boolean[] = [];
  searchTerm!: string;
  userCards: Cards[] = [];
  flippedCards: boolean[] = [];
  hasCards:boolean = false;
  currentPage: number = 1; // The current page
  itemsPerPage: number = 6; // Items per page
  totalItems: number = 0;


  constructor(
    private cardsService: CardsService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.cardsService
      .getCardsByAccountNumber(localStorage.getItem('accountNumber') ?? '')
      .subscribe(
        (response) => {
          this.userCards = response;
          this.flippedCards = Array(response.length).fill(false);
          this.showActionDropdown = Array(response.length).fill(false);
          this.totalItems = response.length;
          if(this.userCards.length>0){
            this.hasCards=true;
          }
        },
        (error) => {
          if (error.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            localStorage.removeItem('accountNumber');
            localStorage.removeItem('isLoggedIn');
            this.alertService.showAlert(
              'You have been logged out. Please login again.',
              'info'
            );

            this.router.navigate(['/login']);
          }
        }
      );
  }

  flipCard(index:number) {
    this.flippedCards[index] = !this.flippedCards[index];
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

  formatCardNumber(cardNumber: string | undefined): string {
    if (!cardNumber) return '';
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Get the transactions to display for the current page
  get currentStateents(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.userCards.slice(startIndex, startIndex + this.itemsPerPage);
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

  toggleActionDropdown(index:number){
    this.showActionDropdown[index]=!this.showActionDropdown[index];
  }

}
