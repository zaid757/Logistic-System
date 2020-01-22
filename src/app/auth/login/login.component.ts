import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

constructor(public authService: AuthService) {}

ngOnInit() {
  this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    authStatus => {   // klau dkat auth.service create user tu error dia akn lri ke sini loading tu jadi false bende yg pusing tu stop
      this.isLoading = false;
    }
  ); // authstatus listener store dlm auth status sub
}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password, form.value.username);  //  data nie ke depan
  }

ngOnDestroy() {
  this.authStatusSub.unsubscribe(); // nie last skli sbb dia last exesecute sini syncchronous

}
}
