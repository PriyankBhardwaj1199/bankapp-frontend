import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction } from '../../model/transaction';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  NgApexchartsModule, 
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexYAxis
} from 'ng-apexcharts';
import { CreditDebitRequest } from '../../model/credit-debit';
import { TransferRequest } from '../../model/transfer-request';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis:ApexYAxis;
};

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [NgFor, NgIf,NgClass,ReactiveFormsModule, FormsModule, NgApexchartsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  
  showTransactionModal:boolean = false;
  transactions: Transaction[] = [];
  currentPage: number = 1; // The current page
  itemsPerPage: number = 6; // Items per page
  totalItems: number = 0;
  searchTerm: string = '';
  transfers: number = 0;
  payments: number = 0;
  deposits: number = 0;
  withdrawals: number = 0;
  selectedOption!:string;
  creditDebitDto:CreditDebitRequest = new CreditDebitRequest();
  transferDto:TransferRequest = new TransferRequest();
  filteredTransactions: any[] = [];
  transactionForm!:FormGroup;
  
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>; 
  public chartOptionsDate!: Partial<ChartOptions>; 
  public chartOptionsAmount!: Partial<ChartOptions>; 
  
  
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private router: Router,
    private formBuilder:FormBuilder
  ) {
    this.transactionForm = this.formBuilder.group({
      amount:['',[Validators.required]],
      destinationAccountNumber:[''],
      transactionType:['',[Validators.required]]
    });
   
    this.transactionForm.get('transactionType')?.valueChanges.subscribe((value) => {
      const recipientControl = this.transactionForm.get('destinationAccountNumber');
      this.selectedOption = value;
      if (value === 'Transfer') {
        recipientControl?.setValidators([Validators.required,this.accountNumberValidator,Validators.minLength(12),Validators.maxLength(12)]);
      } else {
        recipientControl?.clearValidators();
      }
      recipientControl?.updateValueAndValidity(); // Recalculate the validation status
    });
  }

  accountNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';

    const errors: ValidationErrors = {};
    
    // Rule 1: First 2 characters should be letters
    if (!/^[A-Za-z]{2}/.test(value)) {
      errors['noLetterStarting'] = 'First two letters of the account number should be alphabets';
    }

    // Rule 2: 10 digits
    if (!/\d{10}$/.test(value)) {
      errors['noTenDigit'] = 'Account number must contain 10 digits';
    }


    return Object.keys(errors).length ? errors : null;
  }

  ngOnInit(): void {

    this.userService
      .fetchTransactions(localStorage.getItem('accountNumber') ?? '')
      .subscribe(
        (response) => {
          this.transactions = response;
          this.totalItems = response.length;
          this.filteredTransactions = [...this.transactions];
          const quarterCounts: { [key: string]: number } = {
            Q1: 0, // January - March
            AQ1:0,
            Q2: 0, // April - June
            AQ2:0,
            Q3: 0, // July - September
            AQ3:0,
            Q4: 0, // October - December
            AQ4:0,

          };
          this.transactions.forEach((transaction)=>{
            if(transaction.transactionType==='Deposit'){
              this.deposits += transaction.amount ?? 0;
            } else if(transaction.transactionType==='Payment'){
              this.payments += transaction.amount ?? 0;
            } else if(transaction.transactionType === 'Transfer'){
              this.transfers += transaction.amount ?? 0;
            } else if(transaction.transactionType === 'Withdrawal'){
              this.withdrawals += transaction.amount ?? 0;
            }

            

            const date = new Date(transaction.createdAt??'');
            const month = date.getMonth() + 1; // JavaScript months are 0-indexed

            // Determine the quarter
            if (month >= 1 && month <= 3) {
              quarterCounts['Q1']++;
              quarterCounts['AQ1'] = quarterCounts['AQ1'] + ((transaction.transactionType==='Withdrawal' || transaction.transactionType==='Transfer') ? transaction.amount ?? 0:0);
            } else if (month >= 4 && month <= 6) {
              quarterCounts['Q2']++;
              quarterCounts['AQ2'] = quarterCounts['AQ2'] + ((transaction.transactionType==='Withdrawal' || transaction.transactionType==='Transfer') ? transaction.amount ?? 0:0);
            } else if (month >= 7 && month <= 9) {
              quarterCounts['Q3']++;
              quarterCounts['AQ3'] = quarterCounts['AQ3'] + ((transaction.transactionType==='Withdrawal' || transaction.transactionType==='Transfer') ? transaction.amount ?? 0:0);
            } else if (month >= 10 && month <= 12) {
              quarterCounts['Q4']++;
              quarterCounts['AQ4'] = quarterCounts['AQ4'] + ((transaction.transactionType==='Withdrawal' || transaction.transactionType==='Transfer') ? transaction.amount ?? 0:0);
            }
          })

          this.chartOptionsDate = {  
            series: [quarterCounts['Q1'], quarterCounts['Q2'], quarterCounts['Q3'], quarterCounts['Q4']],
            chart: {
              type: 'donut',
              dropShadow: {
                enabled: true,
                top: 0,
                left: 0,
                blur: 5,
                opacity: 0.6
              }
            },
            labels: ['Jan-March', 'April-June', 'July-Sep', 'October-Dec'],
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

          this.chartOptions = {  
            series: [this.deposits, this.payments, this.transfers, this.withdrawals],
            chart: {
              type: 'donut',
              dropShadow: {
                enabled: true,
                top: 0,
                left: 0,
                blur: 5,
                opacity: 0.6
              }
            },
            labels: ['Deposits', 'Payments', 'Transfers', 'Withdrawals'],
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

          this.chartOptionsAmount = {  
            series: [quarterCounts['AQ1'], quarterCounts['AQ2'], quarterCounts['AQ3'], quarterCounts['AQ4']],
            chart: {
              type: 'donut',
              dropShadow: {
                enabled: true,
                top: 0,
                left: 0,
                blur: 5,
                opacity: 0.6
              }
            },
            labels: ['Jan-March', 'April-June', 'July-Sep', 'October-Dec'],
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
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTransactions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Update filteredTransactions when the search term changes
  updateFilteredTransactions() {
    if (this.searchTerm) {
      this.filteredTransactions = this.transactions.filter(
        (transaction) =>
          transaction.transactionId?.includes(this.searchTerm) ||
          this.getDate(transaction.createdAt?.toString() ?? '').includes(
            this.searchTerm
          ) ||
          transaction.transactionType
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          transaction.amount?.toString().includes(this.searchTerm)
      );
    } else {
      this.filteredTransactions = [...this.transactions];
    }
    this.currentPage = 1; // Reset to first page when search is updated
  }

  onSubmit(){
    if(this.transactionForm.valid){
      
      if(this.transactionForm.get('transactionType')?.value==='Transfer'){
        this.transferDto.sourceAccountNumber = localStorage.getItem('accountNumber') ?? '';
        this.transferDto.destinationAccountNumber = this.transactionForm.get('destinationAccountNumber')?.value;
        this.transferDto.amount = this.transactionForm.get('amount')?.value;
        
        this.userService.transferTransaction(this.transferDto).subscribe((response)=>{          
          if(response.responseCode===200){
            this.alertService.showAlert(response.responseMessage,'success');
          } else {
            this.alertService.showAlert(response.responseMessage,'error');
          }
          this.showTransactionModal=!this.showTransactionModal
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
            this.alertService.showAlert(
              'You have been logged out. Please login again.',
              'info'
            );
            this.router.navigate(['/login']);
          }
        })
      } else if(this.transactionForm.get('transactionType')?.value==='Credit'){
        this.creditDebitDto.accountNumber = localStorage.getItem('accountNumber') ?? '';
        this.creditDebitDto.amount = this.transactionForm.get('amount')?.value;

        this.userService.creditTransaction(this.creditDebitDto).subscribe((response)=>{
          if(response.responseCode===200){
            this.alertService.showAlert(response.responseMessage,'success');
          } else {
            this.alertService.showAlert(response.responseMessage,'error');
          }
          this.showTransactionModal=!this.showTransactionModal
          
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
            this.alertService.showAlert(
              'You have been logged out. Please login again.',
              'info'
            );
            this.router.navigate(['/login']);
          }
        })
      } else {
        this.creditDebitDto.accountNumber = localStorage.getItem('accountNumber') ?? '';
        this.creditDebitDto.amount = this.transactionForm.get('amount')?.value;

        this.userService.debitTransaction(this.creditDebitDto).subscribe((response)=>{
          if(response.responseCode===200){
            this.alertService.showAlert(response.responseMessage,'success');
          } else {
            this.alertService.showAlert(response.responseMessage,'error');
          }
          this.showTransactionModal=!this.showTransactionModal
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
            this.alertService.showAlert(
              'You have been logged out. Please login again.',
              'info'
            );
            this.router.navigate(['/login']);
          }
        })
      }
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  allowOnlyAlphanumeric(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^[a-zA-Z0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  toggleTransactionModal(){
    this.showTransactionModal = !this.showTransactionModal;
  }
}
