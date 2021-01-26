import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  constructor(private shoppingListService: ShoppingListService) { }

  // @ViewChild('nameInput') nameInputRef: ElementRef;
  // @ViewChild('amountInput') amountInputRef: ElementRef;
  @ViewChild('frm') shoppingListForm: NgForm
  subscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  hasChanged: boolean = false;
  @Output() dataChangedEvent = new EventEmitter<boolean>();


  // @Output() changesSaved: boolean = false;

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editedItemIndex = index;
      this.editedItem = this.shoppingListService.getIngredient(index);
      this.shoppingListForm.setValue({ 'name': this.editedItem.name, 'amount': this.editedItem.amount });
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value as Ingredient;
    // const ingName = (this.nameInputRef.nativeElement as HTMLInputElement).value;
    // const ingAmount = parseInt((this.amountInputRef.nativeElement as HTMLInputElement).value);

    // const ingredient: Ingredient = new Ingredient(value.name, value.amount, this.editedItem ? this.editedItem._id : null);
    const ingredient: Ingredient = {
      amount: value.amount,
      name: value.name,
      _id: this.editedItem ? this.editedItem._id : null,
      creator: this.editedItem ? this.editedItem.creator : null
    };
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
    } else {
      this.shoppingListService.addIngredient(ingredient);
    }
    this.hasChanged = true;
    this.editMode = false;
    this.editedItem = null;
    this.dataChangedEvent.emit(true);
    form.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editedItem = null;
    this.editMode = false;
  }

  onDelete() {
    this.onClear();
    this.hasChanged = true;
    this.dataChangedEvent.emit(true);
    this.shoppingListService.delete(this.editedItemIndex);
  }

}
