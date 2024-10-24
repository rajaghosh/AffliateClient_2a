import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../app/components/home/home.component';
import { RegisterComponent } from '../app/components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { AuthGuard } from './service/auth-guard/auth.guard';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [
  // { path: 'index', component: HomeComponent },
  // { path: '', component: HomeComponent }, //This will make the home component as default first loading component via <router-outlet>
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: RegisterComponent },
  { path: '', component: RegisterComponent }, //This will make the register component as default first loading component via <router-outlet>
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'manage-user', component: ManageUserComponent, canActivate: [AuthGuard] },
  { path: 'manage-product', component: ProductsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
