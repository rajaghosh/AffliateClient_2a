import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-services/auth.service';
import { UserInternalService } from 'src/app/service/common-services/user-internal.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() isLoggedIn: boolean = false;
  @Input() isAdmin: boolean = false;
  @Input() loggedInUser: string = "";
  @Input() userName: string = "";


  imageLoc: string = "../../../assets/images/";

  constructor(
    private router: Router
    , private authService: AuthService
    , private userInternal: UserInternalService) {


    //This will be loaded using appcomponent.ts parent-child communication
    // this.isAdmin = this.userInternal.CheckIfUserAdmin();
    // this.isLoggedIn = this.userInternal.CheckIfUserLoggedIn();
    // this.loggedInUser = this.userInternal.GetLoggedInUser();
  }

  ngOnInit() {

  }

  OpenRegisterLogin() {
    this.router.navigate(["/login"]);

  }


  Logout() {

    this.userInternal.RemoveAllFromLocalStorage();
    this.authService.LogOut();

  }

}
