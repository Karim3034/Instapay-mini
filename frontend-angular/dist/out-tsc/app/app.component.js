import { __decorate } from "tslib";
import { Component } from '@angular/core';
let AppComponent = class AppComponent {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
        this.title = 'Mini-InstaPay';
        this.isLoggedIn = false;
    }
    ngOnInit() {
        this.authService.currentUser.subscribe(user => {
            this.isLoggedIn = !!user;
            this.username = user?.username;
        });
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map