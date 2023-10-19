import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {IUser} from "../../shared/interfaces";
import {AuthServices} from "../shared/services/auth.services";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(public auth: AuthServices, private router: Router) {
  }

  form!: FormGroup
  isSubmitted = false
  error: string | null = null;

  ngOnInit() {
    this.form = new FormGroup<any>({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }

  clearError() {
    this.error = null
  }

  submit() {
    if (this.form.invalid) return
    this.error = null;
    this.isSubmitted = true
    const user:IUser = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.auth.login(user).subscribe(() => {
      this.form.reset()
      this.router.navigate(['admin', 'dashboard'])
      this.isSubmitted = false
    }, (error => {
      this.isSubmitted = false
    }))

    this.auth.error$.subscribe(error => this.error = error)
  }
}
