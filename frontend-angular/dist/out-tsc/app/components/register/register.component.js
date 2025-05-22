import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let RegisterComponent = class RegisterComponent {
    constructor(formBuilder, authService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.isSubmitting = false;
        this.errorMessage = '';
        this.successMessage = '';
    }
    ngOnInit() {
        // Redirect if already logged in
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
            return;
        }
        this.registerForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            fullName: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validators: this.passwordMatchValidator
        });
    }
    passwordMatchValidator(form) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        if (password !== confirmPassword) {
            form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }
    onSubmit() {
        if (this.registerForm.invalid) {
            return;
        }
        this.isSubmitting = true;
        this.errorMessage = '';
        this.successMessage = '';
        const { username, email, password, fullName } = this.registerForm.value;
        this.authService.register(username, email, password, fullName).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.successMessage = 'Registration successful! You can now login.';
                this.registerForm.reset();
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 2000);
            },
            error: err => {
                this.isSubmitting = false;
                console.error('Registration error:', err);
                // Check if the error has a message property directly
                if (err.message) {
                    this.errorMessage = err.message;
                }
                // Check if the error has an error object with a message property
                else if (err.error?.message) {
                    this.errorMessage = err.error.message;
                }
                // Check if the error is a string
                else if (typeof err.error === 'string') {
                    this.errorMessage = err.error;
                }
                // Default error message
                else {
                    this.errorMessage = 'Registration failed. Please try again.';
                }
            }
        });
    }
};
RegisterComponent = __decorate([
    Component({
        selector: 'app-register',
        templateUrl: './register.component.html',
        styleUrls: ['./register.component.css']
    })
], RegisterComponent);
export { RegisterComponent };
//# sourceMappingURL=register.component.js.map