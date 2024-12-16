import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cards } from '../../model/cards';
import { CardsService } from '../../services/cards.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  userCards: Cards[] = [];
  flipped: boolean = false;
  frontSide: boolean = true;
  backSide: boolean = false;

  creditfrontSide: boolean = true;
  creditbackSide: boolean = false;

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

  flipCard() {
    this.frontSide = !this.frontSide;
    this.backSide = !this.backSide;
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
}
