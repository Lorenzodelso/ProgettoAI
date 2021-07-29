import { Component, ViewChild, ElementRef, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import {Student} from 'src/app/student.model'
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from '../../service/teacher.service';
import { NotificationComponent } from '../../notification/notification.component';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit {
  enrolled: Student[];
  students: Student[];
  id_course: string;
  course_name: string;

  constructor(private teacherService: TeacherService,private activatedRoute: ActivatedRoute,private dialog: MatDialog ) {
      this.enrolled = [];
      this.students = [];

  }

  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(p => {
      this.id_course = p['id'];
      this.course_name = p['course_name'];

      this.getEnrolledStudents();
      this.getAll();
    });

    
  }
  

  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '250px',
      data: {
        text: msg
      }
  }); }


  //implementazione service

  getEnrolledStudents(): void {
    this.teacherService.getEnrolled(this.course_name)
        .subscribe(s => this.enrolled = s);
  }

  getAll(): void {
    this.teacherService.getAllStudents()
    .subscribe(s => this.students = s);
  }
  

  onAdded(stud: Student): void {
    this.teacherService.updateAdd(stud, this.course_name)
        .subscribe( _ => 
          { this.getEnrolledStudents(); 
          }
          
        );
  }

  onAdded_csv(csv_file: File): void {
    this.teacherService.updateAdd_csv(this.course_name,csv_file)
    .subscribe( s => 
          { this.getEnrolledStudents(); 
          },
          err => {
            this.openDialog_notification_confirm("Si è verificato un errore: inserisci un file csv nel formato corretto.");
            
          }
          
        );
  }

  onRemoved(studs: Student[]): void {
    console.log(studs);
    this.teacherService.updateDelete(studs,this.course_name)
        .subscribe( _ => 
          { this.getEnrolledStudents();
          }
          
        );
    
  }



  onRemoved1(studs: Student[]) {
    //console.log("emitter remove called");
    studs.forEach(item => {
      let index: number = this.enrolled.findIndex(d => d === item);
      //console.log(this.enrolled.findIndex(d => d === item));
      this.enrolled.splice(index,1)
    });
  }


  
}
