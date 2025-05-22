import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators'; // Add 'map' here
const AUTH_API = '/api/auth/';
// Then in your auth service, update the response type
let AuthService = class AuthService {
    constructor(http) {
        this.http = http;
        this.currentUserSubject = new BehaviorSubject(this.getCurrentUser());
        this.currentUser = this.currentUserSubject.asObservable();
    }
    login(username, password) {
        const credentials = { username, password };
        return this.http.post('/api/auth/signin', credentials)
            .pipe(map((response) => {
            if (response && response.token) {
                // Store user details and token in local storage
                const user = {
                    username: username,
                    token: response.token
                };
                localStorage.setItem('user', JSON.stringify(user));
                this.currentUserSubject.next(user);
            }
            return response;
        }));
    }
    logout() {
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }
    register(username, email, password, fullName) {
        const signupEndpoint = '/api/auth/signup';
        console.log('Registering user with endpoint:', signupEndpoint);
        console.log('Registration data:', { username, email, password: '******', fullName });
        return this.http.post(signupEndpoint, {
            username,
            email,
            password,
            fullName
        });
    }
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    updateProfile(fullName, email) {
        const user = this.getCurrentUser();
        if (!user) {
            throw new Error('No authenticated user found');
        }
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            })
        };
        return this.http.put('/api/users/profile', {
            fullName,
            email
        }, httpOptions).pipe(tap(response => {
            // Update stored user if the response contains user data
            if (response) {
                const updatedUser = { ...user, ...response };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                this.currentUserSubject.next(updatedUser);
            }
        }));
    }
    getAuthHeader() {
        const user = this.getCurrentUser();
        if (user && user.token) {
            return new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            });
        }
        else {
            return new HttpHeaders({
                'Content-Type': 'application/json'
            });
        }
    }
    isLoggedIn() {
        return !!this.getCurrentUser();
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map