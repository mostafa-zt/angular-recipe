import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Alert, AlertType } from "./alert.model";

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css'],
    animations: [
        trigger('effect', [
            state('in', style({ opacity: 1, transform: 'translateY(0)' })),
            // state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
            transition('void => *', [
                style({ opacity: 0, transform: 'translateY(-20px)' }),
                animate(350)
            ]),
            transition('* => void', [
                animate(20, style({
                    opacity: 0,
                    transform: 'translateY(-20px)'
                }))
            ])
        ])
    ]
})

export class AlertComponent implements OnInit {
    ngOnInit(): void {
    }

    @Input() alert: Alert;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }

    alertType() {
        return "alert-" + this.alert.type.toLowerCase();
    }
}