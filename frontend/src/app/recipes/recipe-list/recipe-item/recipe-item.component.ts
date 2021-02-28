import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from '../../recipe.model';
import { RecipeService } from '../../recipe.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
  animations: [
    trigger('listEffect', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 1, transform: 'translateX(-100px)' }),
        animate(500)
      ]),
      transition('* => void', [
        animate(500, style({
          transform: 'translateX(100px)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class RecipeItemComponent implements OnInit {
  constructor(private recipeService: RecipeService) { }
  state :string = 'in';

  @Input() recipe: Recipe;
  @Input() id: number;
  //  @Output() onClickRecipeDetail = new EventEmitter<void>();

  ngOnInit() { }

  // onSelected() {
  //   this.recipeService.recipeSelected.emit(this.recipe);
  // }

  // onRecipeDetail(){
  //   this.onClickRecipeDetail.emit();
  // }
}
