import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { RecipeService } from '../recipes/recipe.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private http: HttpClient,
    // private recipeService: RecipeService,
    private shoppingList: ShoppingListService,
    private authService: AuthService) { }

  // @Output() featureSelected = new EventEmitter<string>()
  sidebarIsOpen: boolean = false;
  userIsAuthenticated: boolean = false;
  subscription: Subscription;

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.subscription = this.authService.getAuthStatusListenerAsObservable()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openSidebar() {
    this.sidebarIsOpen = !this.sidebarIsOpen;
  }

  onLogout() {
    this.authService.logout();
  }
}
