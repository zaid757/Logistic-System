import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  // nie property nntie untuk store data drpde getAuthStatus listener function dia untuk check betul ke tak lepas sign up

  constructor(public authService: AuthService ) {}

ngOnInit() {
  this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    authStatus => {   // klau dkat auth.service create user tu error dia akn lri ke sini loading tu jadi false bende yg pusing tu stop
      this.isLoading = false;
    }
  ); // authstatus listener store dlm auth status sub
}



  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password, form.value.username);
    // first dia akan create macam shell kosong kat service dulu then masukkan nilai pakai form.value tu dpt drpde front end
  }


  ngOnDestroy() {
  this.authStatusSub.unsubscribe();
  }
}


