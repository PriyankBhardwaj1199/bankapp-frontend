import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { BankstatementComponent } from './components/bankstatement/bankstatement.component';
import { CardsComponent } from './components/cards/cards.component';



export const routes: Routes = [

    { path: 'register', component: RegisterComponent },
    { path: '*', redirectTo: '/home', pathMatch: 'full' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HeroComponent},
    { path: 'services', component: FeaturesComponent},
    { path: 'password-update', component: UpdatePasswordComponent},
    { path: 'dashboard', component: DashboardComponent,
        children: [
            { path: 'user-dashboard', component: UserComponent },
            { path: 'accounts', component: AccountsComponent },
            { path: 'transactions', component: TransactionsComponent },
            { path: 'transfer', component: TransferComponent },
            { path: 'bankstatement', component: BankstatementComponent },
            { path: 'cards', component: CardsComponent }
          ]
    },

];
