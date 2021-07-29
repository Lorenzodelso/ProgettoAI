import { Component, ViewChild, EventEmitter ,ElementRef, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import {Student} from 'src/app/student.model'
import {Teacher} from 'src/app/teacher.model'

import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {FormControl, Form} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'; 
import {MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { Task } from 'src/app/task.model';

@Component({
  selector: 'app-teacher-task',
  templateUrl: './teacher-task.component.html',
  styleUrls: ['./teacher-task.component.css']
})
export class TeacherTaskComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('table') table: MatTable<Element>;

  @Input() course_name: string;
  @Input() set tasks( tasks: Task[]){
  
    this.dataSource = new MatTableDataSource<Task>(tasks);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  dataSource = new MatTableDataSource<Task>();
  columnsToDisplay: string[] = ['id', 'dataRilascio', 'dataScadenza','testo','manage'];

  
  
  constructor() {}
  ngOnInit() {}





}
