import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Ingredient } from '../../shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { mimeType } from '../../shared/mime-type.validator';
import { Alert, AlertType } from '../../alert/alert.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
  animations: [
    trigger('listEffect', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-100px)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          transform: 'translateX(100px)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class RecipeEditComponent implements OnInit {
  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }
  id?: string = null;
  editMode: boolean = false;
  recipeForm: FormGroup;
  imagePreview: string;
  alert: Alert = null

  ngOnInit(): void {
    // Retrieve Id params
    // this.route.params.subscribe((params: Params) => {
    //   this.id = params['id'];
    //   this.editMode = params['id'] != null;
    //   this.initForm();
    // })
    this.route.data.subscribe(res => {
      if (res.recipeResolver) {
        const recipe = res.recipeResolver.data;
        this.editMode = this.route.snapshot.params['id'] !== null;
        this.id = this.route.snapshot.params['id'];
        this.initForm(recipe);
      }
      else {
        this.initForm(null);
      }
    })
  }

  onImagePickedChanged(event: Event) {
    if ((event.target as HTMLInputElement).files[0]) {
      const file = (event.target as HTMLInputElement).files[0];
      this.recipeForm.patchValue({ image: file });
      this.recipeForm.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const name = this.recipeForm.value['name'];
    const image = this.recipeForm.value['image'];
    const description = this.recipeForm.value['description'];
    const ingredients = this.recipeForm.value['ingredients'];
    // const newRecipe: Recipe = {
    //   _id: this.id, description: description, ingredients: ingredients, name: name, imagePath: ''
    // };
    let formData: FormData | Recipe;
    formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("_id", this.id);
    if (this.editMode) {
      if (typeof (image) === 'object') {
        formData.append("image", image, name);
      } else {
        // formData = {
        //   _id: this.id, description: description, ingredients: ingredients, name: name, imagePath: image
        // };
        formData.append("imagePath", image);
      }
      this.recipeService.updateRecipe(formData).subscribe(response => {
        debugger;
        if (response.success) {
          this.recipeService.replaceRecipe(response.data._id, response.data);
          this.recipeService.recipesChanged.next(this.recipeService.getRecipes());
          this.alert = new Alert(AlertType.Success, [{ msg: response.message as string }]);
          // this.onCancel();
        }
        else {
          this.alert = new Alert(AlertType.Warning);
          if (response.message instanceof Array) {
            response.message.forEach(msg => {
              this.alert.messages.push({ msg: msg });
            });
          }
          if (response.message instanceof String) {
            this.alert.messages.push({ msg: response.message as string });
          }
        }
      });
    }
    else {
      formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("_id", this.id);
      formData.append("image", image, name);
      this.recipeService.addRecipe(formData).subscribe(response => {
        debugger;
        if (response.success) {
          this.recipeService.setRecipe(response.data);
          this.recipeService.recipesChanged.next(this.recipeService.getRecipes());
          this.alert = new Alert(AlertType.Success, [{ msg: response.message as string }]);
          // this.onCancel();
        } else {
          this.alert = new Alert(AlertType.Warning);
          if (response.message instanceof Array) {
            response.message.forEach(msg => {
              this.alert.messages.push({ msg: msg });
            });
          }
          if (response.message instanceof String) {
            this.alert.messages.push({ msg: response.message as string });
          }
        }
        this.recipeForm.reset();
      });
    }
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
  }

  onCloseAlertMessage() {
    this.alert = null
  }

  getIngredientControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  addIngredient() {
    (this.recipeForm.get('ingredients') as FormArray).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern("^[1-9]+[0-9]*$")])
    }))
  }

  private initForm(recipe: Recipe) {
    let recipeName = '';
    let image = null;
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    if (this.editMode) {
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      // recipeImagePath = recipe.imagePath;
      if (recipe.ingredients.length > 0) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(new FormGroup({
            'name': new FormControl(ingredient.name, Validators.required),
            'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern("^[1-9]+[0-9]*$")]),
          }));
        }
      }
      this.imagePreview = recipe.imagePath;
      image = recipe.imagePath;
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'image': new FormControl(image, Validators.required, mimeType),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }
}
