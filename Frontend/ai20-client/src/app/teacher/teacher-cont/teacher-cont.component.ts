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



@Component({
  selector: 'app-teacher-cont',
  templateUrl: './teacher-cont.component.html',
  styleUrls: ['./teacher-cont.component.css']
})
export class TeacherContComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('table') table: MatTable<Element>;
  @Input() selectedProf:Teacher;

  
  @Output() addEmitter_professors = new EventEmitter<Teacher[]>();
  @Output() removeEmitter = new EventEmitter<Teacher[]>();


  columnsToDisplay: string[] = ['select', 'id', 'name', 'firstName'];
  profControl = new FormControl();
  filteredProf: Observable<Teacher[]>;
  private _all_prof: Teacher[];

  @Input() set all_prof( all_prof: Teacher[]){
    //console.log("called @Input() set enrolledStudents");

    this._all_prof = all_prof.filter ( prof => prof.id != this.authService.getUserId()); //tolgo il docente loggato dalla lista, è ovvio
    console.log(this.all_prof);
    this.dataSource = new MatTableDataSource<Teacher>(this._all_prof);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.selectedProf=null;

  }



  constructor(private authService: AuthService) {
    
  }

  dataSource = new MatTableDataSource<Teacher>();

  
  selection = new SelectionModel<Teacher>(true, []);
  
  
  ngOnInit() { 
    this.filteredProf = this.profControl.valueChanges
    .pipe(
      startWith(''), 
      map(teacher => teacher ? this._filteredProf(teacher) : this.all_prof.slice())
  );

  }




  addSelected() {    
      console.log(this.selectedProf);
  }


  saveStudentSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedProf = $event.option.value;
    console.log("Selected "+this.selectedProf.name + " "+ this.selectedProf.firstName);
  }

  prof_selected() {
    alert("prof_selected");
  }




  selezione_profs() {
    let list: Teacher[] = [];
    this.selection.selected.forEach(item =>list.push(item));
    this.addEmitter_professors.emit(list);
    this.all_prof = this._all_prof;
    this.selection = new SelectionModel<Teacher>(true, []);

  }


  private _filteredProf(value: string): Teacher[] {
    const filterValue = value.toString().toLowerCase();
    //console.log(value);
    //console.log(this.students);
    return this.all_prof.filter(x => x.name.toString().toLowerCase().indexOf(filterValue) === 0 || x.firstName.toString().toLowerCase().indexOf(filterValue) === 0); 
  }
  
  
  
  displayFn(s: Teacher): string {   
      return s && s.name ? (s.name+" "+s.firstName) : '';
  }




  /** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this._all_prof.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this._all_prof.forEach(row => this.selection.select(row));
}











}
