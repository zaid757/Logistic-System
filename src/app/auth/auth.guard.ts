import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

@Injectable()  // pakai injectable kalau nk pakai service dlam service

// service nie akan dilaunch oleh angular supaya decide mane route yang bole diacess atau tak
export class AuthGuard implements CanActivate {

constructor(private authService: AuthService, private router: Router) {}

 canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();  // nie amik drpde auth.service
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}

