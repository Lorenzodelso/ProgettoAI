import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-riepilogo-student',
  templateUrl: './riepilogo-student.component.html',
  styleUrls: ['./riepilogo-student.component.css']
})
export class RiepilogoStudentComponent implements OnInit {
  
  course_name: string;
  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(p => {
      this.course_name = p['course_name'];
      } )
  }

}
