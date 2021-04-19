import { Component, Input, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  constructor(private spinnerService: SpinnerService) { }

  @Input() loading: boolean = false;
  @Input() httpLoading: boolean = false;

  ngOnInit(): void {
    this.spinnerService.spinnerStatusAsObservable.subscribe(status => {
      this.loading = status;
      this.httpLoading = status;
    })
  }

}
