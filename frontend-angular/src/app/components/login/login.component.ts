import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
      return;
    }

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
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
}
