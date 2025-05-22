import { __decorate } from "tslib";
import { Component } from '@angular/core';
let NotificationsComponent = class NotificationsComponent {
    constructor(authService, notificationService, router) {
        this.authService = authService;
        this.notificationService = notificationService;
        this.router = router;
        this.currentUser = null;
        this.notifications = [];
        this.isLoading = true;
        this.errorMessage = '';
        this.notificationSubscription = null;
    }
    ngOnInit() {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return;
        }
        this.currentUser = this.authService.getCurrentUser();
        this.loadNotifications();
        // Subscribe to notifications updates
        this.notificationSubscription = this.notificationService.notifications$.subscribe(notifications => {
            this.notifications = notifications;
            this.isLoading = false;
        });
    }
    ngOnDestroy() {
        if (this.notificationSubscription) {
            this.notificationSubscription.unsubscribe();
        }
    }
    loadNotifications() {
        this.isLoading = true;
        this.errorMessage = '';
        this.notificationService.loadNotifications();
    }
    markAsRead(notification) {
        this.notificationService.markAsRead(notification.id).subscribe({
            next: () => {
                // Update the notification in the local array
                notification.read = true;
                // Refresh the notifications list
                this.notificationService.loadNotifications();
            },
            error: (err) => {
                this.errorMessage = 'Failed to mark notification as read';
                console.error(err);
            }
        });
    }
    markAllAsRead() {
        this.notificationService.markAllAsRead().subscribe({
            next: () => {
                // Refresh the notifications list
                this.notificationService.loadNotifications();
            },
            error: (err) => {
                this.errorMessage = 'Failed to mark all notifications as read';
                console.error(err);
            }
        });
    }
    deleteNotification(notification, event) {
        event.stopPropagation(); // Prevent triggering the parent click event
        this.notificationService.deleteNotification(notification.id).subscribe({
            next: () => {
                // Refresh the notifications list
                this.notificationService.loadNotifications();
            },
            error: (err) => {
                this.errorMessage = 'Failed to delete notification';
                console.error(err);
            }
        });
    }
    // For testing purposes - add a mock notification
    addMockNotification() {
        const mockNotification = {
            id: 'mock-' + Date.now(),
            title: 'Test Notification',
            message: 'This is a test notification added manually.',
            timestamp: new Date(),
            read: false,
            type: 'INFO'
        };
        this.notificationService.addMockNotification(mockNotification);
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
};
NotificationsComponent = __decorate([
    Component({
        selector: 'app-notifications',
        templateUrl: './notifications.component.html',
        styleUrls: ['./notifications.component.css']
    })
], NotificationsComponent);
export { NotificationsComponent };
//# sourceMappingURL=notifications.component.js.map