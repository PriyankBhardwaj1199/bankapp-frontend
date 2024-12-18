import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cards } from '../../model/cards';
import { CardsService } from '../../services/cards.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { CardRequest } from '../../model/card-request';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [NgFor, NgClass, CommonModule, ReactiveFormsModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  showPinModal: boolean = false;
  showApplyModal: boolean = false;
  showActionDropdown: boolean[] = [];
  searchTerm!: string;
  userCards: Cards[] = [];
  selectedCard!: Cards;
  appliedCard!: string | null;
  flippedCards: boolean[] = [];
  generatePinForm!: FormGroup;
  applyCardForm!: FormGroup;
  cardRequest: CardRequest = new CardRequest();
  hasCards: boolean = false;
  currentPage: number = 1; // The current page
  itemsPerPage: number = 6; // Items per page
  totalItems: number = 0;

  constructor(
    private cardsService: CardsService,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
    this.generatePinForm = formBuilder.group({
      pin: this.formBuilder.group({
        digit1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
        digit2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
        digit3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
        digit4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      }),
    });

    this.applyCardForm = formBuilder.group({
      cardType: ['', [Validators.required]],
      cardSubType: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cardsService
      .getCardsByAccountNumber(localStorage.getItem('accountNumber') ?? '')
      .subscribe(
        (response) => {
          this.userCards = response;
          this.flippedCards = Array(response.length).fill(false);
          this.showActionDropdown = Array(response.length).fill(false);
          this.totalItems = response.length;
          if (this.userCards.length > 0) {
            this.hasCards = true;
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

  flipCard(index: number) {
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

  toggleActionDropdown(index: number) {
    this.showActionDropdown[index] = !this.showActionDropdown[index];
  }

  revokeCard(card: Cards) {
    this.cardRequest.accountNumber =
      localStorage.getItem('accountNumber') ?? '';
    this.cardRequest.cardNumber = card.cardNumber;
    this.cardsService.revokeCard(this.cardRequest).subscribe(
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
      localStorage.getItem('accountNumber') ?? '';
    this.cardRequest.cardNumber = card.cardNumber;
    this.cardsService.blockCard(this.cardRequest).subscribe(
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

  generatePin(card: Cards) {
    if (this.generatePinForm.valid) {
      const pinGroup = this.generatePinForm.get('pin') as FormGroup;
      const pin = Object.values(pinGroup.value).join('');
      console.log(pin);
      this.cardRequest.accountNumber =
        localStorage.getItem('accountNumber') ?? '';
      this.cardRequest.cardNumber = card.cardNumber;
      this.cardRequest.cardPin = pin;
      this.cardsService.generatePin(this.cardRequest).subscribe(
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

  applyCard() {
    if (this.applyCardForm.valid) {
      this.cardRequest.accountNumber =
        localStorage.getItem('accountNumber') ?? '';
      this.cardRequest.name = localStorage.getItem('name') ?? '';
      this.cardRequest.cardType = this.applyCardForm.get('cardType')?.value;
      this.cardRequest.cardSubType =
        this.applyCardForm.get('cardSubType')?.value;
      this.cardsService.applyCard(this.cardRequest).subscribe(
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

  unblockCard(card: Cards) {
    this.cardRequest.accountNumber =
      localStorage.getItem('accountNumber') ?? '';
    this.cardRequest.cardNumber = card.cardNumber;
    this.cardsService.unBlockCard(this.cardRequest).subscribe(
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

  togglePinModal(card: Cards) {
    this.showPinModal = !this.showPinModal;
    if (this.showPinModal) {
      this.selectedCard = card;
    } else {
      this.selectedCard = new Cards();
    }
  }

  toggleApplyModal(card: string | null) {
    this.showApplyModal = !this.showApplyModal;
    this.appliedCard = card;
    if (this.showApplyModal && card !== null) {
      this.applyCardForm.patchValue({ cardType: card, cardSubType: '' });
    }
  }

  onInputChange(event: Event, nextInputId: string | null) {
    const target = event.target as HTMLInputElement;
    console.log(target.value.length);

    // Handle auto-focus on the next input when a digit is entered
    if (target.value.length === 1 && nextInputId) {
      const nextInput = document.getElementById(
        nextInputId
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, prevInputId: string | null) {
    const target = event.target as HTMLInputElement;

    // Check if Backspace or Delete is pressed
    if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      target.value.length === 0 &&
      prevInputId
    ) {
      const prevInput = document.getElementById(
        prevInputId
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  }

  handleApplyModal(): void {
    const cardType = this.hasCards
      ? this.userCards.length === 1 && this.userCards[0].cardType === 'Debit'
        ? 'Credit'
        : 'Debit'
      : null;

    this.toggleApplyModal(cardType);
  }

  getCardType(): string {
    if (!this.hasCards) {
      return '';
    }
    return this.userCards.length === 1 && this.userCards[0].cardType === 'Debit'
      ? 'Credit'
      : 'Debit';
  }
}
