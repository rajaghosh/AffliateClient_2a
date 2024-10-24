import { Component, ViewChild } from '@angular/core';
import { ProductDetailsBasic, ProductDiscountPayload } from 'src/app/models/product.model';
import { ProductService } from 'src/app/service/http-services/product.service';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from 'src/app/service/http-services/user.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  currentUser: string = "";
  currentUserAfcode: string = "";
  productDetailsAdmin: ProductDetailsBasic[] = [];
  productDetailsAffliate: ProductDetailsBasic[] = [];
  marketPlaceImgEnv: string = environment.marketplaceEnv + environment.productImageFolder;
  marketPlaceLinkEnv: string = environment.marketplaceUiEnv + environment.productLink;

  displayedColumns1: string[] = ['id', 'medicineName', 'imagePath', 'discountPercent'];
  dataSource1 = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatSort) sort1!: MatSort;

  rowsAdded1: boolean = false;


  displayedColumns2: string[] = ['id', 'medicineName', 'imagePath', 'discountPercent'];
  dataSource2 = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort2!: MatSort;

  rowsAdded2: boolean = false;


  imageLoc: string = "../../../assets/images/"
  isAdmin: boolean = false;
  isAffliate: boolean = false;
  affiliateCommision: number = 0;

  percentUpdateForm: FormGroup = new FormGroup({});

  constructor(
    private productService: ProductService
    , private userService: UserService
    , private fBuilder: FormBuilder
    , private _snackBar: MatSnackBar
    , private dialog: MatDialog) {
    if (localStorage.getItem("loggedUser") !== null) {
      this.LoadUpdateControls();

      debugger;
      this.currentUser = localStorage.getItem("loggedUser") ?? "";
      this.currentUserAfcode = JSON.parse(localStorage.getItem("userCheckVal") ?? "");

      //debugger;


      this.GetAllProductsForAdmin(this.currentUser);
      this.GetAllProductsForAffliate(this.currentUser);
      this.GetAffiliateCommision();

    }
    else {
      //Proceed to logout
    }

  }

  GetAllProductsForAdmin(email: string) {

    const dialogRefLoginInProgress = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        message: "Loading...",
        spinnerOn: true,
        confirmButtonText: '',
        buttonText: {
          ok: '',
          cancel: ''
        }
      }
    });

    this.productService.getProductDetailsForAdminAsync(email).subscribe(s => {

      // debugger;

      dialogRefLoginInProgress.close();

      let result = s;
      let res: ProductDetailsBasic[] = result.data;
      let error = result.error;

      if (error == null || error == undefined) {
        this.productDetailsAdmin = res;

        // debugger;

        this.dataSource1 = new MatTableDataSource<any>(this.productDetailsAdmin);
        setTimeout(() => this.dataSource1.paginator = this.paginator1);
        setTimeout(() => this.dataSource1.sort = this.sort1);

        // debugger;
        if ((this.dataSource1 != null && this.dataSource1 != undefined)
          && (this.dataSource1.data != null && this.dataSource1.data != undefined)) {
          this.rowsAdded1 = this.dataSource1.data.length > 0;
        }


        if (localStorage.getItem("productsAdmin") !== null) {
          localStorage.removeItem("productsAdmin");
        }
        localStorage.setItem("productsAdmin", JSON.stringify(this.productDetailsAdmin));

        if (this.productDetailsAdmin != null && this.productDetailsAdmin != undefined)
          this.isAdmin = true;

      }

    });
  }

  GetAllProductsForAffliate(email: string) {

    const dialogRefLoginInProgress = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        message: "Loading...",
        spinnerOn: true,
        confirmButtonText: '',
        buttonText: {
          ok: '',
          cancel: ''
        }
      }
    });

    this.productService.getProductDetailsForAffliateAsync(email).subscribe(s => {

      //  debugger;
      dialogRefLoginInProgress.close();

      let result = s;
      let res: ProductDetailsBasic[] = result.data;
      let error = result.error;

      if (error == null || error == undefined) {
        this.productDetailsAffliate = res;

        this.dataSource2 = new MatTableDataSource<any>(this.productDetailsAffliate);
        setTimeout(() => this.dataSource2.paginator = this.paginator2);
        setTimeout(() => this.dataSource2.sort = this.sort2);

        // debugger;
        if ((this.dataSource2 != null && this.dataSource2 != undefined)
          && (this.dataSource2.data != null && this.dataSource2.data != undefined)) {
          this.rowsAdded2 = this.dataSource2.data.length > 0;
        }

        if (localStorage.getItem("productsAffliate") !== null) {
          localStorage.removeItem("productsAffliate");
        }
        localStorage.setItem("productsAffliate", JSON.stringify(this.productDetailsAffliate));

        if (this.productDetailsAffliate != null && this.productDetailsAffliate != undefined)
          this.isAffliate = true;

      }

    });
  }

  GetAffiliateCommision() {
    this.userService.getAffiliateCommision().subscribe(s => {
      let result = s;
      this.affiliateCommision = result.data;
    });
  }

  LoadUpdateControls() {
    this.percentUpdateForm = this.fBuilder.group({
      ProdId: new FormControl('', [
        Validators.required,
      ]),
      DiscountPercent: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.percentUpdateForm.controls[controlName].hasError(errorName);
  };


  onDiscountSubmit(prodId: number) {
    // debugger;

    let discountDetails = {} as ProductDiscountPayload;
    discountDetails.ProductId = prodId; //this.percentUpdateForm.value["ProdId"];
    discountDetails.DiscountPercent = parseFloat(this.percentUpdateForm.value["DiscountPercent"]);

    // discountDetails.DiscountPercent = this.percentUpdateForm.control;

    const dialogRefLoginInProgress = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        message: "Update in progress...",
        spinnerOn: true,
        confirmButtonText: '',
        buttonText: {
          ok: '',
          cancel: ''
        }
      }
    });

    this.productService.PostDiscountPercentAsync(discountDetails).subscribe(s => {

      dialogRefLoginInProgress.close();
      // debugger;
      try {
        let result = s;
        let res: any = result.data;
        let error = result.error;

        this.percentUpdateForm.reset();
        this.GetAllProductsForAdmin(this.currentUser);


      } catch (ex) { }

    });

  }

  EncodeAffliateLink(productId: number) {
    //   var totalLink = this.currentUser + "_" + productId;
    //   return btoa(totalLink);
    //debugger;
    //var totalLink = this.currentUserAfcode;
    //return btoa(totalLink);

    //For now we are not encoding the data (Code present above for reuse)
    return this.currentUserAfcode;

  }

  DecodeAffliateLink(affliateEncodedLink: string) {
    return atob(affliateEncodedLink);
  }

  CopyToClipboard(productId: number) {
    var totalLink = this.marketPlaceLinkEnv + productId + "&aCode=" + this.EncodeAffliateLink(productId);
    // debugger;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = totalLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.openSnackBar("The link has been copied.", "Dismiss");
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
