import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ModalService } from "./modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  animations: [
    trigger('modalEffect', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-100px)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({
          opacity: 0,
          transform: 'translateY(100px)'
        }))
      ])
    ])
  ]
})
export class AppModalComponent implements OnInit, OnDestroy {
  showModal: boolean = false;
  subscripton: Subscription
  constructor(private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.subscripton = this.modalService.modalStateChanged.subscribe(state => {
      this.showModal = state
    });
  }

  ngOnDestroy(): void {
    this.subscripton.unsubscribe();
  }

  onClose() {
    this.showModal = false;
  }
}