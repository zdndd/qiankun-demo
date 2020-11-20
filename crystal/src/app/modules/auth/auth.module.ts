import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './auth/login.component';
import { GetPwdComponent } from './auth/getpwd.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

import { SSOLoginComponent } from './auth/ssologin.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sso/:ssotoken', component: SSOLoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginComponent, GetPwdComponent, SSOLoginComponent]
})
export class AuthModule { }
