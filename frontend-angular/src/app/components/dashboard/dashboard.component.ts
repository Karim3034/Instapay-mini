import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  userProfile: any = null;
  recentTransactions: any[] = [];
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private transactionService: TransactionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserData();
    this.loadTransactions();
  }

  loadUserData(): void {
    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.currentUser = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user data';
        this.loading = false;
        console.error(err);
      }
    });
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getUserTransactions().subscribe({
      next: (data) => {
        this.recentTransactions = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
        console.error(err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}