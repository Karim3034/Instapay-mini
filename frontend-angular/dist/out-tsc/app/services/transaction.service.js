import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
const API_URL = '/api/transactions/';
let TransactionService = class TransactionService {
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    createTransaction(transactionData) {
        return this.http.post(API_URL, transactionData, {
            headers: this.authService.getAuthHeader()
        });
    }
    getTransactionById(id) {
        return this.http.get(API_URL + id, {
            headers: this.authService.getAuthHeader()
        });
    }
    getUserTransactions(username) {
        return this.http.get(API_URL + 'user/' + username, {
            headers: this.authService.getAuthHeader()
        });
    }
    getCurrentUserTransactions() {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            throw new Error('No authenticated user found');
        }
        return this.getUserTransactions(currentUser.username);
    }
    getTransactionsByType(type) {
        return this.http.get(API_URL + 'type/' + type, {
            headers: this.authService.getAuthHeader()
        });
    }
    getTransactionsByDateRange(startDate, endDate) {
        const params = new HttpParams()
            .set('start', startDate.toISOString())
            .set('end', endDate.toISOString());
        return this.http.get(API_URL + 'date-range', {
            params,
            headers: this.authService.getAuthHeader()
        });
    }
    sendMoney(receiverUsername, amount, description) {
        const transactionData = {
            type: 'TRANSFER',
            amount: amount,
            receiverUsername: receiverUsername,
            description: description || `Transfer to ${receiverUsername}`
        };
        return this.createTransaction(transactionData);
    }
};
TransactionService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], TransactionService);
export { TransactionService };
//# sourceMappingURL=transaction.service.js.map