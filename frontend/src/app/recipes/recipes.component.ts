import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  // providers: [RecipeService]
})
// @Injectable()
export class RecipesComponent implements OnInit {

  constructor(private recipeService: RecipeService,
              private titleService: Title,
              private router: Router,
              private route: ActivatedRoute) {
    this.titleService.setTitle("Recipe");
  }
  selectedRecipe: Recipe;

  ngOnInit() {
    this.recipeService.recipeSelected.subscribe(
      (recipe: Recipe) => {
        this.selectedRecipe = recipe;
      }
    );
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route })
  }

}
