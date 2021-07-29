import { Component, ViewChild, EventEmitter ,ElementRef, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import {Student} from 'src/app/student.model'
import {Teacher} from 'src/app/teacher.model'
import { TeacherService } from 'src/app/service/teacher.service';

import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'; 
import {MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { Essay } from 'src/app/essay.model';



@Component({
  selector: 'app-essay-cont',
  templateUrl: './essay-cont.component.html',
  styleUrls: ['./essay-cont.component.css']
})
export class EssayContComponent implements OnInit {

  constructor(private teacherService: TeacherService) {}
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('table') table: MatTable<Element>;

  dataSource = new MatTableDataSource<Essay>();
  //colonne tabella
  columnsToDisplay: string[] = ['id','id_studente','nome_studente','stato','timestamp','voto','storico'];

  //parametri ricevuti
  @Input() course_name:string;
  @Input() task_id:string


  @Input() set essay_per_task( all_essays: Essay[]){

    //aggiungo nome e cognome per visualizzarli ( dal server arriva solo idStudente, aggiungo Nome + Cognome con un altra chiamata al service), a partire dall'id
    all_essays.forEach(essay => {
      this.teacherService.getStudentById(essay.idStudente)
      .subscribe( stud=> essay.nome_studente=stud.name+" "+stud.firstName)
      });
    this.dataSource = new MatTableDataSource<Essay>(all_essays);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }


/*filtering*/
filterForm = new FormGroup({
  filtering_state: new FormControl()
});
  
  
  ngOnInit() { 
/*filtering per stato */
  this.dataSource.filterPredicate = (data: Essay, filter: string) => {
    if(filter=='all') return true;
    return data.stato == filter;
   };

  }


  applyFilter() {
    this.dataSource.filter = this.filtering_state;
  }

//ritorna il valore del filtro
get filtering_state() { 
  return this.filterForm.get('filtering_state').value;
}


}
