// gune interceptor nie function stiap kli ade nk request http dia intercept nk check ade token ke tak
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
constructor(private authService: AuthService) {}

   // nie contract authinteceptor sebab pkai httpinterceptor, dia function mcm middleware service lain boleh pakai
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken(); // sini amik token drpde auth service gune getToken
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken) // ini akan buat request untuk header authorization dgn authtoken
    // seblah bearer tu ade ruang kosong
    });
    return next.handle(authRequest); // mintak request drpde data atas pastu bagi dia sambung
  }

}


