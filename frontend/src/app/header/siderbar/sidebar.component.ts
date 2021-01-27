import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
})
export class AppSideBarComponent implements OnInit, OnDestroy {
    constructor(private http: HttpClient,
        private authService: AuthService) { }

    ngOnInit(): void {
        this.userIsAuthenticated = this.authService.getIsAuthenticated();
        this.subscription = this.authService.getAuthStatusListenerAsObservable()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    @Input() showSidebar: boolean = false;
    @Output() sidebarStateChanged = new EventEmitter<boolean>();
    userIsAuthenticated: boolean = false;
    subscription: Subscription;

    show() {
        this.showSidebar = !this.showSidebar;
        this.sidebarStateChanged.emit(this.showSidebar);
    }

    onLogout() {
        this.authService.logout();
        this.show();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}