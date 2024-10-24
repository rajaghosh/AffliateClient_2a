import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private inject: Injector) { }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  //   debugger;
  //   let authService = this.inject.get(AuthService);

  //   let jwtToken = req.clone({
  //     setHeaders: {
  //       Authorization: "Bearer " + authService.GetToken(),
  //       UserKey: authService.GetUserKey()
  //     }
  //   });

  //   return next.handle(jwtToken);
  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //debugger;
    let authService = this.inject.get(AuthService);

    let authReq = request;
    authReq = this.AddTokenHeader(request, authService.GetToken(), authService.GetUserKey());

    return next.handle(authReq).pipe(
      catchError(errordata => {
        console.log(errordata);
        //debugger;
        if (errordata.status == 401) {
          // implement logout
          authService.LogOut();
        }
        return throwError(errordata);
      })
    );
  }

  AddTokenHeader(request: HttpRequest<any>, token: string, userKey: string) {
    return request.clone(
      {
        headers: request.headers
          .set('Authorization', 'Bearer ' + token)
          .set('UserKey', userKey)
      });
  }



}
