import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthServices} from "../../services/auth.services";

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {

  constructor(private router: Router, public auth: AuthServices) {
  }

  logout(e: Event) {
    e.preventDefault()
    this.auth.logout()
    this.router.navigate(['admin', 'login'])
  }
}
