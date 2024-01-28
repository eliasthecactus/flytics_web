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
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { StatsComponent } from './pages/stats/stats.component';
import { FeedComponent } from './pages/feed/feed.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
        {path: '', redirectTo: 'overview', pathMatch: 'full'},
        {path: 'overview', component: OverviewComponent},
        {path: 'stats', component: StatsComponent},
        {path: 'feed', component: FeedComponent}
    ]},
    { path: 'add', component: AddFlightComponent },
    // { path: 'settings', component: SettingsComponent },
    { path: 'account', component: AccountComponent },
    { path: 'tou', component: TermsOfUseComponent },
    { path: 'privacypolicy', component: PrivacyPolicyComponent },
    { path: 'cookiepolicy', component: CookiePolicyComponent },
    { path: 'passwordreset', component: PasswordResetComponent },
    { path: "**", redirectTo: "home" },
];
