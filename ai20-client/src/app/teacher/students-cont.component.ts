import { Component, ViewChild, ElementRef, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import {Student} from 'src/app/student.model'
import { Router } from '@angular/router';
import { StudentsComponent } from './students.component';
import { toArray, mergeMap } from 'rxjs/operators';
import {StudentService} from 'src/app/service/student.service'
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-students-cont',
  templateUrl: './students-cont.component.html',
  styleUrls: ['./students-cont.component.css']
})
export class StudentsContComponent implements OnInit {
  enrolled: Student[];
  students: Student[];

  constructor(private studentService: StudentService ) {
      this.enrolled = [];
      this.students = [];
  }

  
  ngOnInit(): void {
    this.getEnrolled();
    this.getAll();
    
  }
  


  //implementazione service

  getEnrolled(): void {
    this.studentService.query()
        .subscribe(s => this.enrolled = s);
  }

  getAll(): void {
    this.studentService.getAllStudents()
    .subscribe(s => this.students = s);
  }
  

  onAdded(stud: Student): void {
    this.studentService.updateAdd(stud, "1")
        .subscribe( _ => 
          { this.getEnrolled(); 
          }
          
        );
  }

  onRemoved(studs: Student[]): void {
    console.log(studs);
    this.studentService.updateDelete(studs)
        .subscribe( _ => 
          { this.getEnrolled();
          }
          
        );
    
  }

  onAdded1(stud: Student) {
    //console.log("emitter add called");    
    //console.log(this.enrolled.some(s => s.id === stud.id && s.name === stud.name && s.firstName === stud.firstName));
    if( !this.enrolled.some(s => s.serial === stud.serial && s.name === stud.name && s.firstName === stud.firstName)) {
      this.enrolled.push(stud);      
    }else{
      //console.log("Already present");
    }

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
