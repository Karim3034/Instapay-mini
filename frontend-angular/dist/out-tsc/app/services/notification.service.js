import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
const API_URL = '/api/notifications/';
let NotificationService = class NotificationService {
    constructor(http, authService) {
        this.http = http;
        this.authService = authService;
        this.notifications = new BehaviorSubject([]);
        this.notifications$ = this.notifications.asObservable();
        this.unreadCount = new BehaviorSubject(0);
        this.unreadCount$ = this.unreadCount.asObservable();
        // Load notifications when service is initialized
        this.loadNotifications();
    }
    loadNotifications() {
        if (this.authService.isLoggedIn()) {
            this.getUserNotifications().subscribe({
                next: (data) => {
                    this.notifications.next(data);
                    this.updateUnreadCount(data);
                },
                error: (err) => {
                    console.error('Failed to load notifications', err);
                }
            });
        }
    }
    updateUnreadCount(notifications) {
        const count = notifications.filter(n => !n.read).length;
        this.unreadCount.next(count);
    }
    getUserNotifications() {
        return this.http.get(API_URL, {
            headers: this.authService.getAuthHeader()
        });
    }
    markAsRead(notificationId) {
        return this.http.put(`${API_URL}${notificationId}/read`, {}, {
            headers: this.authService.getAuthHeader()
        });
    }
    markAllAsRead() {
        return this.http.put(`${API_URL}read-all`, {}, {
            headers: this.authService.getAuthHeader()
        });
    }
    deleteNotification(notificationId) {
        return this.http.delete(`${API_URL}${notificationId}`, {
            headers: this.authService.getAuthHeader()
        });
    }
    // Method to simulate receiving a new notification (for testing)
    addMockNotification(notification) {
        const currentNotifications = this.notifications.getValue();
        const updatedNotifications = [notification, ...currentNotifications];
        this.notifications.next(updatedNotifications);
        this.updateUnreadCount(updatedNotifications);
    }
};
NotificationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NotificationService);
export { NotificationService };
//# sourceMappingURL=notification.service.js.map