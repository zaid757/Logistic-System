// function nie macam auth interceptor tuh mane adebg error dia cangkuk kat sini
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

constructor(private dialog: MatDialog) {}  // nie nk buat dialog kluar bg lawa

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // tslint:disable-next-line: max-line-length
    return next.handle(req).pipe( // handle send data pakai pipe function pipe mcm buat stream direct ke point tertentu tnpe perlu ade listen event
      catchError((error: HttpErrorResponse) => { // tgkap siape siape ade error kat htpp
        let errorMessage = 'An uknown error occured!';
        if (error.error.message) { // kalau error ade error message akan ke sini
          errorMessage = error.error.message; // error.error.erro message tuh jdi nilai an uknown error occured
      }
        this.dialog.open(ErrorComponent, {data: {message: errorMessage}}); // nie nk bagi kemas ja sbrnya boleh je data: error message
         // nie nk bagi bukak dialog open ade message skli dpt isi error message tu dkt ats
        return throwError(error);  // return function dia matikan operation function dan dia return balik nilai error cmpk ke http response
      })
    );
  }
}
