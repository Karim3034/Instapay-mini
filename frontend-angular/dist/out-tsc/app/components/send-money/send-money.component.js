import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let SendMoneyComponent = class SendMoneyComponent {
    constructor(formBuilder, authService, transactionService, userService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.transactionService = transactionService;
        this.userService = userService;
        this.router = router;
        this.isSubmitting = false;
        this.errorMessage = '';
        this.successMessage = '';
        this.currentUser = null;
        this.userProfile = null;
        this.users = [];
    }
    ngOnInit() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }
        this.currentUser = this.authService.getCurrentUser();
        this.loadUserProfile();
        this.loadUsers();
        this.sendMoneyForm = this.formBuilder.group({
            receiverUsername: ['', [Validators.required]],
            amount: ['', [Validators.required, Validators.min(0.01)]],
            description: ['']
        });
    }
    loadUserProfile() {
        this.userService.getCurrentUserProfile().subscribe({
            next: (data) => {
                this.userProfile = data;
            },
            error: (err) => {
                this.errorMessage = 'Failed to load user profile';
                console.error(err);
            }
        });
    }
    loadUsers() {
        this.userService.getAllUsers().subscribe({
            next: (data) => {
                // Filter out the current user
                this.users = data.filter((user) => user.username !== this.currentUser.username);
            },
            error: (err) => {
                console.error('Failed to load users', err);
            }
        });
    }
    onSubmit() {
        if (this.sendMoneyForm.invalid) {
            return;
        }
        this.isSubmitting = true;
        this.errorMessage = '';
        this.successMessage = '';
        const { receiverUsername, amount, description } = this.sendMoneyForm.value;
        // Use the transaction service's sendMoney method instead of userService.transferMoney
        this.transactionService.sendMoney(receiverUsername, amount, description).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.successMessage = `Successfully sent $${amount} to ${receiverUsername}`;
                this.sendMoneyForm.reset();
                setTimeout(() => {
                    this.router.navigate(['/dashboard']);
                }, 2000);
            },
            error: (err) => {
                this.isSubmitting = false;
                this.errorMessage = err.error?.message || 'Failed to send money. Please try again.';
                console.error(err);
            }
        });
    }
};
SendMoneyComponent = __decorate([
    Component({
        selector: 'app-send-money',
        templateUrl: './send-money.component.html',
        styleUrls: ['./send-money.component.css']
    })
], SendMoneyComponent);
export { SendMoneyComponent };
//# sourceMappingURL=send-money.component.js.map