import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.css'],
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate("1s 100ms ease-out")
      ])
    ])
  ]
})
export class AllRecipesComponent implements OnInit {

  constructor(private recipeService: RecipeService, private spinner: NgxSpinnerService) { }

  recipes: Recipe[];
  batch: number = 3;          //number of data for every query to datbase
  lastEntity: Recipe;         //last entity
  finished: boolean = false   //is last entity?

  pageIsLoading: boolean = false;

  ngOnInit(): void {
    this.getAllRecipes();
  }

  getAllRecipes() {
    this.pageIsLoading = true;
    this.recipeService.getAllRecipes(this.batch).subscribe(result => {
      const recipes = (result as any).recipes as Recipe[];
      this.recipes = recipes;
      this.lastEntity = recipes[recipes.length - 1];
      this.pageIsLoading = false;
    })
  }

  loadOnScroll() {
    if (this.pageIsLoading) return;
    if (this.finished) return;
    this.spinner.show();
    const skip = this.recipes && this.recipes.length;
    this.recipeService.getAllRecipes(this.batch, skip).subscribe(result => {
      this.spinner.hide();
      if ((result as any).recipes.length > 0) {
        const loadedRecipes = (result as any).recipes as Recipe[];
        if (this.lastEntity._id === loadedRecipes[loadedRecipes.length - 1]._id) {
          this.finished = true;
        }
        this.lastEntity = loadedRecipes[loadedRecipes.length - 1];
        this.recipes = [...this.recipes, ...loadedRecipes];
        // this.recipeService.setRecipes(this.recipes);
      } else
        this.finished = true;
    })
  }

}
