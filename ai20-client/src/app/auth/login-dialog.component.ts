import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../user.model';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
  
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  myError='';
  form: FormGroup;
  user: User;
  getErrorEmailMessage() {
        if(this.email.hasError('required')){
          return 'Not a valid email';
        }
    }
  
  getErrorPasswordMessage(){
    if(this.password.hasError('required')){
      return 'Not a valid password';
    }
  }

  

  constructor(private fb: FormBuilder, private authservice: AuthService, public dialogRef: MatDialogRef<LoginDialogComponent>) {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
    
    
  }

  ngOnInit(): void {
  }

  

  /*
  this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });


  login() {
    //console.log("login in LoginDialogComponent");
    const val = this.form.value;
    
    if(!this.form.invalid) {
      this.authservice.login(val.email, val.password)
          .subscribe( (_) => { 
            console.log('User is logged in. Received: ' + JSON.stringify(_));
            console.log(_);
            if(_ != null ) {
              //console.log("ricevuto");
              this.dialogRef.close();
            }else{
              console.log("ricevuto");
              this.myError=null;
            }
          }
          );
    }
  }


  */
  
  login() {
    //console.log("login in LoginDialogComponent");
    const val = this.form.value;
    
    if(!this.form.invalid) {
      this.authservice.login(val.email, val.password)
          .subscribe( 
            data => this.dialogRef.close(),
            error => this.myError='Login error!'
          );
    }
  }

 /* logout() {
    console.log("logout in LoginDialogComponent");
    this.authservice.logout();
  }*/


}
