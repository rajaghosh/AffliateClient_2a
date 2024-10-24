import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { PaymentModel } from '../../../app/models/checkout.model';
// import { PaymentResponseModel, ProductModel } from '../../../app/models/product.model';
import { ServiceUrl } from '../../service-url';
import { UserRegistrationModel } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userServiceApi?: string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private serviceUrl: ServiceUrl,
    private http: HttpClient
  ) {
    this.userServiceApi = this.serviceUrl.userService;
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = `Error code ${error.status}\nMessage: ${error.message}`;
    return throwError(errorMessage);
  }


  PostRegistrationDetailsAsync(userRegModel: UserRegistrationModel): Observable<any> {

    // const postData = { userRegModel: userRegModel};

    const postData = userRegModel;

    // console.log(p)

    var url = `${this.userServiceApi}AddNewUser`;

    return this.http.post(url, postData, { headers: this.headers }).pipe(
      catchError(this.errorHandler));
  }


  PostLoginDetailsAsync(userRegModel: UserRegistrationModel): Observable<any> {

    const postData = userRegModel;
    var url = `${this.userServiceApi}LoginUser`;

    return this.http.post(url, postData, { headers: this.headers }).pipe(
      catchError(this.errorHandler));
  }

  getAfficiateUserDetails() {
    var url = `${this.userServiceApi}GetAfficiateUserDetails`

    return this.http.get<any>(url, { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }

  activeOrInActiveUser(status: boolean, id: number, email: string) {
    var url = `${this.userServiceApi}ActiveOrInActiveUser?id=` + id + `&status=` + status + `&email=` + email

    return this.http.get<any>(url, { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }

  getAffiliateCommision() {
    var url = `${this.userServiceApi}GetAffiliateCommision`

    return this.http.get<any>(url, { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }


  getSaleReportDetails(searchModel: any): Observable<any> {

    const postData = searchModel;
    var url = `${this.userServiceApi}GetSaleReportDetails`;

    return this.http.post(url, postData, { headers: this.headers }).pipe(
      catchError(this.errorHandler));
  }

  getTotalSalesCountReportDetails(searchModel: any): Observable<any> {

    const postData = searchModel;
    var url = `${this.userServiceApi}GetTotalSalesCountReportDetails`;

    return this.http.post(url, postData, { headers: this.headers }).pipe(
      catchError(this.errorHandler));
  }


}
