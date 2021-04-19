import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerStatus = new BehaviorSubject<boolean>(false);
  spinnerStatusAsObservable = this.spinnerStatus.asObservable();

  constructor() { }

  showSpinner(){
    this.spinnerStatus.next(true);
  }

  hideSpinner(){
    this.spinnerStatus.next(false);
  }
  
}
