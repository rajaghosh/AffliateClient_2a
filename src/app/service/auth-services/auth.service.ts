import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient, private router:Router) { }

  SaveToken(token: string, userDetails: string) {
    localStorage.removeItem("token");
    localStorage.setItem("token", token);

    localStorage.removeItem("userKey");
    localStorage.setItem("userKey",userDetails);
  }

  GetToken() {
    return localStorage.getItem("token") || '';
  }

  GetUserKey(){
    return localStorage.getItem("userKey") || '';
  }

  LogOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("userKey");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("type");
    
    this.router.navigate(["/login"]);
  }

  IsLoggedIn() {
    // return localStorage.getItem("token") != null;
    var check = (localStorage.getItem("token") != null) && (localStorage.getItem("userKey") != null);
    return check;

  }



}