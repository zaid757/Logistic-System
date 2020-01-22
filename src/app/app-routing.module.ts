import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { DriverCreateComponent } from './drivers/driver-create/driver-create.component';
import { DriverListComponent } from './drivers/driver-list/driver-list.component';
import { OrdersAComponent } from './drivers/order-a/order-a.component';
import { OrderBComponent } from './drivers/order-b/order-b.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'createPost', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  // kalau itu ade post id maksdnya dia tgh edit mode nie bagi kat post.service yg first kat ng oninit tu
   { path: 'createDriver', component: DriverCreateComponent, canActivate: [AuthGuard]},
  { path: 'editDriver/:driverId', component: DriverCreateComponent, canActivate: [AuthGuard]},
  { path: 'driver-list', component: DriverListComponent },
  // nie atas untuk driver
  { path: 'order-b/:orderId', component: OrderBComponent },
  { path: 'orderA/:orderId', component: OrdersAComponent},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}, // tu load children tu amek kat auth-routing module punya path

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]   // nie utk jage router
})
export class AppRoutingModule {}
