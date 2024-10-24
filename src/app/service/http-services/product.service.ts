import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { PaymentModel } from '../../../app/models/checkout.model';
// import { PaymentResponseModel, ProductModel } from '../../../app/models/product.model';
import { ServiceUrl } from '../../service-url';
import { UserRegistrationModel } from '../../models/user.model';
import { ProductDiscountPayload } from 'src/app/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productServiceApi?: string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private serviceUrl: ServiceUrl,
    private http: HttpClient
  ) {
    this.productServiceApi = this.serviceUrl.productService;
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = `Error code ${error.status}\nMessage: ${error.message}`;
    return throwError(errorMessage);
  }


  PostDiscountPercentAsync(discountPayload: ProductDiscountPayload): Observable<any> {

    // const postData = { userRegModel: userRegModel};

    const postData = discountPayload;

    var url = `${this.productServiceApi}AddDiscountPercent`;

    return this.http.post(url, postData, { headers: this.headers }).pipe(
      catchError(this.errorHandler));
  }

  getProductDetailsForAdminAsync(email: string) {

    var url = `${this.productServiceApi}GetProductDetailsForAdmin?userEmail=` + email

    //debugger;

    return this.http.get<any>(url, { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }

  getProductDetailsForAffliateAsync(email: string) {

    var url = `${this.productServiceApi}GetProductDetailsForAffliate?userEmail=` + email

    //debugger;

    return this.http.get<any>(url, { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }


  getSaleForUserAsync(email?: string) {

    var url: string = "";

    if ((email != null || email != undefined) && email.length > 0)
      url = `${this.productServiceApi}GetSaleForUser?email=` + email;
    else
      url = `${this.productServiceApi}GetSaleForUser`;

    return this.http.get<any>(url, { headers: this.headers })
      .pipe(catchError(this.errorHandler));
  }


}
