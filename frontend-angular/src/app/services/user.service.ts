import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
}

const API_URL = '/api/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getCurrentUser(): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      return throwError(() => new Error('No authenticated user'));
    }
    return this.http.get<ApiResponse<any>>(`${API_URL}/${currentUser.id}`, {
      headers: this.authService.getAuthHeader()
    }).pipe(
      map(response => response.data || response), 
      catchError(this.handleError)
    );
  }

  getUserByUsername(username: string): Observable<any> {
    if (!username?.trim()) {
      return throwError(() => new Error('Username is required'));
    }
    return this.http.get<ApiResponse<any>>(`${API_URL}/username/${username}`, {
      headers: this.authService.getAuthHeader()
    }).pipe(
      map(response => response.data || response), 
      catchError(this.handleError)
    );
  }

  updateProfile(profileData: any): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.id) {
      return throwError(() => new Error('No authenticated user'));
    }
    
    return this.http.put<ApiResponse<any>>(
      `${API_URL}/${currentUser.id}`, 
      profileData,
      { headers: this.authService.getAuthHeader() }
    ).pipe(
      map(response => {
        const updatedUser = response.data || response;
        if (updatedUser) {
          const currentUser = this.authService.getCurrentUser();
          const mergedUser = { ...currentUser, ...updatedUser };
          localStorage.setItem('user', JSON.stringify(mergedUser));
        }
        return updatedUser;
      }),
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<any> {
    return this.http.get<ApiResponse<any[]>>(API_URL, {
      headers: this.authService.getAuthHeader()
    }).pipe(
      map(response => response.data || response || []),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error) {
        errorMessage = typeof error.error === 'string' 
          ? error.error 
          : JSON.stringify(error.error);
      }
    }
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}