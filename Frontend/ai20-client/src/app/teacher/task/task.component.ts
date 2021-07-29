import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherService } from 'src/app/service/teacher.service';
import { Task} from '../../task.model';
import { Essay} from '../../essay.model';
import { Student} from '../../student.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  course_name: string;
  tasks: Task[];

  //essay_per_task  : Map<Task, Essay[]> = new Map<Task, Essay[]>();


  constructor(private sanitizer: DomSanitizer,private teacherService: TeacherService,private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
      this.activatedRoute.params.subscribe(p => {
        this.course_name = p['course_name'];
        } )
        this.getTasks();
  } 
 


  getTasks(): void {
    this.teacherService.getTaskByCourse(this.course_name)
        .subscribe( s => {
          console.log(s);
          s.forEach(x => { 
           //sanitize immagine, la salvo "pulita" cosi poi devo solo visualizzarla senza fare altro
            let objectURL = 'data:image/png;base64,' + x.description;
            x.description = this.sanitizer.bypassSecurityTrustUrl(objectURL);

          })
          this.tasks=s;

          //old
          //prendo gli essays per ogni task
         // this.getEssaysByTask(this.tasks); 
        });

  }


  /*
    //old
  getEssaysByTask(tasks: Task[]): void {
    this.tasks.forEach(task => { 
      this.teacherService.getEssays(this.course_name,task.id)
      .subscribe( essay => {
        essay.forEach(es => {
          if(es.stato==null) es.stato="Non ancora letto";
        });
        this.essay_per_task.set(task,essay); 
        console.log(this.essay_per_task)});
    
    } );

}  */

}
