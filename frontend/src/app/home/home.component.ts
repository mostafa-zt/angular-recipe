import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute) { }

  newRecipes: Recipe[];

  ngOnInit(): void {
    this.getNewRecipes();
  }

  getNewRecipes() {
    this.recipeService.getNewRecipes().subscribe(response => {
      this.newRecipes = response as any;
    })
  }
}
