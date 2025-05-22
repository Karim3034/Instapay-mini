import { __decorate } from "tslib";
import { Component } from '@angular/core';
let AccountAnalysisComponent = class AccountAnalysisComponent {
    constructor(authService, transactionService, router, datePipe) {
        this.authService = authService;
        this.transactionService = transactionService;
        this.router = router;
        this.datePipe = datePipe;
        this.currentUser = null;
        this.transactions = [];
        this.isLoading = true;
        this.errorMessage = '';
        // Analysis data
        this.totalTransactions = 0;
        this.totalIncoming = 0;
        this.totalOutgoing = 0;
        this.netBalance = 0;
        // Transaction types
        this.transactionsByType = {};
        // Monthly data
        this.monthlyData = [];
        // Date range filter
        this.startDate = '';
        this.endDate = '';
    }
    ngOnInit() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }
        this.currentUser = this.authService.getCurrentUser();
        // Set default date range to last 3 months
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        this.endDate = this.formatDate(today);
        this.startDate = this.formatDate(threeMonthsAgo);
        this.loadTransactions();
    }
    formatDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
    }
    loadTransactions() {
        this.isLoading = true;
        this.errorMessage = '';
        // Convert string dates to Date objects
        const start = this.startDate ? new Date(this.startDate) : null;
        const end = this.endDate ? new Date(this.endDate) : null;
        if (start && end) {
            // Add one day to end date to include the end date in the range
            end.setDate(end.getDate() + 1);
            this.transactionService.getTransactionsByDateRange(start, end).subscribe({
                next: (data) => {
                    this.transactions = data;
                    this.analyzeTransactions();
                    this.isLoading = false;
                },
                error: (err) => {
                    this.errorMessage = 'Failed to load transactions';
                    this.isLoading = false;
                    console.error(err);
                }
            });
        }
        else {
            this.transactionService.getCurrentUserTransactions().subscribe({
                next: (data) => {
                    this.transactions = data;
                    this.analyzeTransactions();
                    this.isLoading = false;
                },
                error: (err) => {
                    this.errorMessage = 'Failed to load transactions';
                    this.isLoading = false;
                    console.error(err);
                }
            });
        }
    }
    analyzeTransactions() {
        this.totalTransactions = this.transactions.length;
        this.totalIncoming = 0;
        this.totalOutgoing = 0;
        this.transactionsByType = {};
        this.monthlyData = [];
        // Group transactions by month
        const monthlyMap = new Map();
        this.transactions.forEach(transaction => {
            // Count by type
            if (!this.transactionsByType[transaction.type]) {
                this.transactionsByType[transaction.type] = 0;
            }
            this.transactionsByType[transaction.type]++;
            // Calculate incoming and outgoing amounts
            if (transaction.type === 'DEPOSIT' || transaction.receiverUsername === this.currentUser.username) {
                this.totalIncoming += transaction.amount;
            }
            else {
                this.totalOutgoing += transaction.amount;
            }
            // Group by month
            const date = new Date(transaction.timestamp);
            const monthKey = this.datePipe.transform(date, 'MMM yyyy') || '';
            if (!monthlyMap.has(monthKey)) {
                monthlyMap.set(monthKey, { incoming: 0, outgoing: 0 });
            }
            const monthData = monthlyMap.get(monthKey);
            if (monthData) {
                if (transaction.type === 'DEPOSIT' || transaction.receiverUsername === this.currentUser.username) {
                    monthData.incoming += transaction.amount;
                }
                else {
                    monthData.outgoing += transaction.amount;
                }
            }
        });
        // Convert map to array for template
        monthlyMap.forEach((value, key) => {
            this.monthlyData.push({
                month: key,
                incoming: value.incoming,
                outgoing: value.outgoing
            });
        });
        // Sort monthly data by date
        this.monthlyData.sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateA.getTime() - dateB.getTime();
        });
        this.netBalance = this.totalIncoming - this.totalOutgoing;
    }
    applyDateFilter() {
        this.loadTransactions();
    }
    resetDateFilter() {
        const today = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        this.endDate = this.formatDate(today);
        this.startDate = this.formatDate(threeMonthsAgo);
        this.loadTransactions();
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
    // Helper method for template to get object keys
    getObjectKeys(obj) {
        return Object.keys(obj);
    }
};
AccountAnalysisComponent = __decorate([
    Component({
        selector: 'app-account-analysis',
        templateUrl: './account-analysis.component.html',
        styleUrls: ['./account-analysis.component.css']
    })
], AccountAnalysisComponent);
export { AccountAnalysisComponent };
//# sourceMappingURL=account-analysis.component.js.map