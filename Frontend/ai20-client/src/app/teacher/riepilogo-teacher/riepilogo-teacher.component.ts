import { Component, OnInit } from '@angular/core';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TeacherService } from 'src/app/service/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationComponent } from 'src/app/notification/notification.component';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-riepilogo-teacher',
  templateUrl: './riepilogo-teacher.component.html',
  styleUrls: ['./riepilogo-teacher.component.css']
})
export class RiepilogoTeacherComponent implements OnInit {

  course_name: string;
  
  constructor( public dialog: MatDialog, public teacherService: TeacherService, public router: Router, public appComponent: AppComponent, public activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(p => {
      this.course_name = p['course_name'];
      } )
      //per la barra menu
      this.appComponent.clicked_course(this.course_name);
   }

  ngOnInit(): void {
  }
  
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


  openDialog_notification_confirm(msg: string): void {
  const dialogRef = this.dialog.open(NotificationComponent, {
    width: '400px',
    height: '250px',
    data: {
      text: msg
    }}); 

}
  delete_course(name) {
    this.teacherService.deleteCourse(name)
    .subscribe(s => {
      this.openDialog_notification_confirm("Operazione effettuata con successo!");
      this.appComponent.reload_courses();
      this.router.navigateByUrl('/home');
    },
    err => { 
      this.openDialog_notification_confirm("Si è verificato un errore...");
    });
  }


  clicked_delete() : void {
    this.openDialog_confirm_delete_course("Sei sicuro di voler eliminare il corso ''"+this.course_name+"''?",this.course_name);
    }

}
