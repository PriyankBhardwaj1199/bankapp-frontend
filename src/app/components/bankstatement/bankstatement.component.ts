import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { BankstatementService } from '../../services/bankstatement.service';
import { BankStatement } from '../../model/bank-statement';
import { BankStatementDto } from '../../model/bank-statement-dto';

@Component({
  selector: 'app-bankstatement',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './bankstatement.component.html',
  styleUrl: './bankstatement.component.css',
})
export class BankstatementComponent implements OnInit {
  searchTerm!: string;
  showStatementModal: boolean = false;
  statements: BankStatement[] = [];
  filteredStatements: BankStatement[] = [];
  generateStatementForm!: FormGroup;
  bankStatementDto: BankStatementDto = new BankStatementDto();

  currentPage: number = 1; // The current page
  itemsPerPage: number = 6; // Items per page
  totalItems: number = 0;
  pdfUrls: { [id: number]: string } = {};

  constructor(
    private bankStatementService: BankstatementService,
    private alertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.generateStatementForm = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.bankStatementService
      .getStatementsByAccountNumber(localStorage.getItem('accountNumber') ?? '')
      .subscribe(
        (response) => {
          this.statements = response;
          this.filteredStatements = [...this.statements];
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

  handleDelete(id: number) {
    this.bankStatementService
      .deleteStatement(localStorage.getItem('accountNumber') ?? '', id)
      .subscribe(
        (response) => {
          this.alertService.showAlert(response.responseMessage, 'success');
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
            this.alertService.showAlert(
              'You have been logged out. Please login again.',
              'info'
            );
            this.router.navigate(['/login']);
          }
        }
      );
  }

  handleDownload(id: any) {
    this.bankStatementService
      .downloadStatement(localStorage.getItem('accountNumber') ?? '', id)
      .subscribe(
        (response: Blob) => {
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.target = '_blank';
          a.href = url;
          a.click();
          window.URL.revokeObjectURL(url);
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

  onSubmit() {
    if (this.generateStatementForm.valid) {
      this.bankStatementDto.accountNumber =
        localStorage.getItem('accountNumber') ?? '';
      this.bankStatementDto.startDate =
        this.generateStatementForm.get('startDate')?.value;
      this.bankStatementDto.endDate =
        this.generateStatementForm.get('endDate')?.value;

      this.bankStatementService
        .generateStatement(this.bankStatementDto)
        .subscribe(
          (response) => {
            if (response.responseCode === 200) {
              this.alertService.showAlert(response.responseMessage, 'success');
            } else if (response.responseCode === 404) {
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
  }

  get totalPages(): number {
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
}
