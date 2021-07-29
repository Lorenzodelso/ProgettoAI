import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-menu-student',
  templateUrl: './menu-student.component.html',
  styleUrls: ['./menu-student.component.css']
})
export class MenuStudentComponent implements OnInit {
  @Input() course_name:string;
  constructor() { }

  ngOnInit(): void {

  }

}
