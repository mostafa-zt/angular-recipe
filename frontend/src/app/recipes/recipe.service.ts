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

    private recipes: Recipe[] = [];

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

    getRecipeOne(id: string) {
        return this.http.get<ResponseData>(`${environment.apiUrl}/recipe`, { params: new HttpParams().set('id', id) });
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

    getRecipesFromServer(count: number, skip?: number) {
        const request = this.http.get(`${environment.apiUrl}/get-recipes?count=${count}&skip=${skip}`);
        return request;
    }

    getNewRecipes() {
        const request = this.http.get<ResponseData>(environment.apiUrl + '/new-recipes');
        return request;
    }

    getAllRecipes(count: number, skip?: number) {
        const request = this.http.get(environment.apiUrl + `/all-recipes?count=${count}&skip=${skip}`);
        return request;
    }
}