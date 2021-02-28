import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Alert, AlertType } from '../../alert/alert.model';
import { AuthModel } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private titleService: Title) {
    this.titleService.setTitle("Recipe | Signup");
  }

  ngOnInit(): void {
  }

  alert: Alert;

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    const authData: AuthModel = { email: form.value.email, password: form.value.password, confirmPassword: form.value.confirmPassword }
    this.authService.createUser(authData).subscribe(response => {
      if (response.success) {
        this.alert = new Alert(AlertType.Success, [{ msg: response.message as string }]);
        this.alert.messages.push({ prop: "", msg: "You will be redirecting to login page after 3 seconds!" })
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      } else {
        this.alert = new Alert(AlertType.Warning);
        if (response.message instanceof Array) {
          response.message.forEach(msg => {
            this.alert.messages.push({ msg: msg });
          });
        }
        if (response.message instanceof String) {
          this.alert.messages.push({ msg: response.message as string });
        }
      }
    }, (err: HttpErrorResponse) => {
      this.alert = new Alert(AlertType.Danger);
      this.alert.messages.push({ msg: err.error.message });
    });

    form.reset();
  }

  onCloseAlertMessage() {
    this.alert = null;
  }

}
