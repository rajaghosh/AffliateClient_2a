// import { CanActivate, CanActivateFn, Route, Router } from '@angular/router';
// import { AuthService } from '../auth-services/auth.service';

// // export const authGuard: CanActivateFn = (route, state) => {
// //   return true;
// // };

// export class AuthGuard implements CanActivate {
//   constructor(private service: AuthService, private route: Router) { }

//   canActivate() {
//     if (this.service.IsLoggedIn()) {
//       return true;
//     }
//     else {
//       this.route.navigate(['register']);
//       return false;
//     }
//   }
// }


import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth-services/auth.service';

@Injectable({
 providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private service: AuthService, private route: Router) { }
  
  canActivate() {
    if (this.service.IsLoggedIn()) {
      return true;
    }
    else {
      this.route.navigate(['register']);
      return false;
    }
  }
 
}