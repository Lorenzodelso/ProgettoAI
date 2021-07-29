import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { Essay } from 'src/app/essay.model';
import { Image } from 'src/app/image.model';

import { TeacherService } from 'src/app/service/teacher.service';
import { DomSanitizer } from '@angular/platform-browser';
import {FormControl, FormGroup} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/notification/notification.component';
import { Task } from 'src/app/task.model';


@Component({
  selector: 'app-teacher-task-manage',
  templateUrl: './teacher-task-manage.component.html',
  styleUrls: ['./teacher-task-manage.component.css']
})
export class TeacherTaskManageComponent implements OnInit {
  course_name: string;
  task_id: number;
  my_task: Task;
  essays: Essay[];
  constructor(private router: Router,private dialog: MatDialog,private fb: FormBuilder,private sanitizer: DomSanitizer,private activatedRoute: ActivatedRoute,private teacherService: TeacherService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(p => {
      this.course_name = p['course_name'];
      this.task_id = p['task_id'];
      this.getEssaysByTask();
      this.getTaskInfo();

      } )
  }

  getEssaysByTask(): void {
      this.teacherService.getEssays(this.course_name,this.task_id)
      .subscribe( essay => {
        essay.forEach(es => {
          if(es.stato==null) es.stato="Non ancora letto";
        });
        this.essays=essay;
      console.log(this.essays); });
    
    } 

    getTaskInfo(): void {
      this.teacherService.getTaskById(this.course_name,this.task_id)
      .subscribe ( task => {
        this.my_task=task;
  
        //sanitize immagine, la salvo "pulita" cosi poi devo solo visualizzarla senza fare altro
          let objectURL = 'data:image/png;base64,' + task.description;
          task.description = this.sanitizer.bypassSecurityTrustUrl(objectURL);

        console.log(this.my_task);
      })
    }

}  





