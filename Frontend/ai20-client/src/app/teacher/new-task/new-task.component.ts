import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from 'src/app/service/teacher.service';
import { FormGroup, FormControl } from '@angular/forms';
import {Router} from '@angular/router';
import { Task } from 'src/app/task.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/notification/notification.component';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {
  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFile = null;
  changeImage = false;
  form: FormGroup;
  course_name: string;
  constructor(private dialog: MatDialog,private router: Router,private teacherService: TeacherService,private activatedRoute: ActivatedRoute) { 

  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(p => {
      this.course_name = p['course_name'];
      } )
    this.inizializza_form();
  }



  inizializza_form() {
    this.form = new FormGroup({
      'giorniScadenza': new FormControl(),
      'testo': new FormControl(),
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
  this.teacherService.createTask(this.course_name,this.giorniScadenza)
  .subscribe (s => {
    console.log(s);  
    let task: Task;
    task = s;
  //adesso setto la immagine
  this.teacherService.setImageTask(this.course_name,task.id,this.currentFileUpload).
  subscribe( s => {
    console.log(s);
    this.openDialog_notification_confirm("Task creato con successo!");
    this.router.navigate(['teacher/courses/'+this.course_name+'/task']);
  },

            err => this.openDialog_notification_confirm("Si è verificato un errore"));
  //fine set img

    this.selectedFiles = undefined;
  },
  err => alert("Si è verificato un errore!") ) 
   }

   selectFile(event) {
    this.selectedFiles = event.target.files;
  }
 

  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '250px',
      data: {
        text: msg
      }
  }); }

  get testo() { return this.form.get('testo').value; }
  get giorniScadenza() { return this.form.get('giorniScadenza').value; }


}
