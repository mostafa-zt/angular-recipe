import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { ResponseData } from '../shared/responseData.model';

@Injectable()
export class RecipeService {
    constructor(shoppingListService: ShoppingListService, private http: HttpClient) {
        this.shoppingListService = shoppingListService;
    }
    shoppingListService: ShoppingListService
    recipeSelected = new EventEmitter<Recipe>();
    recipesChanged = new Subject<Array<Recipe>>();

    private recipes: Recipe[] = [
        new Recipe("Recipe 1",
            "This is recipe one",
            "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872",
            [
                new Ingredient("Tomato", 5),
                new Ingredient("Potato", 1),
                new Ingredient("Garlic", 3),
                new Ingredient("Pasta Tomato", 2),
            ], null),
        new Recipe("Recipe 2", "This is recipe two", "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=960,872",
            [
                new Ingredient("Tomato", 5),
                new Ingredient("Rice", 1),
                new Ingredient("Apple", 3),
                new Ingredient("Pasta Tomato", 2),
            ])
    ];

    getRecipes() {
        return this.recipes.slice();
    }
    setRecipes(recipes: Array<Recipe>) {
        this.recipes = recipes;
    }
    setRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
    }
    public replaceRecipe(id: string, recipe: Recipe) {
        const foundRecipeIndex = this.recipes.findIndex(recipe => recipe._id === id);
        this.recipes[foundRecipeIndex] = recipe;
    }

    // AddIngredientToShopingList(recipe: Recipe) {
    //     const IIngredient = recipe.ingredients.map(ing => {
    //         return { name: ing.name, amount: ing.amount, _id: null }
    //     })
    //     this.shoppingListService.addIngredientsFromRecipe(IIngredient);
    // }

    getRecipe(id: string): Recipe {
        const foundRecipeIndex = this.recipes.findIndex(rec => rec._id == id);
        return this.recipes[foundRecipeIndex];
    }

    getRecipeFromServer(id: string) {
        return this.http.get<ResponseData>(`${environment.apiUrl}/get-recipe`, { params: new HttpParams().set('id', id) });
    }

    addRecipe(recipe: any) {
        const request = this.http.post<ResponseData>(`${environment.apiUrl}/create-recipe`, recipe);
        return request;
    }

    updateRecipe(recipe: Recipe | FormData) {
        const request = this.http.put<ResponseData>(`${environment.apiUrl}/update-recipe`, recipe);
        return request;
        // const foundRecipeIndex = this.recipes.findIndex(rec => rec._id === recipe._id);
        // this.recipes[foundRecipeIndex] = recipe;
        // this.recipesChanged.next(this.recipes.slice());
    }

    removeRecipe(id: string) {
        const recipeIndex = this.recipes.findIndex(rec => rec._id === id);
        this.recipes.splice(recipeIndex, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(id: string) {
        const request = this.http.delete<ResponseData>(`${environment.apiUrl}/delete-recipe`, { params: new HttpParams().set('id', id) });
        return request;
        // const recipeIndex = this.recipes.findIndex(rec => rec._id === id);
        // this.recipes.splice(recipeIndex, 1);
        // this.recipesChanged.next(this.recipes.slice());
    }

    saveRecipes() {
        const recipes = this.getRecipes();
        return this.http.post(`${environment.apiUrl}/recipe`, recipes);
    }

    getRecipesFromServer() {
        const request = this.http.get(`${environment.apiUrl}/get-recipes`);
        return request;
    }
}