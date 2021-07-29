
import { Component, ViewChild, EventEmitter ,ElementRef, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {FormControl, Form} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'; 
import {MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { Student } from 'src/app/student.model';
import { AuthService } from 'src/app/auth/auth.service';

  

@Component({
  selector: 'app-members-cont',
  templateUrl: './members-cont.component.html',
  styleUrls: ['./members-cont.component.css']
})

  export class MembersContComponent implements OnInit {
  //Variabili per add & enroll from csv
  selectedFiles: FileList;
  currentFileUpload: File;
  selectedFile = null;
  changeImage = false;
  //fine variabili csv
  
  
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild('table') table: MatTable<Element>;
    @Input() selectedstudent:Student;
    
    @Output() addEmitter = new EventEmitter<Student[]>();
  
  
    columnsToDisplay: string[] = ['select', 'id', 'name', 'firstName'];
    studControl = new FormControl();
    filteredStudents: Observable<Student[]>;
    private _enrolledStudents;
  
    @Input() students: Student[];
    @Input() id: string;
    @Input() course_name: string;
    @Input() set enrolledStudents( enrolledStudents: Student[]){
       //tolgo lo studente loggato dalla lista, è ovvio
       this._enrolledStudents = enrolledStudents.filter ( stud => stud.id != this.authService.getUserId());

      this.dataSource = new MatTableDataSource<Student>(this._enrolledStudents);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.selectedstudent=null;
  
    }
  
  
  
    constructor(private authService: AuthService) {
      
    }
  
    dataSource = new MatTableDataSource<Student>();
  
    
    selection = new SelectionModel<Student>(true, []);
    
    
    ngOnInit() { 
      this.filteredStudents = this.studControl.valueChanges
      .pipe(
        startWith(''), 
        map(student => student ? this._filteredStudents(student) : this.students.slice())
    );
  
    }
  
  

  
  
    saveStudentSelected($event: MatAutocompleteSelectedEvent) {
      this.selectedstudent = $event.option.value;
      console.log("Selected "+this.selectedstudent.name + " "+ this.selectedstudent.firstName);
    }
  
  
  

  
  
    private _filteredStudents(value: string): Student[] {
      const filterValue = value.toString().toLowerCase();
      //console.log(value);
      //console.log(this.students);
      return this.students.filter(x =>  x.name.toString().toLowerCase().indexOf(filterValue) === 0 || x.firstName.toString().toLowerCase().indexOf(filterValue) === 0); 
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
  
  
  
  
  editOwners(): void {         
    let list: Student[] = [];
    this.selection.selected.forEach(item =>list.push(item));
    this.addEmitter.emit(list);
  } 
}
  
  
  
  
  