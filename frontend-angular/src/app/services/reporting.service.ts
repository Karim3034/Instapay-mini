import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface TransactionDetail {
  transactionId: number;
  amount: number;
  description: string;
  timestamp: string;
  receiverUsername: string;
  senderUsername: string;
  status: string;
}

interface TransactionSummary {
  username: string;
  startDate: string;
  endDate: string;
  totalSent: number;
  totalReceived: number;
  totalTransactions: number;
  netBalance: number;
}

interface UserActivity {
  username: string;
  startDate: string;
  endDate: string;
  transactions: TransactionDetail[];
  currentBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  private apiUrl = '/api/reports';
  
  constructor(private http: HttpClient) {}

  getUserTransactionSummary(userId: number, startDate: Date, endDate: Date): Observable<TransactionSummary> {
    const params = new HttpParams()
      .set('startDate', this.formatDateTimeForApi(startDate))
      .set('endDate', this.formatDateTimeForApi(endDate));
    
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/summary`, { params })
      .pipe(
        map(response => {
          console.log('Raw API response (summary):', response);
          let data = response;
          if (response && response.data) {
            data = response.data;
          } else if (response && typeof response === 'object') {
            data = response;
          }
          console.log('Processed response data:', data);
          return data;
        }),
        catchError(error => {
          console.error('Error fetching transaction summary:', error);
          throw error;
        })
      );
  }

  getUserActivity(userId: number, startDate: Date, endDate: Date): Observable<UserActivity> {
    const params = new HttpParams()
      .set('startDate', this.formatDateTimeForApi(startDate))
      .set('endDate', this.formatDateTimeForApi(endDate));
    
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/activity`, { params })
      .pipe(
        map(response => {
          console.log('Raw API response (activity):', response);
          let data = response;
          if (response && response.data) {
            data = response.data;
          } else if (response && typeof response === 'object') {
            data = response;
          }
          console.log('Processed activity data:', data);
          return data;
        }),
        catchError(error => {
          console.error('Error fetching user activity:', error);
          throw error;
        })
      );
  }
  
  private formatDateForApi(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  
  private formatDateTimeForApi(date: Date): string {
    return date.toISOString();
  }
}
