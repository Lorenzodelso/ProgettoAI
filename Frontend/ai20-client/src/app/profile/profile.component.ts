import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from 'src/app/service/teacher.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Student } from 'src/app/student.model';
import { Teacher } from 'src/app/teacher.model';
import { AppComponent } from 'src/app/app.component';
import { DomSanitizer } from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/notification/notification.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string;
  info_student: Student = new Student("","","","","","","no_img");
  info_teacher: Teacher = new Teacher("","","","no_img");
  isProfessor: boolean;
  isStudent: boolean;

  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFile = null;
  changeImage = false;
  form: FormGroup;

  constructor(private dialog: MatDialog,private appComponent: AppComponent,private activatedRoute: ActivatedRoute,private sanitizer: DomSanitizer,private authService: AuthService,private teacherService: TeacherService) { }

  ngOnInit(): void {
    this.checkProf();
    this.checkStudent();
    this.activatedRoute.params.subscribe(p => {
      this.username = p['user'];
      } )
      //carico info profilo
      this.getInfoUser();
      //inizializzo il form per l'upload img
      this.inizializza_form();
  }

/*Roba per upload immagine*/

inizializza_form() {
  this.form = new FormGroup({
    'immagine_profilo': new FormControl(),
  });
}



change($event) {
  this.changeImage = true;
}
changedImage(event) {
  this.selectedFile = event.target.files[0];
}

onSubmit() {
this.currentFileUpload = this.selectedFiles.item(0);
//caso prof
if(this.username.startsWith("d"))
this.setImageProfile(this.currentFileUpload,"prof");
//caso stud
if(this.username.startsWith("s"))
this.setImageProfile(this.currentFileUpload,"stud");

this.selectedFiles = undefined; }


 selectFile(event) {
  this.selectedFiles = event.target.files;
}

setImageProfile(image: File,flag: string) {
  if(flag=="prof") {
  this.teacherService.setImageProfileProf(this.username,image)
  .subscribe(
     s => {
    this.openDialog_notification_confirm("Immagine del profilo aggiornata!");
    //aggiorno l'img visualizzata
    this.getInfoUser();
    //aggiorno l'img nel pannello a dx
    this.appComponent.reload_img();

  },
    err => 
    this.openDialog_notification_confirm("Si è verificato un errore"));
  }
  if(flag=="stud") {
    this.teacherService.setImageProfileStudent(this.username,image)
    .subscribe(
      s => {
    this.openDialog_notification_confirm("Immagine del profilo aggiornata!");
         //aggiorno l'img visualizzata
    this.getInfoUser();
    //aggiorno l'img nel pannello a dx
    this.appComponent.reload_img();
   },
     err => 
     this.openDialog_notification_confirm("Si è verificato un errore"));
   }
  } 

//fine roba per upload img

getInfoUser(): void {
  if(this.authService.isProfessor())
  {
  this.teacherService.getProfessorById(this.authService.getUserId())
    .subscribe (s => {
      console.log(s);
      if(s.photoDocente==null || s.photoDocente=="") this.info_teacher.photoDocente=null;
      else {
      let objectURL = 'data:image/png;base64,' + s.photoDocente;
      this.info_teacher.photoDocente = this.sanitizer.bypassSecurityTrustUrl(objectURL); }
      this.info_teacher.id=s.id;
      this.info_teacher.name=s.name;
      this.info_teacher.firstName=s.firstName;

    
    }); }

    if(this.authService.isStudent())
    {

      this.teacherService.getStudentById(this.authService.getUserId())
      .subscribe (s => {
        if(s.photoStudent==null ||s.photoStudent=="") this.info_student.photoStudent=null;
        else {
        let objectURL = 'data:image/png;base64,' + s.photoStudent;
        this.info_student.photoStudent = this.sanitizer.bypassSecurityTrustUrl(objectURL); }
        this.info_student.firstName=s.firstName;
        this.info_student.name=s.name;
        this.info_student.id=s.id;
    
      });
    }


}


public checkPhoto_prof() {
  if(this.info_teacher.photoDocente==null) {
  return true; }
  else return false;
}

public checkPhoto_student() {
  console.log(this.info_student);
  if(this.info_student.photoStudent==null) {
  return true; }
  else return false;
}

openDialog_notification_confirm(msg: string): void {
  const dialogRef = this.dialog.open(NotificationComponent, {
    width: '400px',
    height: '250px',
    data: {
      text: msg
    }
}); }

checkProf(): void {
  this.isProfessor=this.authService.isProfessor();
}
checkStudent(): void {
  this.isStudent=this.authService.isStudent();
}


}

