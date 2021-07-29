import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../../user.model';

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

  

  
  login() {
    //console.log("login in LoginDialogComponent");
    const val = this.form.value;
    if(!this.form.invalid) {
      this.authservice.login(val.email, val.password)
          .subscribe( 
            data => { this.dialogRef.close("ok"); },
            err => this.myError='Login error!'
          );
    }
  }

 /* logout() {
    console.log("logout in LoginDialogComponent");
    this.authservice.logout();
  }*/


}
