import { Injectable } from '@angular/core';
import { Teacher } from '../teacher.model';
import { Student } from '../student.model';
import { Course } from '../course.model';
import { Team } from '../team.model';
import { Task } from '../task.model';
import { Observable, of, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concatAll } from 'rxjs/operators';
import { Vm } from '../vm.model';
import { Essay } from '../essay.model';
import {Image} from '../image.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private API_PATH = '/API/';

  constructor(private http: HttpClient) { }
  httpOptions = {
    headers: new HttpHeaders({ 
      
      'Accept': 'application/json',
      'Content-Type': 'application/json' })
  };



  /*manipolazione tabelle studenti*/ 
  enrolled: Student[] = [];
  students: Student[]= [];
  getAllStudents(): Observable<Student[]> {     //tutti gli studenti => opzioni per form
    //return of(this.students);
    return this.http.get<Student[]>(this.API_PATH + 'students');
  }


  getEnrolled(course_name: string): Observable<Student[]> {      //studenti iscritti al corso
    return this.http.get<Student[]>(this.API_PATH + 'courses/'+course_name+'/enrolled');
    //return of(this.enrolled);
  }

  getCourses(): Observable<any> {     
    return this.http.get<string[]>(this.API_PATH + 'courses/');

  }





  deleteCourse(name: string): Observable<any> {   
    return this.http.delete<string[]>(this.API_PATH + 'courses/'+name);
  }


  updateDelete(studList: Student[],course:string): Observable<Student> {
    //studList.forEach(s => s.courseId='0');

    return <Observable<Student>> forkJoin(
      studList.map(s => {
        return <Observable<Student>> this.http.put(`${this.API_PATH}courses/${course}/unsubscribeOne/${s.id}`, s, this.httpOptions);
      })
    ).pipe(concatAll());
  }

  updateAdd(stud: Student, course: string): Observable<any> {
    return this.http.post(`${this.API_PATH}courses/${course}/enrollOne`, stud, this.httpOptions);
  }

  updateAdd_csv(course: string, csv_file: File): Observable<any> {


  const data: FormData = new FormData();
  data.append('file', new Blob([csv_file], {type: 'text/csv'}), csv_file.name);

  return this.http.post(`${this.API_PATH}courses/${course}/enrollMany`, data, {
    reportProgress: true,
    responseType: 'text'
    });
  }
  //fine manipolazione tabelle studenti

  getCourseByName(course_name: string): Observable<Course> {     
    return this.http.get<Course>(this.API_PATH + 'courses/'+course_name);
  }

  getStudentById(id: string): Observable<Student> {     
    return this.http.get<Student>(this.API_PATH + 'students/'+id);
  }
  getProfessorById(id: string): Observable<Teacher> {     
    return this.http.get<Teacher>(this.API_PATH + 'professor/'+id);
  }

  updateCourse(course_name: string,courseDTO: Course, ids: string[]): Observable<any> {   
    return this.http.put(this.API_PATH + 'courses/'+course_name, {courseDTO: courseDTO, ids: ids}, this.httpOptions);
  }

  enableCourse(course_name: string): Observable<any> {     
    return this.http.get<any>(this.API_PATH + 'courses/'+course_name+'/enableCourse');
  }
  
  disableCourse(course_name: string): Observable<any> {     
    return this.http.get<any>(this.API_PATH + 'courses/'+course_name+'/disableCourse');
  }

  getAllProfessors(): Observable<Teacher[]> {     //tutti gli studenti => opzioni per form
    //return of(this.students);
    return this.http.get<Teacher[]>(this.API_PATH + 'professor');
  }

  
  getCoursesByProf(teacher_id: string): Observable<Course[]> {    
    return this.http.get<Course[]>(this.API_PATH + 'professor/'+teacher_id+'/courses');
  }

  getTeamsByCourse(course_name: string): Observable<Team[]> {      //teams del corso
    return this.http.get<Team[]>(this.API_PATH + 'courses/'+course_name+'/teams');
    //return of(this.enrolled);
  }

  getTaskByCourse(course_name: string): Observable<Task[]> {      //teams del corso
    return this.http.get<Task[]>(this.API_PATH + 'courses/'+course_name+'/tasks');
    //return of(this.enrolled);
  }

  
  getTaskById(course_name:string,task_id: number): Observable<Task> { 
    return this.http.get<Task>(this.API_PATH + 'courses/'+course_name+'/tasks/'+task_id);
    //return of(this.enrolled);
  }


  getVMS(course_name: string,team_id: number): Observable<Vm[]> {

        return this.http.get<Vm[]>(this.API_PATH + 'courses/'+course_name+'/teams/'+team_id+'/vms');

  } 



  getEssays(course_name: string,task_id: number): Observable<Essay[]> {

    return this.http.get<Essay[]>(this.API_PATH + 'courses/'+course_name+'/tasks/'+task_id+'/essays');

} 


  create_course(id_owners: string[], course: Course): Observable<any> {
    let courseDTO = JSON.stringify(course);
    console.log(course);
    console.log(id_owners);

    return this.http.post(`${this.API_PATH}courses`, {courseDTO: course,ids: id_owners}, this.httpOptions);

  }

  changeLimitVmGroup(vcpuTot: number,gbDiskTot: number,gbRamTot: number,max_accese: number,course_name: string,team_id: number) {
    ///API/courses/{name}/teams/{teamId} (PUT update limit for vms)
   /* ( Parametri della richiesta:
      "vcpus" -> int
      "GBram" -> int
      "GBdisk" -> int ) */

    return this.http.put(this.API_PATH + 'courses/'+course_name+'/teams/'+team_id, {vcpus: vcpuTot, gbram: gbRamTot, gbdisk: gbDiskTot, maxaccese: max_accese}, this.httpOptions);
  }

createTask(course_name: string, days: string): Observable<Task> {
  console.log(days);
  return this.http.post<Task>(this.API_PATH + 'courses/'+course_name+'/task', {days: days},this.httpOptions);
}


setImageTask(course_name:string, task_id: number, imageFile: File) {
  const data: FormData = new FormData();
  data.append('imageFile', imageFile);

  return this.http.put(this.API_PATH + 'courses/'+course_name+'/task/'+task_id, data, {
    reportProgress: true,
    responseType: 'text'
    });

}

getEssay_storical(course_name: string, task_id: number, essay_id: number) {
  return this.http.get<Image[]>(this.API_PATH + 'courses/'+course_name+'/tasks/'+task_id+'/essays/'+essay_id+'/storical');
}

checkVoto(course_name: string, task_id: number, essay_id: number) {
  return this.http.get<Essay>(this.API_PATH + 'courses/'+course_name+'/tasks/'+task_id+'/essays/'+essay_id);
}

pushSoluzione(course_name: string, task_id: number, essay_id: number,imageFile: File) {
  const data: FormData = new FormData();
  data.append('imageFile', imageFile);
  return this.http.put(this.API_PATH + 'courses/'+course_name+'/tasks/'+task_id+'/essays/'+essay_id , data, {
    reportProgress: true,
    responseType: 'text'
    });
}

elaboratoVotoFinale(course_name: string,task_id: number,essay_id: number,voto: number) {
  console.log(voto);
  return this.http.put(this.API_PATH + 'courses/'+course_name+'/tasks/'+task_id+'/essays/'+essay_id+'/valuta' ,voto, this.httpOptions);
}


/*img profilo*/
//studente
setImageProfileStudent(student_id: string,imageFile: File) {
  const data: FormData = new FormData();
  data.append('imageFile', imageFile);
  return this.http.put(this.API_PATH + 'students/'+student_id , data, {
    reportProgress: true,
    responseType: 'text'
    });
}
//professore
setImageProfileProf(prof_id: string,imageFile: File) {
  const data: FormData = new FormData();
  data.append('imageFile', imageFile);
  return this.http.put(this.API_PATH + 'professor/'+prof_id , data, {
    reportProgress: true,
    responseType: 'text'
    });
}
}