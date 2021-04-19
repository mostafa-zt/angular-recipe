import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  constructor(private recipeService: RecipeService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute) {
    this.spinner.hide();
  }

  // recipes: Recipe[] = [
  //   new Recipe("Recipe 1", "This is recipe one", "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872"),
  //   new Recipe("Recipe 2", "This is recipe two", "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872")
  // ]

  batch: number = 2;          //number of data for every query to datbase
  lastEntity: Recipe;         //last entity
  finished: boolean = false   //is last entity?

  recipes: Array<Recipe>;
  subscription: Subscription;
  // @Output() recipeSelected = new EventEmitter<Recipe>();

  pageIsLoading: boolean = false;

  ngOnInit() {
    // this.recipes = this.recipeService.getRecipes();
    this.pageIsLoading = true;
    this.recipeService.getRecipesFromServer(this.batch).subscribe(response => {
      const recipesLoaded = (response as any).recipes as Array<Recipe>
      this.recipes = recipesLoaded;
      this.recipeService.setRecipes(this.recipes);
      this.lastEntity = recipesLoaded[recipesLoaded.length - 1];
      this.pageIsLoading = false;
    })
    this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Array<Recipe>) => {
      this.recipes = recipes;
    })
  }

  loadOnScroll() {
    if (this.finished) return;
    if (this.pageIsLoading) return;
    this.spinner.show();
    const skip = this.recipes && this.recipes.length;
    this.recipeService.getRecipesFromServer(this.batch, skip).subscribe(result => {
      this.spinner.hide();
      if ((result as any).recipes.length > 0) {
        const loadedRecipes = (result as any).recipes as Recipe[];
        if (this.lastEntity._id === loadedRecipes[loadedRecipes.length - 1]._id) {
          this.finished = true;
        }
        this.lastEntity = loadedRecipes[loadedRecipes.length - 1];
        this.recipes = [...this.recipes, ...loadedRecipes];
        this.recipeService.setRecipes(this.recipes);
      } else
        this.finished = true;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // onRecipeSelected(recipe: Recipe) {
  //   this.recipeSelected.emit(recipe);
  // }
  // onNewRecipe() {
  //   this.router.navigate(['new'], { relativeTo: this.route })
  // }
}
