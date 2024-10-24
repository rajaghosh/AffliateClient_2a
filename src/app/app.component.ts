import { Component } from '@angular/core';
import { NavigationEnd, Route, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserInternalService } from './service/common-services/user-internal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AffliateClient';

  
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  loggedInUser: string = "";
  userName: string = "";

  constructor(private router: Router, private userInternal: UserInternalService) {


    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((x: any) => {
      this.isAdmin = this.userInternal.CheckIfUserAdmin();
      this.isLoggedIn = this.userInternal.CheckIfUserLoggedIn();
      this.loggedInUser = this.userInternal.GetLoggedInUser();
      this.userName = this.userInternal.GetUserName();

    });


  }

}
