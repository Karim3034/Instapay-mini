import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: any = null;
  userProfile: any = null;
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        // Ensure balance is a number and format it
        if (typeof data.balance === 'string') {
          data.balance = parseFloat(data.balance);
        }
        this.userProfile = data;
        
        this.authService.updateCurrentUser(data);
        
        this.initializeForm();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load profile';
        this.loading = false;
        console.error('Profile load error:', err);
      }
    });
  }

  initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      fullName: [this.userProfile.fullName, [Validators.required]],
      email: [this.userProfile.email, [Validators.required, Validators.email]]
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: (data) => {
        const updatedUser = { 
          ...this.currentUser, 
          ...this.profileForm.value,
          balance: this.userProfile.balance 
        };
        
        this.successMessage = 'Profile updated successfully';
        this.loading = false;
        
        this.authService.updateCurrentUser(updatedUser);
        this.userProfile = { ...this.userProfile, ...this.profileForm.value };
      },
      error: (err) => {
        this.error = err.message || 'Failed to update profile';
        this.loading = false;
        console.error('Profile update error:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}