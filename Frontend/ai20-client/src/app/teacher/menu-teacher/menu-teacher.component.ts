import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';


@Component({
  selector: 'app-menu-teacher',
  templateUrl: './menu-teacher.component.html',
  styleUrls: ['./menu-teacher.component.css']
})
export class MenuTeacherComponent implements OnInit {

@Input() course_name:string;

ngOnChanges() {}

  constructor() {}


  ngOnInit(): void {
}

}