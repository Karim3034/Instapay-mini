import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: number;
}

const API_URL = '/api/transactions';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  transfer(receiverUsername: string, amount: number, description: string): Observable<any> {
    if (!receiverUsername?.trim()) {
      return throwError(() => new Error('Recipient username is required'));
    }

    if (isNaN(amount) || amount <= 0) {
      return throwError(() => new Error('Amount must be greater than zero'));
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const transferRequest = {
      senderUsername: currentUser.username,
      toUsername: receiverUsername.trim(),
      amount: amount,
      description: (description || `Transfer to ${receiverUsername}`).trim()
    };

    const requestUrl = `${API_URL}/transfer`;

    console.group('Sending Transfer Request');
    console.log('URL:', requestUrl);
    console.log('Method: POST');
    console.log('Body:', transferRequest);
    console.groupEnd();

    return this.http.post<ApiResponse<any>>(
      requestUrl,
      transferRequest,
      { 
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: 'response',
      }
    ).pipe(
      map(response => {
        const result = response.body;
        
        // Update user balance after successful transfer
        if (result && currentUser.balance !== undefined) {
          const newBalance = Number(currentUser.balance) - amount;
          this.authService.updateCurrentUser({ balance: newBalance });
        }
        
        return result;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Raw error response:', {
          status: error.status,
          statusText: error.statusText,
          headers: error.headers,
          error: error.error,
          url: error.url
        });
        return this.handleError(error);
      })
    );
  }

  getUserTransactions(): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.username) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    return this.http.get<ApiResponse<any>>(
      `${API_URL}/user/${currentUser.username}`,
      { headers: this.authService.getAuthHeader() }
    ).pipe(
      map(response => response.data || response || []),
      catchError(this.handleError)
    );
  }

  getTransactionById(id: number): Observable<any> {
    return this.http.get<ApiResponse<any>>(
      `${API_URL}/${id}`,
      { headers: this.authService.getAuthHeader() }
    ).pipe(
      map(response => response.data || response),
      catchError(this.handleError)
    );
  }

  getTransactionsByType(type: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(
      `${API_URL}/type/${type}`,
      { headers: this.authService.getAuthHeader() }
    ).pipe(
      map(response => response.data || response || []),
      catchError(this.handleError)
    );
  }

  getTransactionsByDateRange(startDate: Date, endDate: Date): Observable<any> {
    // Format dates to ISO string and ensure they're in the correct timezone
    const formatDate = (date: Date) => {
      const localDate = new Date(date);
      localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
      return localDate.toISOString();
    };

    const params = new HttpParams()
      .set('start', formatDate(startDate))
      .set('end', formatDate(endDate));

    console.log('Fetching transactions with params:', params.toString());

    return this.http.get<ApiResponse<any>>(
      `${API_URL}/date-range`,
      { 
        params,
        headers: this.authService.getAuthHeader() 
      }
    ).pipe(
      map(response => {
        console.log('Transactions API response:', response);
        return response.data || response || [];
      }),
      catchError(error => {
        console.error('Error in getTransactionsByDateRange:', error);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    console.error('Full error object:', error);
    
    if (error.status === 0) {
      // A client-side or network error occurred
      errorMessage = 'Network error: Unable to connect to the server. Please check your connection.';
      console.error('Network error details:', error.error);
    } else if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error (${error.status}): ${error.statusText || 'Unknown error'}`;
      
      // Try to get more specific error message from the response
      if (error.error) {
        if (error.error.message) {
          errorMessage = error.error.message;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.errors) {
          // Handle validation errors
          errorMessage = Object.entries(error.error.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
        } else {
          errorMessage = JSON.stringify(error.error);
        }
      }
    }
    
    console.error('API Error:', {
      message: errorMessage,
      name: error.name,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      headers: error.headers
    });
    
    return throwError(() => new Error(errorMessage));
  }

}