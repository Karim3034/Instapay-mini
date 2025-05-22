import { __decorate } from "tslib";
import { Component } from '@angular/core';
let DashboardComponent = class DashboardComponent {
    constructor(authService, userService, transactionService, router) {
        this.authService = authService;
        this.userService = userService;
        this.transactionService = transactionService;
        this.router = router;
        this.currentUser = null;
        this.userProfile = null;
        this.recentTransactions = [];
        this.isLoading = true;
        this.errorMessage = '';
    }
    ngOnInit() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }
        this.currentUser = this.authService.getCurrentUser();
        this.loadUserProfile();
        this.loadRecentTransactions();
    }
    loadUserProfile() {
        this.userService.getCurrentUserProfile().subscribe({
            next: (data) => {
                this.userProfile = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = 'Failed to load user profile';
                this.isLoading = false;
                console.error(err);
            }
        });
    }
    loadRecentTransactions() {
        this.transactionService.getCurrentUserTransactions().subscribe({
            next: (data) => {
                this.recentTransactions = data.slice(0, 5); // Get only the 5 most recent transactions
            },
            error: (err) => {
                this.errorMessage = 'Failed to load recent transactions';
                console.error(err);
            }
        });
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
};
DashboardComponent = __decorate([
    Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css']
    })
], DashboardComponent);
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map