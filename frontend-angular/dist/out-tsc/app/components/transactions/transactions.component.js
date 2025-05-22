import { __decorate } from "tslib";
import { Component } from '@angular/core';
let TransactionsComponent = class TransactionsComponent {
    constructor(authService, transactionService, router) {
        this.authService = authService;
        this.transactionService = transactionService;
        this.router = router;
        this.transactions = [];
        this.currentUser = null;
        this.isLoading = true;
        this.errorMessage = '';
        // Pagination
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalItems = 0;
        // Filtering
        this.typeFilter = '';
        this.startDate = null;
        this.endDate = null;
    }
    ngOnInit() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }
        this.currentUser = this.authService.getCurrentUser();
        this.loadTransactions();
    }
    loadTransactions() {
        this.isLoading = true;
        this.errorMessage = '';
        this.transactionService.getCurrentUserTransactions().subscribe({
            next: (data) => {
                this.transactions = data;
                this.totalItems = data.length;
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = 'Failed to load transactions';
                this.isLoading = false;
                console.error(err);
            }
        });
    }
    applyFilters() {
        this.isLoading = true;
        if (this.typeFilter) {
            this.transactionService.getTransactionsByType(this.typeFilter).subscribe({
                next: (data) => {
                    this.transactions = data;
                    this.totalItems = data.length;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.errorMessage = 'Failed to filter transactions';
                    this.isLoading = false;
                    console.error(err);
                }
            });
        }
        else if (this.startDate && this.endDate) {
            this.transactionService.getTransactionsByDateRange(this.startDate, this.endDate).subscribe({
                next: (data) => {
                    this.transactions = data;
                    this.totalItems = data.length;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.errorMessage = 'Failed to filter transactions';
                    this.isLoading = false;
                    console.error(err);
                }
            });
        }
        else {
            this.loadTransactions();
        }
    }
    resetFilters() {
        this.typeFilter = '';
        this.startDate = null;
        this.endDate = null;
        this.loadTransactions();
    }
    get paginatedTransactions() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.transactions.slice(startIndex, startIndex + this.pageSize);
    }
    get totalPages() {
        return Math.ceil(this.totalItems / this.pageSize);
    }
    changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }
};
TransactionsComponent = __decorate([
    Component({
        selector: 'app-transactions',
        templateUrl: './transactions.component.html',
        styleUrls: ['./transactions.component.css']
    })
], TransactionsComponent);
export { TransactionsComponent };
//# sourceMappingURL=transactions.component.js.map