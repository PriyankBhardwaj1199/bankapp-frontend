import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { BankstatementService } from '../../services/bankstatement.service';
import { BankStatement } from '../../model/bank-statement';

@Component({
  selector: 'app-bankstatement',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './bankstatement.component.html',
  styleUrl: './bankstatement.component.css',
})
export class BankstatementComponent implements OnInit {
  searchTerm!: string;
  showStatementModal: boolean = false;
  statements: BankStatement[] = [];
  filteredStatements: BankStatement[] = [];

  currentPage: number = 1; // The current page
  itemsPerPage: number = 6; // Items per page
  totalItems: number = 0;
  pdfUrls: { [id: number]: string } = {};

  constructor(
    private bankStatementService: BankstatementService,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.bankStatementService
      .getStatementsByAccountNumber(localStorage.getItem('accountNumber') ?? '')
      .subscribe((response) => {
        console.log(response);
        this.statements = response;
        this.filteredStatements = [...this.statements];
        this.totalItems = response.length;
      });
  }

  // base64ToBlob(base64: string, mimeType: string): Blob {
  //   const byteCharacters = atob(base64);
  //   const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  //   const byteArray = new Uint8Array(byteNumbers);
  //   return new Blob([byteArray], { type: mimeType });
  // }

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

  handleDelete(transactionId: string) {}

  get totalPages(): number {
    console.log(Math.ceil(this.totalItems / this.itemsPerPage));
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Get the transactions to display for the current page
  get currentStateents(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.statements.slice(startIndex, startIndex + this.itemsPerPage);
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
  get filteredStatementsList(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredStatements.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  // Update filteredStatements when the search term changes
  updateFilteredStatements() {
    if (this.searchTerm) {
      this.filteredStatements = this.filteredStatements.filter((statement) =>
        this.getDate(statement.createdOn?.toString() ?? '').includes(
          this.searchTerm
        )
      );
    } else {
      this.filteredStatements = [...this.statements];
    }
    this.currentPage = 1; // Reset to first page when search is updated
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  allowOnlyAlphanumeric(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Delete',
    ];
    if (!/^[a-zA-Z0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  toggleTransactionModal() {
    this.showStatementModal = !this.showStatementModal;
  }

  handleDownload(id: any) {
    this.bankStatementService.downloadStatement(localStorage.getItem('accountNumber')??'',id).subscribe((response:Blob)=>{
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = url;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }
}
