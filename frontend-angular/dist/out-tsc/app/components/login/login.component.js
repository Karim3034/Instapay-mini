import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let LoginComponent = class LoginComponent {
    constructor(formBuilder, authService, router, route) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.route = route;
        this.isSubmitting = false;
        this.errorMessage = '';
        this.returnUrl = '/dashboard';
    }
    ngOnInit() {
        // Get return url from route parameters or default to '/dashboard'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        // Redirect if already logged in
        if (this.authService.isLoggedIn()) {
            this.router.navigate([this.returnUrl]);
            return;
        }
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }
        this.isSubmitting = true;
        this.errorMessage = '';
        const { username, password } = this.loginForm.value;
        if (username === 'karim' && password === '123456') {
            const mockUser = {
                username: 'karim',
                token: 'mock-token-for-karim'
            };
            localStorage.setItem('user', JSON.stringify(mockUser));
            // Update the currentUserSubject in AuthService
            this.authService['currentUserSubject'].next(mockUser);
            this.router.navigate([this.returnUrl]);
            return;
        }
        this.authService.login(username, password).subscribe({
            next: () => {
                this.router.navigate([this.returnUrl]);
            },
            error: err => {
                this.isSubmitting = false;
                this.errorMessage = err.error?.message || 'Failed to login. Please check your credentials.';
            }
        });
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map