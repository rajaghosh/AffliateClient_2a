import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
// import { MatInput, MatFormField, MatButton } from '@angular/material/form-field';
import { UserRegistrationModel } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../service/http-services/user.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-services/auth.service';
import { UserInternalService } from 'src/app/service/common-services/user-internal.service';
// import { TokenService } from '../../service/auth-services/token.service';//'../_services/token-storage.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  registrationForm: FormGroup = new FormGroup({});
  loginForm: FormGroup = new FormGroup({});
  hide: boolean = true;
  hideLogin: boolean = true;
  userNotLoggedIn: boolean = false;
  showLogin: boolean = true;
  currentUrl: string = "";
  imageLoc: string = "../../../assets/images/";


  
  // registationStatus: boolean = false;

  constructor(private fBuilder: FormBuilder
    , private dialog: MatDialog
    , private userService: UserService
    , private router: Router
    , private authService: AuthService
    , private userInternal: UserInternalService
    // , private tokenStorage: TokenService
  ) {
    //If logged in then on load it will redirect to manage product page
    if (localStorage.getItem("loggedUser") !== null) {
      this.router.navigate(["/dashboard"]);
      this.userNotLoggedIn = false;
    }
    else {
      this.userNotLoggedIn = true;
      this.LoadRegistrationControls();
      this.LoadLoginControls();
    }
  }

  ngOnInit() {

    this.currentUrl = window.location.href;
    if (this.currentUrl.toLowerCase().includes('login'))
      this.showLogin = true;
    else if (this.currentUrl.toLowerCase().includes('register'))
      this.showLogin = false;
    else
      this.showLogin = true;

  }

  LoadRegistrationControls() {
    this.registrationForm = this.fBuilder.group({
      Name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      Email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15)

      ]),
    });
  }


  LoadLoginControls() {
    this.loginForm = this.fBuilder.group({
      Email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      Password: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
    });
  }

  // TestSubmit(){

  //   debugger;
  // }

  onRegistrationSubmit() {

    debugger;

    let registrationDetails = {} as UserRegistrationModel;
    registrationDetails.Email = this.registrationForm.value["Email"];
    registrationDetails.Name = this.registrationForm.value["Name"];
    registrationDetails.Password = this.registrationForm.value["Password"];

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(registrationDetails.Email)) {

      const dialogRefEmailCheck = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          message: "Please enter details properly. Email format is not proper!",
          buttonText: {
            ok: 'Close'
          }
        }
      });

      dialogRefEmailCheck.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const a = document.createElement('a');
          a.click();
          a.remove();

          // this.ProceedToHomePage();
        }
      });
      return;


    }

    // console.log(this.registrationForm.value);
    else if (registrationDetails.Email.trim().length == 0 || registrationDetails.Name.trim().length == 0 || registrationDetails.Password.trim().length == 0) {
      const dialogRefBlankCheck = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          message: "Please enter details properly. Registration details cannot be blank!",
          buttonText: {
            ok: 'Close'
          }
        }
      });

      dialogRefBlankCheck.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const a = document.createElement('a');
          a.click();
          a.remove();

          // this.ProceedToHomePage();
        }
      });
      return;
    }

    try {
      const dialogRefRegistrationInProgress = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          message: "Registration in progress...",
          spinnerOn: true,
          confirmButtonText: '',
          buttonText: {
            ok: '',
            cancel: ''
          }
        }
      });

      // debugger;

      this.userService.PostRegistrationDetailsAsync(registrationDetails).subscribe(s => {

        let result = s;
        let res: number = result.data;
        let error = result.error;

        // debugger;


        dialogRefRegistrationInProgress.close();  //Closing the loader component

        //****************************************************************************/
        //If registration successful
        //****************************************************************************/
        if (res == 0 && (error == null || error == undefined)) {

          const dialogRefRegistrationSuccess = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true,
            data: {
              message: "You have been successfully registered. Admin will shortly approve your request. You will receive an email with the confirmation. Have a good day!",
              buttonText: {
                ok: 'Close'
              }
            }
          });

          dialogRefRegistrationSuccess.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
              const a = document.createElement('a');
              a.click();
              a.remove();

              // this.ProceedToHomePage();
            }
          });
        }
        //****************************************************************************/
        //If registration issue
        //****************************************************************************/
        else {

          const dialogRefRegistrationIssue = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true,
            data: {
              message: "Issue in registration. " + error.errorMessage,
              buttonText: {
                ok: 'Modify details',
                cancel: '',
                Other: ''
              }
            }
          });

          dialogRefRegistrationIssue.afterClosed().subscribe((confirmed: any) => {

            if (confirmed) {
              const a = document.createElement('a');
              a.click();
              a.remove();
            }
          });
        }

      });



    } catch (ex) {

    }







  }


  onLoginSubmit() {

    //debugger;

    let loginDetails = {} as UserRegistrationModel;
    loginDetails.Email = this.loginForm.value["Email"];
    loginDetails.Name = ''; //this.loginForm.value["Name"];
    loginDetails.Password = this.loginForm.value["Password"];

    // console.log(this.loginForm.value);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(loginDetails.Email)) {

      const dialogRefEmailCheck = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          message: "Please enter details properly. Email format is not proper!",
          buttonText: {
            ok: 'Close'
          }
        }
      });

      dialogRefEmailCheck.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const a = document.createElement('a');
          a.click();
          a.remove();

          // this.ProceedToHomePage();
        }
      });
      return;


    }
    else if (loginDetails.Email.trim().length == 0 || loginDetails.Password.trim().length == 0) {
      const dialogRefBlankCheck = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          message: "Please enter details properly. Login details cannot be blank!",
          buttonText: {
            ok: 'Close'
          }
        }
      });

      dialogRefBlankCheck.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          const a = document.createElement('a');
          a.click();
          a.remove();

          // this.ProceedToHomePage();
        }
      });
      return;
    }


    try {
      const dialogRefLoginInProgress = this.dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        data: {
          message: "Login in progress...",
          spinnerOn: true,
          confirmButtonText: '',
          buttonText: {
            ok: '',
            cancel: ''
          }
        }
      });

      // this.registationStatus = false;

      this.userService.PostLoginDetailsAsync(loginDetails).subscribe(s => {

        let result = s;

        dialogRefLoginInProgress.close();  //Closing the loader component

        //****************************************************************************/
        //If login successful
        //****************************************************************************/
        if (result != null && result.data != null && (result.error == null || result.error == undefined)) {

          let res: string = result.data.token ?? '';
          let userKey: string = result.data.userKey ?? '';
          let userType: number = result.data.type ?? '';
          let userName: string = result.data.userName ?? '';
          let userCheckVal: string = result.data.userCheckVal ?? '';
          // let error = result.error;

          this.authService.SaveToken(res, userKey);
          localStorage.setItem("type", JSON.stringify(userType));
          localStorage.setItem("userName", JSON.stringify(userName));
          localStorage.setItem("userCheckVal", JSON.stringify(userCheckVal));

          //Go To Dashboard
          this.ResetSetLoggedInUser(loginDetails.Email);
          this.ProceedToLoginDashboard();

        }
        //****************************************************************************/
        //If login issue
        //****************************************************************************/
        else {

          const dialogRefLoginIssue = this.dialog.open(ConfirmDialogComponent, {
            disableClose: true,
            data: {
              message: "Issue in login. " + result.error.errorMessage,
              buttonText: {
                ok: 'Modify details',
                cancel: '',
                Other: ''
              }
            }
          });

          dialogRefLoginIssue.afterClosed().subscribe((confirmed: any) => {

            if (confirmed) {
              const a = document.createElement('a');
              a.click();
              a.remove();
            }
          });
        }

      });



    } catch (ex) {

    }
  }

  ResetRegistrationForm() {
    this.registrationForm.reset();
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.registrationForm.controls[controlName].hasError(errorName);
  };

  public checkErrorLogin = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  };

  // ProceedToHomePage() {
  //   window.location.href = this.router['location']._platformLocation.location.origin;
  // }

  ProceedToLoginDashboard() {
    // window.location.href = '/dashboard';
    this.router.navigate(["/dashboard"]);
  }

  ResetSetLoggedInUser(email: string) {
    localStorage.removeItem("loggedUser");
    localStorage.setItem("loggedUser", email);
  }

  toggleForms() {
    // this.showLogin = !this.showLogin;
    if (this.currentUrl.toLowerCase().includes('login'))
      window.location.href = '/register';
    else
      window.location.href = '/login';
  }

}
