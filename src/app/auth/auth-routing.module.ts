import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule ({
  imports: [
  RouterModule.forChild(routes)  // nie untuk passing routes sbb nie kan kat dlm nntie dia merge dgn root
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {} // nie untuk routing ke login and sign up buat nie sebb nk ringan skit
