import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Mini-InstaPay';
  isLoggedIn = false;
  username?: string;

  constructor(
    private authService: AuthService, 
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username;
      
      if (this.isLoggedIn && (!user?.balance || !user?.email)) {
        this.loadUserProfile();
      }
    });

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.isLoggedIn = true;
      this.username = currentUser.username;
    }
  }

  private loadUserProfile(): void {
    this.userService.getCurrentUser().subscribe({
      next: (profile) => {
        const currentUser = this.authService.getCurrentUser();
        const updatedUser = { ...currentUser, ...profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.authService['currentUserSubject'].next(updatedUser);
      },
      error: (err) => {
        console.error('Failed to load user profile:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    
    this.isLoggedIn = false;
    this.username = undefined;
    
    this.router.navigate(['/login']);
  }
}
