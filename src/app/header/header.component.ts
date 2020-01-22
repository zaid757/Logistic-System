import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  implements OnInit, OnDestroy {
  userIsAuthenticated = false;      // default false mksdnya takde dpt true
  private authListenerSubs: Subscription;  // create nie untuk subscribe data drpde auth service tu
  username: string; // function nie untuk pggil nama
  constructor(private authService: AuthService) { }
  selected = 'option1';

ngOnInit() {
  this.username = this.authService.getUsernameId(); // nie kene atas sebab process habis lepas dpt get is auth
  this.userIsAuthenticated = this.authService.getIsAuth(); // masukkan value supaya cepat proses
  this.authListenerSubs = this.authService
  .getAuthStatusListener().subscribe(isAuthenticated => {
       // kalau dapat nilai drpde login dia adalah true sebab ade store data true dpt kat auth.service get auth;istener tu
      this.userIsAuthenticated = isAuthenticated;  // disamakan dengan nilai baru yg false tdi ubah jadi true

    });
}


onLogout() {
  this.authService.logout();
}


ngOnDestroy() {
this.authListenerSubs.unsubscribe();
}
}


