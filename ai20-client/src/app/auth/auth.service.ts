import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { User } from 'src/app/user.model';
import { map, tap, shareReplay } from 'rxjs/operators';
import { ifError } from 'assert';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_PATH = 'http://localhost:3000';
  user: User;
  loggedin : boolean;

  constructor(private http: HttpClient) { 
     this.loggedin = false;
  }


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  login(email: string, password: string): Observable<User> {
    // console.log(email);
    // console.log(password);
    return this.http.post<User>(`${this.API_PATH}/login`, { email, password } )
          .pipe(tap(res => this.setSession(res))
          );    
  }

  private setSession(token) {
    this.loggedin = true;
    
    const tkn = JSON.parse(atob(token.accessToken.split('.')[1]));
    console.log(atob(token.accessToken.split('.')[1]));
    localStorage.setItem('accessToken', token.accessToken);
    localStorage.setItem('expires_at', tkn.exp);
    console.log(this.isloggedIn());
    console.log(this.isloggedOut());
  }



  logout(){
    this.loggedin = false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');
    console.log('AuthService.logout: accessToken removed');
  }
  
  public isloggedIn() {
    var scad = localStorage.getItem('expires_at');
    // console.log(scad);
    // console.log(Number(scad));
    // console.log(+moment().unix());
    if (+moment().unix() < Number(scad)  )
      return true;
  }

  public isloggedOut() { return !this.isloggedIn(); }

}
