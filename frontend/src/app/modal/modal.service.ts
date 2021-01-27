import { Subject } from "rxjs";

export class ModalService {
    constructor() { }
    modalStateChanged: Subject<boolean> = new Subject<boolean>();
    navigateAwaySelection: Subject<boolean> = new Subject<boolean>();

    showModal() {
        this.modalStateChanged.next(true);
    }
    
    hideModal() {
        this.modalStateChanged.next(false);
    }
}