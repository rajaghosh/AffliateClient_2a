import { environment } from '../environments/environment'
import { Injectable } from "@angular/core";


// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class ServiceUrl {
  userService?: string;
  productService?: string;
  // subscriptionService?: string;
  // paymentService?: string;

  constructor() {
    this.userService = environment.apiUrlMain + "User/";
    this.productService = environment.apiUrlMain + "Product/";
    // this.subscriptionService = environment.apiUrlMain + "Subscription/";
    // this.paymentService = environment.apiUrlMain + "Payment/";
  }

}