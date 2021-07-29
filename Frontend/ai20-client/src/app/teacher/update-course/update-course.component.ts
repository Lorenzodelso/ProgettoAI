import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/service/teacher.service';
import { FormGroup, FormControl } from '@angular/forms';
import {Course} from 'src/app/course.model';
import {Teacher} from 'src/app/teacher.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/notification/notification.component';

@Component({
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.css']
})
export class UpdateCourseComponent implements OnInit {
  course_name: string;
  course: Course;
  form: FormGroup;
  all_prof: Teacher[];
  docentiCorso: Teacher[];
  selected_prof: Teacher[];

  constructor(private teacherService: TeacherService,private activatedRoute: ActivatedRoute,private dialog: MatDialog, public router: Router) { 
    this.all_prof=[];
    this.docentiCorso=[];
    this.activatedRoute.params.subscribe(p => {
      this.course_name = p['course_name'];
      } )
  }
  ngOnInit(): void {
    this.getAll();
    this.inizializza_form();
    this.teacherService.getCourseByName(this.course_name)
    .subscribe( course => {
      this.course= course;
      console.log(course);
      this.riempi_form();
     } );
  }

  getAll(): void {
    this.teacherService.getAllProfessors()
    .subscribe(s => { this.all_prof = s;});
  }

  inizializza_form() {
    this.form = new FormGroup({
      'nome_corso': new FormControl(),
      'min': new FormControl(),
      'max': new FormControl(),
      'enabled': new FormControl(),
      'cpu': new FormControl(),
      'gbram': new FormControl(),
      'gbdisk': new FormControl(),
    });
  }

  riempi_form() {
    this.form = new FormGroup({
      'nome_corso': new FormControl(this.course.name,[]),
      'min': new FormControl(this.course.min,[]),
      'max': new FormControl(this.course.max,[]),
      'enabled': new FormControl(this.course.enabled,[]),
      'cpu': new FormControl(this.course.modelVM_cpu,[]),
      'gbdisk': new FormControl(this.course.modelVM_GBDisk,[]),
      'gbram': new FormControl(this.course.modelVM_GBRam,[]),

    });
  }

  onSubmit() {
    let course_updated= new Course;
    course_updated.name=this.nome_corso;
    course_updated.min=this.min;
    course_updated.max=this.max;
    course_updated.modelVM_cpu=this.cpu;
    course_updated.modelVM_GBDisk=this.gbdisk;
    course_updated.modelVM_GBRam=this.gbram;

  if(this.enabled==true) 
  //enable course
  this.teacherService.enableCourse(this.nome_corso)
  .subscribe(s => { console.log(s); });
  else  
  //disable course
  this.teacherService.disableCourse(this.nome_corso)
  .subscribe(s => { console.log(s); });   
  
  //let ids: string[] = ['bonina@mail.com'];
  let ids: string[] = [];
  this.selected_prof.forEach(item => ids.push(item.id));

    this.teacherService.updateCourse(this.nome_corso,course_updated,ids)
    .subscribe(s => {
      console.log(s);
      if(s){
        this.openDialog_notification_confirm("Corso aggiornato!");
        this.router.navigateByUrl("/teacher/courses/"+this.course_name+"/riepilogo-teacher");
      }
      else
      this.openDialog_notification_confirm("Si è verificato un problema..."); },
    err =>this.openDialog_notification_confirm("Si è verificato un errore"));   
  }


//event click scelta professori
  scelta_professori(profs: Teacher[]): void {
    this.selected_prof=profs;
    console.log(this.selected_prof);
  }

  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '250px',
      data: {
        text: msg
      }
  }); }

  get nome_corso() { return this.form.get('nome_corso').value; }
  get min() { return this.form.get('min').value; }
  get max() { return this.form.get('max').value; }
  get enabled() { return this.form.get('enabled').value; }
  get cpu() { return this.form.get('cpu').value; }
  get gbdisk() { return this.form.get('gbdisk').value; }
  get gbram() { return this.form.get('gbram').value; }




}
