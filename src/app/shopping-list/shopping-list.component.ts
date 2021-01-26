import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from '../modal/modal.service';
import { Ingredient } from '../shared/ingredient.model';
import { CanComponentDeactivate } from './can-deactivate-guard.service';
import { ShoppingListService } from './shopping-list.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  animations: [
    trigger('listEffect', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, }),
        animate(300)
      ]),
      // transition('* => void', [
      //   animate(300, style({
      //     opacity: 0
      //   }))
      // ])
    ])
  ]
})

export class ShoppingListComponent implements OnInit, CanComponentDeactivate, OnDestroy {
  constructor(private shoppingListService: ShoppingListService,
    private modalService: ModalService,
    private titleService: Title) {
      this.titleService.setTitle("Recipe | Shopping List");
     }

  hasChanged: boolean = false;
  ingredients: Array<Ingredient> = [];

  ngOnDestroy(): void {
    this.shoppingListService.changesSaved = false;
    this.ingredients = [];
    this.shoppingListService.clearIngredients();
    this.hasChanged = false;
    this.shoppingListService.hasImportedFromRecipe = false;
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.shoppingListService.changesSaved && this.hasChanged) {
      this.modalService.showModal();
      return this.modalService.navigateAwaySelection;
    }
    return true;
  }

  ConfirmModalUI(choice: boolean): void {
    this.modalService.navigateAwaySelection.next(choice);
    this.modalService.hideModal();
  }

  onSaveAllShoppingList() {
    this.shoppingListService.save();
  }

  onEditItem(index: number) {
    this.shoppingListService.startedEditing.next(index);
  }

  dataHasChanged() {
    this.hasChanged = true;
  }

  ngOnInit() {
    this.shoppingListService.getShoppingListFromServer().subscribe(response => {
      this.ingredients.push(...(response as any).ingredients as Array<Ingredient>)
      this.shoppingListService.setIngredients(this.ingredients);
    })
    this.shoppingListService.ingredientChanged.subscribe((ingredients: Array<Ingredient>) => {
      this.ingredients = ingredients;
      this.hasChanged = true;
    });
  }

}
