import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Transaction } from '../../model/transaction';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [NgFor,ReactiveFormsModule,FormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: any[] = [];
  currentPage: number = 1;  // The current page
  itemsPerPage: number = 10; // Items per page
  totalItems: number = 0;
  searchTerm:string = '';

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService
      .fetchTransactions(localStorage.getItem('accountNumber') ?? '')
      .subscribe(
        (response) => {
          this.transactions = response;
          this.totalItems = response.length;
          this.filteredTransactions = [...this.transactions];
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

  getDate(inputDate: string) {
    const date = new Date(inputDate);

    // Format the date and time components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Combine into desired format
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  handleDelete(transactionId: string) {
    this.userService.deleteTransaction(transactionId).subscribe(
      (response) => {
        if (response.responseCode === 200) {
          this.alertService.showAlert(response.responseMessage, 'success');
          setTimeout(() => {
            window.location.reload();
            
          }, 2000);
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
          this.alertService.showAlert(
            'You have been logged out. Please login again.',
            'info'
          );
          this.router.navigate(['/login']);
        }
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Get the transactions to display for the current page
  get currentTransactions(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.transactions.slice(startIndex, startIndex + this.itemsPerPage);
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

  // filter funtionality
  get filteredTransactionsList(): any[] {
    return this.filteredTransactions.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

   // Update filteredTransactions when the search term changes
   updateFilteredTransactions() {
    console.log("inside update")
    if (this.searchTerm) {
      console.log("inside if")
      this.filteredTransactions = this.transactions.filter(transaction => 
        transaction.transactionId?.includes(this.searchTerm) || 
        this.getDate(transaction.createdAt?.toString()??'').includes(this.searchTerm) ||
        transaction.transactionType?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.amount?.toString().includes(this.searchTerm)
      );
      console.log(this.filteredTransactions)
    } else {
      this.filteredTransactions = [...this.transactions];
    }
    this.currentPage = 1;  // Reset to first page when search is updated
  }
}
