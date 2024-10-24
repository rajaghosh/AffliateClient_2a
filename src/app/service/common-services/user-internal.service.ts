import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class UserInternalService {



  varIsAdminLoggedIn: boolean = false;
  varIsUserLoggedIn: boolean = false;

  constructor() { }

  CheckIfUserLoggedIn() {
    if (localStorage.getItem("loggedUser") !== null) {
      return true;
    }
    else {
      return false;
    }


  }


  GetLoggedInUser() {
    if (localStorage.getItem("loggedUser") !== null) {
      return localStorage.getItem("loggedUser") ?? "";
    }
    else {
      return "";
    }
  }

  GetUserName() {
    if (localStorage.getItem("userName") !== null) {
      return JSON.parse(localStorage.getItem("userName") ?? "");
    }
    else {
      return "";
    }
  }

  CheckIfUserAdmin() {
    if (localStorage.getItem("type") !== null && localStorage.getItem("type") == "\"%^&@#!#$$#@$!#!##@$##@#$@@@#$!@#!@#@1\"") {
      return true;
    }
    else {
      return false;
    }
  }

  RemoveAllFromLocalStorage(){
    // localStorage.removeItem("loggedUser");
    localStorage.clear();
  }

}
