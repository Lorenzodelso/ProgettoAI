import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import { Essay } from 'src/app/essay.model';
import { Image } from 'src/app/image.model';

import { TeacherService } from 'src/app/service/teacher.service';
import { DomSanitizer } from '@angular/platform-browser';
import {FormControl, FormGroup} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/notification/notification.component';


@Component({
  selector: 'app-essay-handle',
  templateUrl: './essay-handle.component.html',
  styleUrls: ['./essay-handle.component.css']
})
export class EssayHandleComponent implements OnInit {
  toArray(answers: object) {
    return Object.keys(answers).map(key => answers[key])
  }

  /*form per caricamento solizione */
form: FormGroup;
/*form per voto finale*/
form_voto_finale: FormGroup;
disableVotoFinale =  false;
show_gia_valutato = true;

/*roba per far funzionare l'upload dell immagine */
selectedFiles: FileList;
currentFileUpload: File;
selectedFile = null;
changeImage = false;
/*fine roba*/

  constructor(private router: Router,private dialog: MatDialog,private fb: FormBuilder,private sanitizer: DomSanitizer,private activatedRoute: ActivatedRoute,private teacherService: TeacherService) { }
  course_name: string;
  task_id:number;
  essay_id: number;
  //storical Essay: array di image, storico di un elaborato
  storical_essay: Image[];


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(p => {
      this.course_name = p['course_name'];
      this.task_id = p['task_id'];
      this.essay_id = p['essay_id'];
         /*inizializzo form per solizione*/
   this.inizializza_form_soluzione();
   this.inizializza_form_votofinale("no_flag");
   this.checkVoto();

      this.getEssayStorical(this.essay_id,this.task_id);
      } )
  }

/*roba per img */

inizializza_form_soluzione() {
  this.form = new FormGroup({
    'testo': new FormControl(),
  });
}


inizializza_form_votofinale(check_voto) {
  if(check_voto=="no_flag") //prima inizializazzione
  {
    this.form_voto_finale = new FormGroup({
    'voto_finale': new FormControl(),
    'gia_valutato': new FormControl({value:'GIA VALUTATO!',disabled: true})
  });
  this.show_gia_valutato = false;
  }

else if(check_voto==true)//è gia stato valutato, disabilito la select
 {
   this.disableVotoFinale =  true;
   this.show_gia_valutato = true;
 } }

 //funzioni per upload immagine ( soluzione )
change($event) {
  this.changeImage = true;
}
changedImage(event) {
  this.selectedFile = event.target.files[0];
}

onSubmit() {
this.currentFileUpload = this.selectedFiles.item(0);
this.pushSoluzione(this.course_name,this.task_id,this.essay_id,this.currentFileUpload); 
}

 selectFile(event) {
  this.selectedFiles = event.target.files;
}
/*fine funzioni per img*/


  getEssayStorical(essay_id: number, task_id: number): void {
    this.teacherService.getEssay_storical(this.course_name,task_id,essay_id)
    .subscribe ( s_essay=> {

      //sistemo l'immagine dei vari stati dell'essay per il download
       s_essay.forEach(essay=> { 
      let objectURL = 'data:image/png;base64,' + essay.data;
      essay.data = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })

       this.storical_essay=s_essay;
    });
    }

    pushSoluzione(course_name,task_id,essay_id,imageFile) : void {
      this.teacherService.pushSoluzione(this.course_name,this.task_id,this.essay_id,imageFile)
      .subscribe( s => {
        console.log(s);
        this.openDialog_notification_confirm("Correzione inserita!");
        this.router.navigate(['teacher/courses/'+this.course_name+'/task']); },
        err => this.openDialog_notification_confirm("Si è verificato un errore!")
        );
    }



    checkVoto()  {
      this.teacherService.checkVoto(this.course_name,this.task_id,this.essay_id)
      .subscribe( s => { 
        console.log(s);
      if (s.voto==null) //non c'è voto 
        this.inizializza_form_votofinale(false); 
      else 
        this.inizializza_form_votofinale(true);
    } ); }

  


    onSubmit_votofinale() {
      console.log(this.course_name);
      console.log(this.task_id);
      console.log(this.essay_id);
      console.log(this.voto_finale);
      this.teacherService.elaboratoVotoFinale(this.course_name,this.task_id,this.essay_id,this.voto_finale)
      .subscribe(s=> {
        this.openDialog_notification_confirm("Voto inserito!");
        this.router.navigate(['teacher/courses/'+this.course_name+'/task']); 
          },
          err => this.openDialog_notification_confirm("Si è verificato un errore!")
          );
      }

      get voto_finale() { 
        return this.form_voto_finale.get('voto_finale').value;
      }

      
  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
    height: '250px',
      data: {
        text: msg
      }
  }); }
}
