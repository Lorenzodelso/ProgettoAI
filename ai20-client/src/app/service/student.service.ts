import { Injectable } from '@angular/core';
import { Student } from '../student.model';
import { Observable, of, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concatAll, mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  /*
npx json-server-auth virtuallabs.json -r virtuallabs_routes.json
*/
  
  private API_PATH = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  enrolled: Student[] = [];/*
    { id:'3', serial: '261078', name: 'verdi', firstName: 'biagio', courseId:'0', groupId:'0'},
    { id:'4', serial: '261068', name: 'russo', firstName: 'giovanni', courseId:'0', groupId:'0'},
    { id:'5', serial: '261058', name: 'ferrari', firstName: 'giorgio', courseId:'0', groupId:'0'}
  ];*/

  students: Student[]= [];/*
    { "id":"1", "serial": "261098", "name": "ini", "firstName": "enzo", "courseId":"0", "groupId":"0"},
    { "id":"2", "serial": "261088", "name": "bianchi", "firstName": "paolo", "courseId":"0", "groupId":"0"},
    { "id":"3", "serial": "261078", "name": "verdi", "firstName": "biagio", "courseId":"0", "groupId":"0"},
    { "id":"4", "serial": "261068", "name": "russo", "firstName": "giovanni", "courseId":"1", "groupId":"0"},
    { "id":"5", "serial": "261058", "name": "ferrari", "firstName": "giorgio", "courseId":"1", "groupId":"0"},
    { "id":"6", "serial": "261048", "name": "esposito", "firstName": "mattia", "courseId":"0", "groupId":"0"},
    { "id":"7", "serial": "261038", "name": "freco", "firstName": "corrado", "courseId":"0", "groupId":"0"},
    { "id":"8", "serial": "261032", "name": "marino", "firstName": "Paolo", "courseId":"0", "groupId":"0"},
    { "id":"9", "serial": "111111", "name": "gallo", "firstName": "Luca", "courseId":"1", "groupId":"0"},
    { "id":"10", "serial": "261398", "name": "de luca", "firstName": "enzo", "courseId":"0", "groupId":"0"},
    { "id":"11", "serial": "261032", "name": "giordano", "firstName": "paolo", "courseId":"3", "groupId":"0"},
    { "id":"12", "serial": "261048", "name": "lombardi", "firstName": "andrea", "courseId":"3", "groupId":"0"},
    { "id":"13", "serial": "223268", "name": "ricci", "firstName": "concetta", "courseId":"0", "groupId":"0"},
    { "id":"14", "serial": "261038", "name": "barbieri", "firstName": "corrado", "courseId":"2", "groupId":"0"}
  ];*/


  getAllStudents(): Observable<Student[]> {     //tutti gli studenti => opzioni per form
    //return of(this.students);
    return this.http.get<Student[]>(this.API_PATH + 'students');
  }


  query(): Observable<Student[]> {      //studenti iscritti al corso
    return this.http.get<Student[]>(this.API_PATH + 'courses/1/students');
    //return of(this.enrolled);
  }
  
/*
  update(stud: Student): {
    if( !this.students.some(s => s.serial === stud.serial && s.name === stud.name && s.firstName === stud.firstName)) {
      var ids = this.students.indexOf(stud);
      console.log(ids);
      this.students[ids].name = stud.name;
      this.students[ids].firstName = stud.firstName;
      this.students[ids].groupId = stud.groupId;
      this.students[ids].courseId = stud.courseId;
      this.students[ids].serial = stud.serial;      
    }else{
      //console.log("not present");
    }
  }*/

/*
  updateEnrolled(studList: Student[], Cid: string) {
    studList.forEach(s => {
      var i = this.students.indexOf(s);
      if(this.students[i].courseId === '0') {
        this.students[i].courseId = Cid;
      }else if(this.students[i].courseId === Cid) {
        this.students[i].courseId = '0';
      }
    });
  }*/



  updateDelete(studList: Student[]): Observable<Student> {
    studList.forEach(s => s.courseId='0');

    return <Observable<Student>> forkJoin(
      studList.map(s => {
        return <Observable<Student>> this.http.put(`${this.API_PATH}students/${s.id}`, s, this.httpOptions);
      })
    ).pipe(concatAll());
  }

  updateAdd(stud: Student, Cid: string): Observable<any> {
    stud.courseId=Cid;
    return this.http.put(`${this.API_PATH}students/${stud.id}`, stud, this.httpOptions);
  }




}
