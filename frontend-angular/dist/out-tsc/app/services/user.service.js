import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
const API_URL = '/api/users/';
let UserService = class UserService {
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
    }
    getCurrentUserProfile() {
        return this.http.get(API_URL + 'me', {
            headers: this.authService.getAuthHeader()
        });
    }
    getUserById(id) {
        return this.http.get(API_URL + id, {
            headers: this.authService.getAuthHeader()
        });
    }
    updateProfile(profileData) {
        return this.http.put(API_URL + 'profile', profileData, {
            headers: this.authService.getAuthHeader()
        });
    }
    transferMoney(toUsername, amount) {
        return this.http.post(API_URL + 'transfer', {
            toUsername,
            amount
        }, {
            headers: this.authService.getAuthHeader()
        });
    }
    getAllUsers() {
        return this.http.get(API_URL, {
            headers: this.authService.getAuthHeader()
        });
    }
};
UserService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map