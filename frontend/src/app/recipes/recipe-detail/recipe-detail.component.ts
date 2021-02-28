import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/modal/modal.service';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private shoppingListService: ShoppingListService,
    private modalService: ModalService) { }

  // @Input() recipe: Recipe;
  recipe: Recipe;
  id: string;

  ngOnInit() {
    // const id = this.route.snapshot.params['id'];

    // this.route.params.subscribe((params: Params) => {
    //   this.id = params['id'];
    //   this.recipeService.getRecipeFromServer(this.id).subscribe(response => {
    //     this.recipe = response.data;
    //   });
    // });

    // resolver
    this.route.data.subscribe(response => {
      this.recipe = response.recipeResolver.data;
      this.id = this.route.snapshot.params['id'];
    })
  }

  onAddToShoppingList() {
    if (this.recipe.ingredients.length <= 0)
    {
      this.modalService.showModal();
      return;
    }
    const shoppingList = this.recipe.ingredients.map(ing => {
      return { name: ing.name, amount: ing.amount, _id: null, creator: null }
    });
    this.shoppingListService.addIngredientsFromRecipe(shoppingList);
    this.modalService.showModal();
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.id).subscribe(response => {
      this.recipeService.removeRecipe(this.id);
      this.router.navigate(['/recipes']);
    })
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../',this.id, 'edit'], { relativeTo: this.route });
  }

  onCloseModal() {
    this.modalService.hideModal();
  }
}
