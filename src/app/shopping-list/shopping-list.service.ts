import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

@Injectable()
export class ShoppingListService {
    constructor(private http: HttpClient) { }

    ingredientChanged = new EventEmitter<Array<Ingredient>>();
    startedEditing = new Subject<number>();
    public changesSaved: boolean = false;
    private ingredients: Array<Ingredient> = [];
    private oldIngredients: Array<Ingredient>;
    public hasImportedFromRecipe: boolean = false;

    getIngredients() {
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientChanged.emit(this.ingredients.slice());
    }

    addIngredientsFromRecipe(ingredients: Array<Ingredient>) {
        debugger;
        this.ingredients.push(...ingredients);
        this.hasImportedFromRecipe = true
        this.ingredientChanged.emit(this.ingredients.slice());
    }

    updateIngredient(index: number, updatedIngredient: Ingredient) {
        this.ingredients[index] = updatedIngredient;
        this.ingredientChanged.emit(this.ingredients.slice());
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    delete(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientChanged.emit(this.ingredients.slice());
    }

    save() {
        debugger;
        const addedIngredients = this.ingredients.filter(ing => !ing._id);
        const deletdIngredients = this.oldIngredients.filter(item => !this.ingredients.some(item2 => item._id === item2._id));
        const updatedIngredients = this.ingredients.filter(item => this.oldIngredients.some(item2 => (item.amount !== item2.amount || item.name !== item2.name) && item._id === item2._id));

        if (updatedIngredients.length > 0)
            this.http.post('api/update-shopping-list', updatedIngredients)
                .subscribe(res => {
                    console.log(res);
                    // this.changesSaved = true
                });
        if (addedIngredients.length > 0)
            this.http.post('api/create-shopping-list', addedIngredients)
                .subscribe(res => {
                    console.log(res);
                    // this.changesSaved = true;
                });

        if (deletdIngredients.length > 0)
            this.http.post('api/delete-shopping-list', deletdIngredients)
                .subscribe(res => {
                    console.log(res);
                    // this.changesSaved = true;
                });
        this.changesSaved = true
    }

    setIngredients(ings: Array<Ingredient>) {
        // this.ingredients = ings;
        // this.oldIngredients = [...ings];
        this.ingredients.push(...ings);
        this.oldIngredients = [...ings];
        if (this.hasImportedFromRecipe)
            this.ingredientChanged.next(this.ingredients.slice());
    }

    clearIngredients() {
        this.ingredients = [];
    }

    getShoppingListFromServer() {
        const request = this.http.get('api/get-shopping-list');
        this.ingredientChanged.emit(this.ingredients.slice());
        return request;
    }
}