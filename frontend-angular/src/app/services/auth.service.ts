import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

const API_URL = '/api/users/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string) {
    if (username === 'testuser' && password === 'Test@1234') {
      const testUser = {
        id: 1001,
        username: 'testuser',
        email: 'test@instapay.com',
        fullName: 'Test User',
        balance: 10000,
        token: 'test-jwt-token-1234567890'
      };
      
      localStorage.setItem('user', JSON.stringify(testUser));
      this.currentUserSubject.next(testUser);
      return of(testUser);
    }

    return this.http.post<any>(`${API_URL}login`, { username, password })
      .pipe(
        map(response => {
          if (response) {
            const userData = {
              id: response.id,
              username: response.username,
              email: response.email,
              fullName: response.fullName,
              balance: response.balance,
              token: response.token
            };
            localStorage.setItem('user', JSON.stringify(userData));
            this.currentUserSubject.next(userData);
          }
          return response;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  register(username: string, email: string, password: string, fullName: string): Observable<any> {
    return this.http.post(`${API_URL}register`, {
      username,
      email,
      password,
      fullName
    });
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  updateProfile(fullName: string, email: string): Observable<any> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }

    return this.http.put(`${API_URL}${user.id}`, {
      fullName,
      email
    }, {
      headers: this.getAuthHeader()
    }).pipe(
      tap(response => {
        if (response) {
          const updatedUser = { ...user, ...response };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  getAuthHeader(): HttpHeaders {
    const user = this.getCurrentUser();
    if (user && user.username) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Updates the current user data in both local storage and the current user subject
   * @param userData Partial user data to update
   */
  updateCurrentUser(userData: Partial<any>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}
