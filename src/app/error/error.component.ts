import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) {} // nie nk bagi kemas ja sbrnya boleh je data: error message
  // nie nak bagi simpan kejap data message tu dan bgi pass kat siap siapa
}
