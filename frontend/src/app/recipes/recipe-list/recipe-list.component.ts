import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  constructor(private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute) { }

  // recipes: Recipe[] = [
  //   new Recipe("Recipe 1", "This is recipe one", "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872"),
  //   new Recipe("Recipe 2", "This is recipe two", "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872")
  // ]

  recipes: Array<Recipe>;
  subscription: Subscription
  // @Output() recipeSelected = new EventEmitter<Recipe>();

  ngOnInit() {
    // this.recipes = this.recipeService.getRecipes();
    this.recipeService.getRecipesFromServer().subscribe(response => {
      this.recipes = (response as any).recipes as Array<Recipe>;
      this.recipeService.setRecipes(this.recipes);
    })
    this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Array<Recipe>) => {
      this.recipes = recipes;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // onRecipeSelected(recipe: Recipe) {
  //   this.recipeSelected.emit(recipe);
  // }
  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }
}
