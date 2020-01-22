import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';




const BACKEND_URL = environment.apiUrl + '/user/'; // nie utk api dia sama ja so pakai nie mudah amik url kat environment

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenTimer: any; // nie utk terminate timer lame and untuk renew timer baru bila user bru msuk
  private token: string; // property baru untuk token untuk nntie di isi bawah
  private userId: string;  // nie untuk store user id dlam front end nk simpan byk data lain pon bole
  private usernameId: string;
  private isAuthenthicated = false;  // untuk auth function same tapi straight forward
  private authStatusListener = new Subject<boolean>();
  // mane mane component yg berminat dengan auth data function dia mcm session log in tapi pakai boolean je
 // (true/false sebab dah ade interceptor)


  // tslint:disable-next-line: max-line-length
  constructor(private http: HttpClient, private router: Router) {}  // ini untuk masukkan ke http client this.htpp mcm declaration untuk yg kt bwh tu

  getToken() {
    return this.token;  // nie token amik drpde yg kat login tu,sebab buat nie utk pakai kat service lain
  }

   getIsAuth() {
     return this.isAuthenthicated; // nie data amik drpde declare kat bawah
   }

   getUserId() {
     return this.userId;  // nie amik drpde decclare kat bawah
   }

   getUsernameId() {
     return this.usernameId;
   }

   getAuthStatusListener() {
    return this.authStatusListener.asObservable();  // pakai untuk auth jadikan observable tak pakai promise sebab dia nie boolean (yes/no)
  }

// inikan yang mule mule process macam sediakan sarung kosong untuk buat user baru running dah tkde run kat depan lagi dah
  createUser(email: string , password: string, username: string) {  // create method  kosong untuk  nantie nk accept email dgn password
    // tslint:disable-next-line: object-literal-shorthand
    const authData: AuthData  = {email: email, password: password, username: username};
     // data drpde front supaye user takde lame dgn data email dan password *disamakan dengan model.ts
    return this.http
    .post( BACKEND_URL + '/signup', authData)
    .subscribe(() => {
      this.router.navigate(['/']);
    }, () => {
      this.authStatusListener.next(false);
      // dia akan bg value fasle sebab next tu fungsi untuk send data, then bagi sape spe yg berminat cth mcm signup component
    });
}


login(email: string, password: string, username: string) {
  // tslint:disable-next-line: object-literal-shorthand
  const authData: AuthData  = {email: email, password: password, username: username};
  // tslint:disable-next-line: max-line-length
  this.http.post<{token: string, expiresIn: number, userId: string, usernameId: string }>( BACKEND_URL + '/login', authData)  // bila dia post nielah dia akan response
  // ade api token togk kat user.js dia send ke sini
  .subscribe(response => {  // pastu send ke kat api back end
    const token = response.token; // nie dpt drpde user.s tu subscribe response ade isi token
    this.token = token;   // nie simpan token drpde api ke dlam service
    if (token) {
      const expiresInDuration = response.expiresIn;  // inie untuk timeout token amik drpde auth
      this.setAuthTimer(expiresInDuration);  // nie amik drpde set auth timer pastu seting masuk ke expiresIn duration
      this.isAuthenthicated = true;  // nie amik kat ats tu dia true mksdnya dia ada leps login ade token
      this.userId = response.userId; // store data tentang user id dtg drpde user.js
      this.usernameId = response.usernameId; // store data tentang username dtg drpde user.js
      this.authStatusListener.next(true);
       // tgok nilai nie true amik drpde getAuthListener(next function dia store data dgn push component) skli dia bawak data lain token
       // dgn isauth
      const now = new Date();    // inie akan create new object untuk current time
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000); // new date dapat time tmbh exipred * 1000
      console.log(expirationDate);
      // tslint:disable-next-line: max-line-length
      this.saveAuthData(token, expirationDate, this.userId, this.usernameId ); // dpt lah expiration date token dgn user id store kan save auth data
      this.router.navigate(['/driver-list']);
      console.log(response);
      console.log(this.usernameId);
      console.log(this.userId);
    }
   }, () => {
      this.authStatusListener.next(false);
       // dia akan bg value fasle sebab next tu fungsi untuk send data, then bagi sape spe yg berminat cth mcm login component
  });
}

autoAuthUser() {         // inie akan auth user sama ada ade token ke tak dalam local storage mase sesi dia mcm penjaga
    const authInformation = this.getAuthData(); // nie amik data expiration date dgn token kat get auth data
    if (!authInformation) {
      return;
    }
    const now = new Date(); // new property untuk check mase sama ada di mase depan ke tak
    const expiresIn =  authInformation.expirationDate.getTime() - now.getTime();
    // expiration date data masuk dkat authinformation yg declare kat ats tu
    if (expiresIn > 0) { // kalau dia dpt lebih atau same mksdnya ade lgi mase klau dia tolak dpt negatuf mksdnya masa dah hbis
    this.token = authInformation.token;  // nie yg kat ats tuh  masuk ke this.token
    this.isAuthenthicated = true;  // nie property auth.service default dia false ,nie true sebab dah ckup syarat
    this.userId = authInformation.userId;
    this.usernameId = authInformation.usernameId;
    this.setAuthTimer(expiresIn / 1000);
    this.authStatusListener.next(true); // nie utk bgtau kat semua orang mcm tkde function wakaka
  }
  }

logout() {
  this.token = null;
  this.isAuthenthicated = false;
  this.authStatusListener.next(false);  // nie matikan data untuk kalau orng lcick logout
  this.userId = null; // nie untuk reset supaya tkde user id dlm template lps log out
  this.usernameId = null;
  clearTimeout(this.tokenTimer);
  this.clearAuthData();
  this.router.navigate(['/driver-list']);
}

private setAuthTimer(duration: number) {  // nie timer kalau dia habis masa dia akan auto log out
  console.log('Setting timer:' + duration);
  this.tokenTimer = setTimeout(() => {
    this.logout();
  }, duration * 1000); // 3600 millisecond* 1000

}


// tslint:disable-next-line: max-line-length
private saveAuthData(token: string, expirationDate: Date, userId: string, usernameId: string ) {  // ni method akan save data lepas user authenthicated
    localStorage.setItem('token', token); // nie simpan local storage untuk token data
    localStorage.setItem('expiration', expirationDate.toISOString()); // store sekali expiration date data
    localStorage.setItem('userId', userId); // nie token akan create dan store nak tgok nnatie same tak dgn id dlm post gmbr
    localStorage.setItem('usernameId', usernameId );
  }


private clearAuthData() {     // ini akan clearkan data bile user click logout
  localStorage.removeItem('token');
  localStorage.removeItem('expiration');
  localStorage.removeItem('userId');
  localStorage.removeItem('usernameId');
}



// tslint:disable-next-line: align
private getAuthData() {
  const token = localStorage.getItem('token');   // inie akan amik data token drpde local storage
  const expirationDate = localStorage.getItem('expiration');
  const userId = localStorage.getItem('userId');
  const usernameId = localStorage.getItem('usernameId');
  if (!token || !expirationDate) {
      return;
  }
  return {
    // tslint:disable-next-line: object-literal-shorthand
    token: token,  // nie untuk declare balik nnatie masukkan balik dlm property kat ats
    expirationDate: new Date(expirationDate),   // buat new date untuk convert  expirationDate ke serialze format
    // tslint:disable-next-line: object-literal-shorthand
    userId: userId,  // nie untuk declare balik nnatie masukkan balik dlm property kat ats
    // tslint:disable-next-line: object-literal-shorthand
    usernameId: usernameId
  };
}
}
