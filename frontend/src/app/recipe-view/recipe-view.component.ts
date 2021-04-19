import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Component({
  selector: 'app-recipe-view',
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.css']
})
export class RecipeViewComponent implements OnInit {

  recipe: Recipe;
  id: string;

  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getRecipe();

  }

  getRecipe() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.recipeService.getRecipeOne(this.id).subscribe(response => {
        this.recipe = response.data;
      });
    });
  }

}
