import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Alert, AlertType } from '../../alert/alert.model';
import { loginModel } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private router: Router, private titleService: Title) {
    // this.titleService.setTitle("Recipe | Login");
  }
  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }
  @ViewChild("emailInput") email: NgModel;
  @ViewChild("passwordInput") password: NgModel;

  alert: Alert;

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    const loginData: loginModel = { email: form.value.email, password: form.value.password };
    this.authService.login(loginData).subscribe(response => {
      if (response.success && response.token) {
        const token = response.token;
        const expirationInDuration = response.expiresIn;
        this.authService.setAuthTimer(expirationInDuration);
        this.authService.setToken(token);
        this.authService.authStatusListener.next(response.success);
        this.authService.isAuthenticated = response.success;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expirationInDuration * 1000);
        this.authService.saveAuthData(token, expirationDate);
        this.router.navigate(['/']);
      }
      else {
        for (const err of response.messages) {
          // let alert: Array<string> = []
          this.alert = new Alert(AlertType.Warning);
          this.alert.messages.push({ msg: err.msg, prop: err.param });
        }
      }
    }, (err: HttpErrorResponse) => {
      this.alert = new Alert(AlertType.Danger);
      this.alert.messages.push({ msg: err.error.message });
    });
    form.reset()
  }

  onCloseAlertMessage() {
    this.alert = null;
  }

}
