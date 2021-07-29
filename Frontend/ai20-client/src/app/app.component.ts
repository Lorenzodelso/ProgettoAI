import { Component, ViewChild, ElementRef, OnInit, Output, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {Observable, Subscription} from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';
import { AuthService } from './auth/auth.service';
import {StudentService} from 'src/app/service/student.service'
import { Router, ActivatedRoute } from '@angular/router';
import { TeacherService } from './service/teacher.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RegistrationDialogComponent } from './auth/registration-dialog/registration-dialog.component';
import { NotificationComponent } from './notification/notification.component';
import { ConfirmDeleteDialogComponent } from './teacher/confirm-delete-dialog/confirm-delete-dialog.component';
import { Student } from './student.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit, OnDestroy{
  public course_list = true;
  courses = [];
  public tab_type = 0;  // professore o non loggato => 0   ; studente => 1
  
  id: string;
  role: string;   //ruolo user = {STUDENT, PROFESSOR}
  course_name: string;
  title = 'ai20-lab05';
  routeQueryParams$: Subscription;
  username: string;
  photo: any;
  teamPresent: boolean;
  teamId:string;

  menuAvailable : Observable<boolean>
  show_bar= false;

  @ViewChild('sidenav') sidenav: MatSidenav;


constructor(private teacherService:TeacherService,private sanitizer: DomSanitizer, public dialog: MatDialog, public authService: AuthService, private router: Router, private route: ActivatedRoute, private studentService: StudentService) {
  this.courses= [];
  this.id = null;
  this.role = null;
  this.course_name = null;
  this.routeQueryParams$ = route.queryParams.subscribe(params => {
    if (params['doLogin']) {
      this.openDialog_login();
      this.sidenav.close();
    }
	if (params['doRegistration']) {
      this.openDialog_registration();
      this.sidenav.close();

    }
  });
}

  ngOnInit() {
    this.authService.resetRole();
    this.tab_type=0;
    this.router.navigateByUrl('home');
  }

  


  toggleForMenuClick() {
    this.sidenav.toggle();
  }

//dialog login
  openDialog_login(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '250px'  
  });
    dialogRef.afterClosed().subscribe( end => {
		this.setRole();
		
      if(end=="ok" && this.role=='ROLE_PROFESSOR') {
        //mi sono loggato come professore
	    	this.tab_type=0;
        //this.username=localStorage.getItem('username');
         this.getID();
         this.getProfessorInfo();
         this.getCoursesProf();
         this.getPhoto();
         setTimeout(() => {      //apro sidenav una volta che i corsi sono disponibili
          this.toggleForMenuClick();
          }, 200);
      }
      else if(end=="ok" && this.role=='ROLE_STUDENT') {
		    //mi sono loggato come studente
		    this.tab_type=1;
        this.getCoursesForStudent();
        //this.username=localStorage.getItem('username');
        this.getID();
        this.getStudentInfo();
        this.getPhoto();
        setTimeout(() => {      //apro sidenav una volta che i corsi sono disponibili
          this.toggleForMenuClick();
          }, 200);
      }

      this.router.navigateByUrl('home');
      /* setTimeout(() => {      //apro sidenav una volta che i corsi sono disponibili
          this.toggleForMenuClick();
          }, 200); */
    });
    
  }
  
  
  
    //dialog registration
  openDialog_registration(): void {
    const dialogRef = this.dialog.open(RegistrationDialogComponent, {
      height: '90%',
      width: '40%'
  });
    dialogRef.afterClosed().subscribe( end => {
       this.router.navigateByUrl('home');
       if(end=="ok") {
         setTimeout(() => {      //apro sidenav una volta che i corsi sono disponibili
          this.toggleForMenuClick();
          }, 200);
      }
      
    });
    
  }
//dialog messaggi di conferma
  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '250px',
      data: {
        text: msg
      }}); 

 }

     //dialog CONFERMA DELETE COURSE
  openDialog_confirm_delete_course(msg: string,courseName: string): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '500px',
      height: '500px',
      data: {
        text: msg
      }}); 
      dialogRef.afterClosed().subscribe( end => {
        if(end=="delete") {
          //
          this.delete_course(courseName);
       }
       
     });}


  
  delete_course(name) {
    this.teacherService.deleteCourse(name)
    .subscribe(s => {
      this.openDialog_notification_confirm("Operazione effettuata con successo!");
      this.reload_courses();
      this.router.navigateByUrl('/home');
    },
    err => { 
      this.openDialog_notification_confirm("Si è verificato un errore...");
    });
  }

    getCoursesProf(): void {
      this.teacherService.getCoursesByProf(this.id)
          .subscribe(s => {this.courses = s;console.log(this.courses);});
    }

    getPhoto(): void {
      if(this.authService.isProfessor())
      {
      this.teacherService.getProfessorById(this.id)
        .subscribe (s => {
          console.log(s);
          if(s.photoDocente==null || s.photoDocente=='')
          this.photo="/assets/standard_img.png";
          else {
          let objectURL = 'data:image/png;base64,' + s.photoDocente;
          //this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL); }
        
        }); }

        if(this.authService.isStudent())
        {

          this.teacherService.getStudentById(this.id)
          .subscribe (s => {
            console.log(s);
            if(s.photoStudent==null || s.photoStudent==''){
            this.photo="/assets/standard_img.png";
            }else {
            let objectURL = 'data:image/png;base64,' + s.photoStudent;
            //this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            this.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL); }
          });
        }


    }

    public checkPhoto_prof() {
      if(this.photo==null) {
      return true; }
      else return false;
    }
    
  reload_courses() {
    this.getCoursesProf();
  }

  reload_img() {
    this.getPhoto();
  }



  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/home');
	this.photo=null;
    this.sidenav.close();
    this.courses= [];
    this.id = null;
    this.role = null;
    this.course_name = null;
    this.tab_type=0;
    
  }

  ngOnDestroy() {
    this.routeQueryParams$.unsubscribe();
  }


  clicked_course(course_name:string) {
    if(course_name=='new_course') {
    this.course_name="Nuovo corso"; 
    this.show_bar=false; }
    else if(course_name=='home') {
    this.course_name="Home";
    this.show_bar=false; }
    else if(course_name=='profile') {
    this.course_name="Profile";
    this.show_bar=false; }
    else {
    this.course_name=course_name;
    this.show_bar=true; }
    //mostro la navbar Studenti,Consegne etc
    
    if (this.show_bar) {
    this.menuAvailable = new Observable(observer=>observer.next(this.show_bar));
    this.menuAvailable.subscribe();
  } else {

    this.menuAvailable = new Observable(observer=>observer.next(this.show_bar));
    this.menuAvailable.subscribe();   
}
    this.menuAvailable = new Observable(observer=>observer.next(this.show_bar));

    console.log(this.course_name);

  
  }
  
  
  clicked_delete(name:string) : void {
    this.openDialog_confirm_delete_course("Sei sicuro di voler eliminare il corso ''"+name+"''?",name);
    }

	clicked_edit(course_name:string) : void {
    this.course_name=course_name;
	}

  getID(){
    this.id = this.authService.getUserId();
    console.log(this.id);
  }

  getStudentInfo(){
    this.studentService.getStudentById(this.id).subscribe(
      student => {
        this.username = student.name + " " + student.firstName;
      }
    )
  }

  getProfessorInfo(){
    this.teacherService.getProfessorById(this.id).subscribe(
      prof => {
        this.username = prof.name + " " + prof.firstName;
      }
    )
  }

  getCoursesForStudent(): void {
      this.getID();
      this.studentService.getStudentCourses(this.id)
          .subscribe(s => {this.courses = s;/*console.log(this.courses);*/});
  }


  getCourses(): void {
    this.studentService.getCourses()
        .subscribe(s => {this.courses = s;/*console.log(this.courses);*/});
  }

  setRole(): void {
    this.role = this.authService.getStudentRole();
    console.log(this.role);
  }


  
  groupClicked(course: string): void{
    this.studentService.getStudentTeamByCourse(this.id, course)
    .subscribe( g => {
      console.log('>>>>>>>>teamExist');
      if(g!==null) this.teamId = g.id;
      console.log(this.teamId);
      if(this.teamId!==undefined){
        this.teamPresent=true;
      }else
        this.teamPresent=false;
      console.log(this.teamPresent);
      this.router.navigateByUrl('student/courses/'+ course +'/groups');
    });

  }

}