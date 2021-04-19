import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private titleService: Title) {
    // titleService.setTitle("A test title");
  }

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  getDepth(outlet: RouterOutlet) {
    return outlet && outlet.isActivated && outlet.activatedRouteData
  }

  // navigationSelected: string = "recipe"
  // onNavigate(feature: string) {
  //   this.navigationSelected = feature;
  // }
}
