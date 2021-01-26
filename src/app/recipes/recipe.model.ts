import { Ingredient } from "../shared/ingredient.model";

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Array<Ingredient>
  public _id?: string;

  constructor(name: string, desc: string, imagePath: string, ingredients: Array<Ingredient>, id?: string) {
    this._id = id;
    this.name = name;
    this.description = desc;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
