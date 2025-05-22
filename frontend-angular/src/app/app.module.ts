import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { SendMoneyComponent } from './components/send-money/send-money.component';
import { AccountAnalysisComponent } from './components/account-analysis/account-analysis.component';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TransactionService } from './services/transaction.service';
import { ReportingService } from './services/reporting.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    TransactionsComponent,
    SendMoneyComponent,
    AccountAnalysisComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbDropdownModule
  ],
  providers: [
    AuthService,
    UserService,
    TransactionService,
    ReportingService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
