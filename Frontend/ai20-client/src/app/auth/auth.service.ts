import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { User } from 'src/app/user.model';
import { map, tap, shareReplay } from 'rxjs/operators';
import { ifError } from 'assert';
import * as moment from 'moment';
import { User_registration } from '../user_registration.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_PATH ='http://localhost:8080';
  user: User;
  role: string;
  loggedin : boolean;
  id: string;
  isProf: boolean;
  isStud: boolean;
  
  constructor(private http: HttpClient) { 
     this.loggedin = false;
  }


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.API_PATH}/auth/signin`, {username: email,password: password} )
          .pipe(tap(res => this.setSession(res))
          );    
  }
  
  
  registration(userDTO: User_registration) {
    console.log(userDTO);

    return this.http.post<User>(this.API_PATH + '/register', userDTO );  
  }



  private setSession(res) {
    this.loggedin = true;
    const token=res.token;
    const role=res.role[0];
    const name=res.name;
    this.id = res.username;
    this.role = res.role[0];

    localStorage.setItem('accessToken', token);
    localStorage.setItem('role', res.role[0]);
    localStorage.setItem('name', res.username);
    // localStorage.setItem('expires_at', tkn.exp);
    
  }



  logout(){
    this.loggedin = false;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    // console.log('AuthService.logout: accessToken removed');
  }
  
  public isloggedIn() {
    var scad = localStorage.getItem('expires_at');
    // console.log(scad);
    // console.log(Number(scad));
    // console.log(+moment().unix());
    if (+moment().unix() < Number(scad)  )
      return true;
  }

  
public isProfessor() {
    if(localStorage.getItem('role')=='ROLE_PROFESSOR') {
      this.isProf=true;
      this.isStud=false;
    return true; }
    else {
      this.isProf=false;
      return false; }
  }

  public isStudent() {
    if(localStorage.getItem('role')=='ROLE_STUDENT')
    {
      this.isProf=false;
      this.isStud=true;
      return true;
    }

    else {
      this.isStud=false;
      return false;
    }
  }

  public resetRole(){
    localStorage.setItem('role',null);
  }

  public getUserId() {
    return this.id;
  }

  public getStudentRole() {
    return this.role;
  }
  
    public isloggedOut() { return !this.isloggedIn(); }

}
