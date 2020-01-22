import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {  DriverCreateComponent } from './driver-create/driver-create.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { OrdersAComponent } from './order-a/order-a.component';
import { OrderBComponent } from './order-b/order-b.component';

@NgModule({
  declarations: [DriverCreateComponent, DriverListComponent, OrdersAComponent, OrderBComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule // amik nie module sebab router module tu eksport kat app module saja
  ]
})
export class DriversModule {} // nie function untuk export post module,post list and post create
