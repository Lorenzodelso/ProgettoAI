import { Component, ViewChild, EventEmitter ,ElementRef, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import {Student} from 'src/app/student.model'
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {FormControl, Form} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'; 
import {MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('table') table: MatTable<Element>;
  @Input() selectedstudent:Student;
  
  @Output() addEmitter = new EventEmitter<Student>();
  @Output() removeEmitter = new EventEmitter<Student[]>();


  columnsToDisplay: string[] = ['select', 'id', 'serial', 'name', 'firstName'];
  studControl = new FormControl();
  filteredStudents: Observable<Student[]>;
  private _enrolledStudents;

  @Input() students: Student[];
  @Input() set enrolledStudents( enrolledStudents: Student[]){
    //console.log("called @Input() set enrolledStudents");

    this._enrolledStudents = enrolledStudents;
    this.dataSource = new MatTableDataSource<Student>(this._enrolledStudents);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.selectedstudent=null;

  }



  constructor() {
    
  }

  dataSource = new MatTableDataSource<Student>(this._enrolledStudents);

  
  selection = new SelectionModel<Student>(true, []);
  
  
  ngOnInit() { 
 
    this.filteredStudents = this.studControl.valueChanges
    .pipe(
      startWith(''), 
      map(student => student ? this._filteredStudents(student) : this.students.slice())
  );

  }




  addSelected() {    
      //this._enrolledStudents.push(this.selectedstudent);
      if(this.selectedstudent !=null) {
        this.addEmitter.emit(this.selectedstudent);
        this.enrolledStudents = this._enrolledStudents;
      }else {
        //console.log("selected null");
      }
    
  }


  saveStudentSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedstudent = $event.option.value;
    console.log("Selected "+this.selectedstudent.name + " "+ this.selectedstudent.firstName);
  }




  deleteRow() {
    let list: Student[] = [];
    this.selection.selected.forEach(item => list.push(item));
    this.removeEmitter.emit(list);
    this.enrolledStudents = this._enrolledStudents;
    this.selection = new SelectionModel<Student>(true, []);

  }


  private _filteredStudents(value: string): Student[] {
    const filterValue = value.toString().toLowerCase();
    //console.log(value);
    //console.log(this.students);
    return this.students.filter(x => x.name.toString().toLowerCase().indexOf(filterValue) === 0 || x.firstName.toString().toLowerCase().indexOf(filterValue) === 0); 
  }
  
  
  
  displayFn(s: Student): string {   
      return s && s.name ? (s.name+" "+s.firstName) : '';
  }




  /** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this._enrolledStudents.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this._enrolledStudents.forEach(row => this.selection.select(row));
}











}
