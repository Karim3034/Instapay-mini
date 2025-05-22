import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { ReportingService } from '../../services/reporting.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

interface Transaction {
  id: number;
  amount: number;
  type: string;
  timestamp: string;
  description?: string;
  receiverUsername?: string;
  senderUsername?: string;
  status?: string;
}

interface MonthlyData {
  month: string;
  incoming: number;
  outgoing: number;
  sendAmount: number;
  receiveAmount: number;
  netSendReceive: number;
}

@Component({
  selector: 'app-account-analysis',
  templateUrl: './account-analysis.component.html',
  styleUrls: ['./account-analysis.component.css']
})
export class AccountAnalysisComponent implements OnInit {
  currentUser: { id: number; username: string; } | null = null;
  transactions: Transaction[] = [];
  totalTransactions: number = 0;
  totalIncoming: number = 0;
  totalOutgoing: number = 0;
  netBalance: number = 0;
  transactionsByType: Record<string, number> = {};
  monthlyData: MonthlyData[] = [];
  isLoading: boolean = false; // Make sure this starts as false
  errorMessage: string = '';
  startDate: string = '';
  endDate: string = '';
  monthlyMap: Map<string, { incoming: number; outgoing: number; sendAmount: number; receiveAmount: number; netSendReceive: number }> = new Map();
  totalSend: number = 0;
  totalReceive: number = 0;

  constructor(
    private transactionService: TransactionService,
    private reportingService: ReportingService,
    private router: Router,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    console.log('AccountAnalysisComponent loaded: ngOnInit called');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    this.startDate = this.formatDate(startDate);
    this.endDate = this.formatDate(endDate);

    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user from auth service:', this.currentUser);
    
    this.loadTransactions();
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  applyDateFilter(): void {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Please select both start and end dates';
      return;
    }

    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      this.errorMessage = 'Invalid date range';
      return;
    }

    if (endDate < startDate) {
      this.errorMessage = 'End date cannot be before start date';
      return;
    }

    this.startDate = this.formatDate(startDate);
    this.endDate = this.formatDate(endDate);
    
    this.loadTransactions();
  }

  resetDateFilter(): void {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    this.startDate = this.formatDate(startDate);
    this.endDate = this.formatDate(endDate);
    
    this.errorMessage = '';
    
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const prevValues = {
      transactions: [...this.transactions],
      totalTransactions: this.totalTransactions,
      totalIncoming: this.totalIncoming,
      totalOutgoing: this.totalOutgoing,
      netBalance: this.netBalance,
      totalSend: this.totalSend,
      totalReceive: this.totalReceive,
      transactionsByType: {...this.transactionsByType},
      monthlyData: [...this.monthlyData]
    };

    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Please select both start and end dates';
      this.isLoading = false;
      return;
    }

    const start = new Date(this.startDate);
    let end = new Date(this.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.errorMessage = 'Invalid date range';
      this.isLoading = false;
      return;
    }

    end.setHours(23, 59, 59, 999);
    const userId = this.currentUser?.id;
    
    if (!userId) {
      this.errorMessage = 'Test user ID not set';
      this.isLoading = false;
      return;
    }


    this.reportingService.getUserTransactionSummary(userId, start, end).subscribe({
      next: (summary: any) => {
        console.log('Transaction summary (raw):', summary);
        
        this.transactions = [];
        this.totalTransactions = 0;
        this.totalIncoming = 0;
        this.totalOutgoing = 0;
        this.netBalance = 0;
        this.totalSend = 0;
        this.totalReceive = 0;
        this.transactionsByType = {};
        this.monthlyData = [];
        this.monthlyMap.clear();
        
        if (summary) {
          console.log('Summary data available, attempting to set values');
          this.totalTransactions = summary.totalTransactions || 0;
          this.totalIncoming = summary.totalReceived || 0;
          this.totalOutgoing = summary.totalSent || 0;
          this.netBalance = summary.netBalance || 0;
          console.log('After setting values:', {
            totalTransactions: this.totalTransactions,
            totalIncoming: this.totalIncoming,
            totalOutgoing: this.totalOutgoing,
            netBalance: this.netBalance
          });
        } else {
          console.error('Summary data is undefined or null');
          this.totalTransactions = prevValues.totalTransactions;
          this.totalIncoming = prevValues.totalIncoming;
          this.totalOutgoing = prevValues.totalOutgoing;
          this.netBalance = prevValues.netBalance;
        }
        
        this.reportingService.getUserActivity(userId, start, end).subscribe({
          next: (activity: any) => {
            try {
              interface BackendTransaction {
                transactionId: number;
                amount: number;
                timestamp: string;
                description: string;
                receiverUsername: string;
                senderUsername: string;
                status: string;
              }
              
              this.transactions = Array.isArray(activity?.transactions) ? activity.transactions.map((t: BackendTransaction) => {
                let transactionType = 'UNKNOWN';
                const isSender = t.senderUsername === this.currentUser?.username;
                const isReceiver = t.receiverUsername === this.currentUser?.username;
                
                if (isSender && isReceiver) {
                  transactionType = 'TRANSFER';
                } else if (isSender) {
                  transactionType = 'SEND';
                } else if (isReceiver) {
                  transactionType = 'RECEIVE';
                } else if (t.senderUsername && t.receiverUsername) {
                  transactionType = 'SYSTEM';
                }

                console.log('Processing transaction:', {
                  id: t.transactionId,
                  amount: t.amount,
                  type: transactionType,
                  sender: t.senderUsername,
                  receiver: t.receiverUsername,
                  currentUser: this.currentUser?.username
                });

                return {
                  id: t.transactionId,
                  amount: t.amount,
                  type: transactionType,
                  timestamp: t.timestamp,
                  description: t.description || 'No description',
                  receiverUsername: t.receiverUsername,
                  senderUsername: t.senderUsername,
                  status: t.status || 'COMPLETED'
                };
              }) : [];
              this.analyzeTransactions();
            } catch (error) {
              console.error('Error analyzing transactions:', error);
              this.errorMessage = 'Error processing transaction data';
            } finally {
              this.isLoading = false;
              // If we still have no data after analysis, restore previous values
              if (this.transactions.length === 0) {
                this.transactions = prevValues.transactions;
                this.transactionsByType = prevValues.transactionsByType;
                this.monthlyData = prevValues.monthlyData;
                this.totalSend = prevValues.totalSend;
                this.totalReceive = prevValues.totalReceive;
                if (this.totalTransactions === 0) this.totalTransactions = prevValues.totalTransactions;
                if (this.totalIncoming === 0) this.totalIncoming = prevValues.totalIncoming;
                if (this.totalOutgoing === 0) this.totalOutgoing = prevValues.totalOutgoing;
                if (this.netBalance === 0) this.netBalance = prevValues.netBalance;
              }
            }
          },
          error: (err) => {
            console.error('Error loading activity:', err);
            this.errorMessage = 'Failed to load transaction details';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading summary:', err);
        this.errorMessage = 'Failed to load transaction summary';
        this.isLoading = false;
      }
    });
  }

  private analyzeTransactions(): void {
    try {
      console.log('Analyzing transactions:', this.transactions);
      
      this.totalTransactions = this.transactions.length;
      this.totalIncoming = 0;
      this.totalOutgoing = 0;
      this.totalSend = 0;
      this.totalReceive = 0;
      this.transactionsByType = {};
      this.monthlyData = [];
      this.monthlyMap.clear();

      if (!this.transactions || this.transactions.length === 0) {
        console.log('No transactions to analyze');
        this.netBalance = 0;
        return;
      }

      this.transactions.forEach((transaction: Transaction) => {
        if (!transaction) return;
        
        const amount = Number(transaction.amount) || 0;
        const type = (transaction.type || 'UNKNOWN').toUpperCase();
        const isIncoming = type === 'RECEIVE' || type === 'DEPOSIT';
        
        console.log('Processing transaction for summary:', {
          id: transaction.id,
          type,
          amount,
          sender: transaction.senderUsername,
          receiver: transaction.receiverUsername,
          isIncoming
        });

        this.transactionsByType[type] = (this.transactionsByType[type] || 0) + 1;

        switch (type) {
          case 'SEND':
            this.totalOutgoing += amount;
            this.totalSend += amount;
            break;
            
          case 'RECEIVE':
            this.totalIncoming += amount;
            this.totalReceive += amount;
            break;
            
          case 'DEPOSIT':
            this.totalIncoming += amount;
            this.totalReceive += amount;
            break;
            
          case 'WITHDRAWAL':
            this.totalOutgoing += amount;
            this.totalSend += amount;
            break;
            
          case 'TRANSFER':
            if (transaction.senderUsername === this.currentUser?.username) {
              this.totalOutgoing += amount;
              this.totalSend += amount;
            } else if (transaction.receiverUsername === this.currentUser?.username) {
              this.totalIncoming += amount;
              this.totalReceive += amount;
            }
            break;
            
          default:
            console.warn('Unknown transaction type:', type);
            if (transaction.senderUsername === this.currentUser?.username) {
              this.totalOutgoing += amount;
            } else if (transaction.receiverUsername === this.currentUser?.username) {
              this.totalIncoming += amount;
            }
        }

        this.updateMonthlyData(transaction, amount, type, isIncoming);
      });

      this.updateMonthlyDataArray();
      this.netBalance = this.totalIncoming - this.totalOutgoing;
      
      console.log('Analysis complete:', {
        totalTransactions: this.totalTransactions,
        totalIncoming: this.totalIncoming,
        totalOutgoing: this.totalOutgoing,
        totalSend: this.totalSend,
        totalReceive: this.totalReceive,
        netBalance: this.netBalance,
        transactionsByType: this.transactionsByType
      });
    } catch (error) {
      console.error('Error in analyzeTransactions:', error);
      this.errorMessage = 'Error analyzing transactions';
    }
  }

  private isIncomingTransaction(transaction: Transaction, type: string): boolean {
    if (!this.currentUser) return false;
    return type === 'DEPOSIT' || 
           (transaction.receiverUsername && this.currentUser.username === transaction.receiverUsername) || 
           type === 'RECEIVE';
  }

  private updateMonthlyData(transaction: Transaction, amount: number, type: string, isIncoming: boolean): void {
    if (!transaction.timestamp) return;

    const monthKey = this.datePipe.transform(new Date(transaction.timestamp), 'yyyy-MM') || '';
    if (!monthKey) return;

    if (!this.monthlyMap.has(monthKey)) {
      this.monthlyMap.set(monthKey, { 
        incoming: 0, 
        outgoing: 0, 
        sendAmount: 0, 
        receiveAmount: 0, 
        netSendReceive: 0 
      });
    }

    const monthData = this.monthlyMap.get(monthKey);
    if (!monthData) return;

    if (type === 'SEND') {
      monthData.outgoing += amount;
      monthData.sendAmount += amount;
    } else if (type === 'RECEIVE') {
      monthData.incoming += amount;
      monthData.receiveAmount += amount;
    } else if (type === 'DEPOSIT') {
      monthData.incoming += amount;
    } else if (type === 'WITHDRAWAL') {
      monthData.outgoing += amount;
    }
    
    monthData.netSendReceive = monthData.receiveAmount - monthData.sendAmount;
  }

  private updateMonthlyDataArray(): void {
    this.monthlyData = Array.from(this.monthlyMap.entries()).map(([month, data]) => ({
      month,
      incoming: data.incoming,
      outgoing: data.outgoing,
      sendAmount: data.sendAmount,
      receiveAmount: data.receiveAmount,
      netSendReceive: data.netSendReceive
    }));

    this.monthlyData.sort((a, b) => a.month.localeCompare(b.month));
  }

  getObjectKeys(obj: Record<string, unknown>): string[] {
    if (!obj) return [];
    return Object.keys(obj);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
