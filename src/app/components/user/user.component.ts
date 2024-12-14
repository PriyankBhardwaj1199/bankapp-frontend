import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumService } from '../../services/breadcrum.service';
import { Observable } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Country, State } from 'country-state-city';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { Transaction } from '../../model/transaction';
import { CardsService } from '../../services/cards.service';
import { Cards } from '../../model/cards';
import { BankstatementService } from '../../services/bankstatement.service';
import { BankStatement } from '../../model/bank-statement';
import { AlertService } from '../../services/alert.service';
import { UserDto } from '../../model/userdto';
import { TransferFilterPipe } from "../../pipes/transfer-filter.pipe";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, CommonModule, TransferFilterPipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  updateForm!: FormGroup;

  greeting: string;
  hasCards: boolean = true;
  hasTransactions: boolean = true;
  hasTransfers: boolean = true;
  showUpdateModal: boolean = false;
  user!: User;
  countryName: string | undefined;
  userEmail: string = localStorage.getItem('username') ?? '';
  transactions: Transaction[] = [];
  cards: Cards[] = [];
  statements: BankStatement[] = [];
  accountBalance: number[] = [];

  countries: { name: string; isoCode: string }[] = [];
  states: { name: string; isoCode: string }[] = [];
  defaultStateMessage = 'Select country first';

  breadcrumbs$!: Observable<{ label: string; url: string }[]>;
  transferCount: number = 0;
  totalCards: number = 0;
  userDto: UserDto = new UserDto();

  constructor(
    private breadcrumbService: BreadcrumService,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cardsService: CardsService,
    private bankStatementService: BankstatementService,
    private alertService: AlertService
  ) {
    this.greeting = this.getGreeting();

    this.updateForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      pinCode: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
      stateOfOrigin: ['', [Validators.required]],
      country: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
      alternativePhoneNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ],
      ],
    });
  }

  getGreeting(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  ngOnInit() {
    this.breadcrumbs$ = this.breadcrumbService.getBreadcrumbs();
    this.countries = Country.getAllCountries();

    this.userService.fetchAccount(this.userEmail).subscribe(
      (response) => {
        this.user = response;
        if (response.country) {
          const countryIsoCode = this.getCountryIsoCodeByName(response.country);
          this.countryName = response.country;
          if (countryIsoCode) {
            response.country = countryIsoCode; // Update the country field with ISO code
            this.states = State.getStatesOfCountry(countryIsoCode);
          }
        }

        this.updateForm.patchValue(response);
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

    this.userService
      .fetchTransactions(localStorage.getItem('accountNumber') ?? '')
      .subscribe(
        (response) => {
          this.transactions = response;
          this.transferCount = this.transactions.filter(
            (transaction) => transaction.transactionType === 'Transfer'
          ).length;
          if (this.transactions.length == 0) {
            this.hasTransactions = false;
          }
          if (this.transferCount === 0) {
            this.hasTransfers = false;
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

    this.cardsService
      .getCardsByAccountNumber(localStorage.getItem('accountNumber') ?? '')
      .subscribe(
        (response) => {
          this.cards = response;
          this.totalCards = response.length;
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

    this.bankStatementService
      .getStatementsByAccountNumber(localStorage.getItem('accountNumber') ?? '')
      .subscribe(
        (response) => {
          this.statements = response.slice(0, 3);
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

  onMenuItemSelect(menu: string) {
    console.log(this.breadcrumbs$);
    switch (menu) {
      case 'Transactions':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({
          label: 'Transactions',
          url: '/dashboard/transactions',
        });
        this.router.navigate(['/dashboard/transactions']);
        break;
      case 'Transfer':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({
          label: 'Transfer',
          url: '/dashboard/transfer',
        });
        this.router.navigate(['/dashboard/transfer']);
        break;
      case 'Bank Statement':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({
          label: 'Bank Statements',
          url: '/dashboard/bankstatement',
        });
        this.router.navigate(['/dashboard/bankstatement']);
        break;
      case 'Cards':
        this.breadcrumbService.clearBreadcrumbs();
        this.breadcrumbService.addBreadcrumb({
          label: 'Cards',
          url: '/dashboard/cards',
        });
        this.router.navigate(['/dashboard/cards']);
        break;
    }
  }

  toggleUpdateModal() {
    this.showUpdateModal = !this.showUpdateModal;
  }

  onSubmit() {
    if (this.updateForm?.valid) {
      this.userDto.firstName = this.updateForm.get('firstName')?.value;
      this.userDto.lastName = this.updateForm.get('lastName')?.value;
      this.userDto.middleName = this.updateForm.get('middleName')?.value;
      this.userDto.email = this.updateForm.get('email')?.value;
      this.userDto.city = this.updateForm.get('city')?.value;
      this.userDto.country = Country.getCountryByCode(this.updateForm.get('country')?.value)?.name;
      this.userDto.stateOfOrigin = this.updateForm.get('stateOfOrigin')?.value;
      this.userDto.addressLine1 = this.updateForm.get('addressLine1')?.value;
      this.userDto.addressLine2 = this.updateForm.get('addressLine2')?.value;
      this.userDto.gender = this.updateForm.get('gender')?.value;
      this.userDto.pinCode = this.updateForm.get('pinCode')?.value;
      this.userDto.phoneNumber = this.updateForm.get('phoneNumber')?.value;
      this.userDto.alternativePhoneNumber = this.updateForm.get('alternativePhoneNumber')?.value;

      this.userService.updateUser(this.userDto).subscribe((response)=>{
        if(response.responseCode===200){
            this.alertService.showAlert(response.responseMessage,'success');
          } else if(response.responseCode===404){
            this.alertService.showAlert(response.responseMessage,'info');
          } else if(response.responseCode===500){
            this.alertService.showAlert(response.responseMessage,'error');
          }
          this.showUpdateModal = false;
          setTimeout(() => {
            window.location.reload();
            
          }, 2000);
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

  onCountryChange(): void {
    const selectedCountryIsoCode = this.updateForm.get('country')?.value;
    if (selectedCountryIsoCode) {
      // Fetch states for the selected country
      this.states = State.getStatesOfCountry(selectedCountryIsoCode);
    } else {
      // Reset states if no country is selected
      this.states = [];
    }
    this.updateForm.get('stateOfOrigin')?.setValue(''); // Reset state field
  }

  getCountryIsoCodeByName(countryName: string): string | null {
    // Find the country with the matching name
    const country = this.countries.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );

    // Return the ISO code if found, or null otherwise
    return country ? country.isoCode : null;
  }

  getDateDifference(createdOn: string): string {
    const createdDate = new Date(createdOn);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - createdDate.getFullYear();
    let months = currentDate.getMonth() - createdDate.getMonth();

    // Adjust the year difference if months are negative
    if (months < 0) {
      years--;
      months += 12;
    }

    const timeDiff = currentDate.getTime() - createdDate.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    // Return days if there are 0 years and 0 months
    if (years === 0 && months === 0) {
      return `${days} day(s)`;
    } else if (years === 0 && months !== 0) {
      return `${months} month(s) and ${days} day(s)`;
    }

    return `${years} year(s) and ${months} month(s)`;
  }

  transactionFilterFn = (transaction: any) => {
    return transaction.transactionType === 'Transfer';
  };
}
