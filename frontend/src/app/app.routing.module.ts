import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";
import { RecipeStartComponent } from "./recipes/recipe-start/recipe-start.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeGetResolverService } from "./recipes/recipe-get-resolver.service";
import { CanDeactivateGuard } from "./shopping-list/can-deactivate-guard.service";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";

const appRoutes: Routes = [
    { path: "", redirectTo: "/recipes", pathMatch: "full" , canActivate: [AuthGuard] },
    {
        path: "recipes", component: RecipesComponent, canActivate: [AuthGuard] , children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: { recipeResolver: RecipeGetResolverService } },
            { path: ':id/edit', component: RecipeEditComponent, resolve: { recipeResolver: RecipeGetResolverService } },
        ]
    },
    { path: "shopping-list", component: ShoppingListComponent, canActivate: [AuthGuard] , canDeactivate: [CanDeactivateGuard] },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {

}