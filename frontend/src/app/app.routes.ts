import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { FoodPageComponent } from './components/pages/food-page/food-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { authGuard } from './auth/guards/auth.guard';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';
import { OrderTrackPageComponent } from './components/pages/order-track-page/order-track-page.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { OrdersComponent } from './components/pages/orders/orders.component';
import { adminGuard } from './auth/guards/admin.guard';
import { FoodsAdminComponent } from './components/pages/foods-admin/foods-admin.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { FoodEditPageComponent } from './components/pages/food-edit-page/food-edit-page.component';
import { UsersPageComponent } from './components/pages/users-page/users-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search/:searchTerm', component: HomeComponent },
  { path: 'food/:id', component: FoodPageComponent },
  { path: 'tag/:tag', component: HomeComponent },
  { path: 'cart-page', component: CartPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  {
    path: 'checkout',
    component: CheckoutPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'payment',
    component: PaymentPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'track/:orderId',
    component: OrderTrackPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'orders/:filter',
    component: OrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/foods/:searchTerm',
    component: FoodsAdminComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/foods',
    component: FoodsAdminComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/addFood',
    component: FoodEditPageComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/editFood/:foodId',
    component: FoodEditPageComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/users/:searchTerm',
    component: UsersPageComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'admin/users',
    component: UsersPageComponent,
    canActivate: [authGuard, adminGuard],
  },
  { path: 'not-found', component: NotFoundComponent },
];
