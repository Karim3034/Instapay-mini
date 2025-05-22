import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.css']
})
export class SendMoneyComponent implements OnInit {
  sendMoneyForm!: FormGroup;
  isSubmitting = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  currentUser: any = null;
  userProfile: any = null;
  minTransferAmount = 0.01;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private transactionService: TransactionService,
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

    this.sendMoneyForm = this.formBuilder.group({
      receiverUsername: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['']
    });
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.userProfile = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user profile:', err);
        this.errorMessage = 'Failed to load user profile. Please refresh the page.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.isLoading || this.isSubmitting) {
      return;
    }

    if (this.sendMoneyForm.invalid) {
      this.markFormGroupTouched(this.sendMoneyForm);
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const formValue = this.sendMoneyForm.value;
    const receiverUsername = formValue.receiverUsername?.trim();
    const amount = parseFloat(formValue.amount);
    const description = formValue.description?.trim() || `Transfer to ${receiverUsername}`;
    
    if (!receiverUsername) {
      this.errorMessage = 'Please enter a valid username.';
      return;
    }

    if (isNaN(amount) || amount < this.minTransferAmount) {
      this.errorMessage = `Amount must be at least $${this.minTransferAmount}.`;
      return;
    }
    
    if (receiverUsername === this.currentUser.username) {
      this.errorMessage = 'You cannot send money to yourself.';
      return;
    }

    if (!this.userProfile) {
      this.errorMessage = 'Error: User profile not loaded. Please refresh the page.';
      return;
    }

    if (amount > this.userProfile.balance) {
      this.errorMessage = `Insufficient balance. Available: $${this.userProfile.balance.toFixed(2)}`;
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.transactionService.transfer(receiverUsername, amount, description).subscribe({
      next: (response) => {
        console.log('Transfer successful', response);
        this.successMessage = `Successfully transferred $${amount.toFixed(2)} to ${receiverUsername}.`;
        this.sendMoneyForm.reset();
        
        this.loadUserProfile();
        
        this.transactionService.getUserTransactions().subscribe({
          next: () => console.log('Transactions refreshed'),
          error: (err) => console.error('Error refreshing transactions:', err)
        });
      },
      error: (error) => {
        console.error('Transfer failed:', {
          error: error,
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          errorDetails: error.error,
          headers: error.headers
        });
        
        let errorMessage = 'Failed to complete the transfer. Please try again.';
        
        if (error.error) {
          if (error.error.errors) {
            errorMessage = Object.entries(error.error.errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
          } 
          else if (typeof error.error === 'string') {
            errorMessage = error.error;
          }
          else if (error.error.message) {
            errorMessage = error.error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.statusText) {
          errorMessage = error.statusText;
        }
        
        this.errorMessage = errorMessage;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}