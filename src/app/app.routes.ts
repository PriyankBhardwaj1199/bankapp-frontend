import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HeroComponent } from './components/hero/hero.component';
import { FeaturesComponent } from './components/features/features.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';

export const routes: Routes = [

    { path: 'register', component: RegisterComponent },
    { path: '*', redirectTo: '/home', pathMatch: 'full' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HeroComponent},
    { path: 'services', component: FeaturesComponent},
    { path: 'password-update', component: UpdatePasswordComponent},

];
