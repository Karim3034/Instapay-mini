import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let ProfileComponent = class ProfileComponent {
    constructor(formBuilder, authService, userService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.userService = userService;
        this.router = router;
        this.currentUser = null;
        this.userProfile = null;
        this.isLoading = true;
        this.isSubmitting = false;
        this.successMessage = '';
        this.errorMessage = '';
    }
    ngOnInit() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }
        this.currentUser = this.authService.getCurrentUser();
        this.loadUserProfile();
    }
    loadUserProfile() {
        this.isLoading = true;
        this.userService.getCurrentUserProfile().subscribe({
            next: (data) => {
                this.userProfile = data;
                this.initializeForm();
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = 'Failed to load user profile';
                this.isLoading = false;
                console.error(err);
            }
        });
    }
    initializeForm() {
        this.profileForm = this.formBuilder.group({
            fullName: [this.userProfile.fullName, [Validators.required]],
            email: [this.userProfile.email, [Validators.required, Validators.email]]
        });
    }
    onSubmit() {
        if (this.profileForm.invalid) {
            return;
        }
        this.isSubmitting = true;
        this.successMessage = '';
        this.errorMessage = '';
        const { fullName, email } = this.profileForm.value;
        this.userService.updateProfile({ fullName, email }).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                this.successMessage = 'Profile updated successfully';
                this.userProfile = { ...this.userProfile, ...response };
            },
            error: (err) => {
                this.isSubmitting = false;
                this.errorMessage = err.error?.message || 'Failed to update profile';
                console.error(err);
            }
        });
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
};
ProfileComponent = __decorate([
    Component({
        selector: 'app-profile',
        templateUrl: './profile.component.html',
        styleUrls: ['./profile.component.css']
    })
], ProfileComponent);
export { ProfileComponent };
//# sourceMappingURL=profile.component.js.map