import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: any[] = [];
  currentUser: any = null;
  loading = false;
  error = '';
  
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  
  typeFilter: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getUserTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.totalItems = data.length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
        console.error(err);
      }
    });
  }

  applyFilters(): void {
    this.loading = true;
    this.error = '';
    
    if (this.typeFilter) {
      this.transactionService.getTransactionsByType(this.typeFilter).subscribe({
        next: (data) => {
          this.transactions = data || [];
          this.totalItems = this.transactions.length;
          this.currentPage = 1; // Reset to first page
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to filter transactions by type';
          this.loading = false;
          console.error('Error filtering by type:', err);
        }
      });
    } 
    else if (this.startDate && this.endDate) {
      const startDateObj = new Date(this.startDate);
      const endDateObj = new Date(this.endDate);
      
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        this.error = 'Invalid date range';
        this.loading = false;
        return;
      }
      
      if (startDateObj > endDateObj) {
        this.error = 'Start date cannot be after end date';
        this.loading = false;
        return;
      }
      
      endDateObj.setHours(23, 59, 59, 999);
      
      console.log('Fetching transactions from', startDateObj, 'to', endDateObj);
      
      this.transactionService.getTransactionsByDateRange(startDateObj, endDateObj).subscribe({
        next: (data) => {
          this.transactions = data || [];
          this.totalItems = this.transactions.length;
          this.currentPage = 1; // Reset to first page
          this.loading = false;
          
          if (this.transactions.length === 0) {
            this.error = 'No transactions found for the selected date range';
          }
        },
        error: (err) => {
          this.error = 'Failed to filter transactions by date';
          this.loading = false;
          console.error('Error filtering by date:', err);
        }
      });
    } 
    // If no filters are applied, load all transactions
    else {
      this.loadTransactions();
    }
  }

  resetFilters(): void {
    this.typeFilter = '';
    this.startDate = null;
    this.endDate = null;
    this.loadTransactions();
  }
  
  /**
   * Handles date input changes for both start and end dates
   * @param date The selected date string in YYYY-MM-DD format
   * @param type Whether this is the 'start' or 'end' date
   */
  onDateChange(date: string, type: 'start' | 'end'): void {
    if (!date) {
      if (type === 'start') {
        this.startDate = null;
      } else {
        this.endDate = null;
      }
      return;
    }

    const selectedDate = new Date(date);
    
    if (isNaN(selectedDate.getTime())) {
      console.error('Invalid date selected:', date);
      return;
    }

    if (type === 'start') {
      this.startDate = date;
      
      if (this.endDate) {
        const endDate = new Date(this.endDate);
        if (selectedDate > endDate) {
          this.endDate = null;
        }
      }
    } else {
      const today = new Date();
      const isToday = selectedDate.toDateString() === today.toDateString();
      
      if (isToday) {
        this.endDate = date;
      } else {
        this.endDate = date;
      }
      
      if (this.startDate && new Date(this.startDate) > selectedDate) {
        this.startDate = null;
      }
    }
    
    if (this.startDate && this.endDate) {
      this.applyFilters();
    }
  }

  get paginatedTransactions(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.transactions.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}