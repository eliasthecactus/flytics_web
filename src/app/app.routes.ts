import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddFlightComponent } from './pages/add-flight/add-flight.component';
import { AccountComponent } from './pages/account/account.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TermsOfUseComponent } from './pages/terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './pages/cookie-policy/cookie-policy.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'add', component: AddFlightComponent },
    // { path: 'settings', component: SettingsComponent },
    { path: 'account', component: AccountComponent },
    { path: 'tou', component: TermsOfUseComponent },
    { path: 'privacypolicy', component: PrivacyPolicyComponent },
    { path: 'cookiepolicy', component: CookiePolicyComponent },
    { path: "**", redirectTo: "home" },
];
