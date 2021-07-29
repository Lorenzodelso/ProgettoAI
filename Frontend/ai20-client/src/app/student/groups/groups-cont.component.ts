import { Component, ViewChild, EventEmitter ,ElementRef, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import {Student} from 'src/app/student.model'
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {FormControl, Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {from, Observable} from 'rxjs';
import {catchError, concatMap, map, startWith} from 'rxjs/operators';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'; 
import {MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { group } from '@angular/animations';
import {MatExpansionModule,MatAccordion} from '@angular/material/expansion'; 
import {MatButtonModule} from '@angular/material/button'; 
import {StudentService} from 'src/app/service/student.service';
import { ActivatedRoute } from '@angular/router';
import {Team} from 'src/app/team.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Token } from 'src/app/token.model';
import { StudentRequest } from 'src/app/student-request.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/notification/notification.component';
import { LoadingDialogComponent } from 'src/app/notification/loading-dialog.component';



@Component({
  selector: 'app-groups-cont',
  templateUrl: './groups-cont.component.html',
  styleUrls: ['./groups-cont.component.css']
})
export class GroupsContComponent implements OnInit {
  
  GroupPresent: boolean;    //selezionatore della vista opportuna
  //course_id: string;
  course_name: string;
  inAteamObs: Observable<any>;
  studentID: string;
  group: Student[];
  currentTeam: Team;
  team_id: number;
  team_name: string;
  nogroup:boolean;
  req: StudentRequest;
  reqMyTeam: StudentRequest;

  requestMap: Map<Token, Student[]> = new Map<Token, Student[]>();
  tokenMap: Map<Token, StudentRequest[]> = new Map<Token, StudentRequest[]>();

  myRequestMap: Map<String,StudentRequest[]> = new Map<String,StudentRequest[]>();

  @ViewChild('table') table: MatTable<Element>;
  form: FormGroup;
  newGroupName = new FormControl('', [Validators.required]);
  timeoutRequest = new FormControl('', [Validators.required]);


  @Input()
  actualUser: Student = { id: '', serial:'', name: '', firstName: '', courseId: '', groupId:'', photoStudent:''};

  
  constructor(private fb: FormBuilder, private dialog: MatDialog,private studentService: StudentService, private activatedRoute: ActivatedRoute, private authService: AuthService) {
    this.currentTeam = null;
    this.nogroup=false;
    this.inizializza_form();
   }



  ngOnInit(): void {
    this.tokenMap.clear();
    this.requestMap.clear();
    this.team_name=null;
    this.team_id=null;
    this.currentTeam=null;
    this.activatedRoute.params.subscribe( p => {
      //this.course_id = p['id'];
      this.course_name = p['course_name'];
      this.studentID = this.authService.getUserId();

      
      this.inAteamObs = this.studentService.studentHasTeam(this.studentID, this.course_name);
      this.studentService.getStudentTeamByCourse(this.studentID, this.course_name).subscribe(
        res => {
          if(res!==null) {
            //false - cerco componenti gruppo

            // console.log(res);
            this.team_id = res.id; 
            this.team_name = res.name;  
            this.studentService.getTeamMembers(this.team_id).subscribe(
              s => {
                this.group = s;
              });

          }else
        {     //true - cerco persone libere


            
            this.studentService.getNoTeamStudents(this.course_name).subscribe(
              s => {
                this.freeStudents = s;
              } 
            );
              //check se ho richieste di partecipazione a qualche team
            this.studentService.getTeamRequests(this.studentID, this.course_name).subscribe(
              tkn => {
                if(Object.keys(tkn).length !== 0){
                  //Se ho dei token presenti, per ognuno prendo la richiesta e mostro tokenMap ( Token , Studenti)
                  
                  from(tkn).forEach( (t: Token) => {
                    
                    // console.log('FOR EACH');
                    
                    this.studentService.getMembersPerRequest(this.course_name,this.studentID,t.teamId).subscribe(
                      s => {
                        this.req = s;
                        this.tokenMap.set(t,s);
                      });
                  });
                  
                }else{
                  console.log('niente token');
                }
              },
              err => {
                console.log('nessuna richiesta gruppo!');
              }
            );

            //check se ho creato già un team
          this.studentService.getMyRequestsAsCreator(this.studentID,this.course_name).subscribe(
            teams => { 
              if(Object.keys(teams).length !== 0){
                //Se ho dei token presenti, per ognuno prendo la richiesta e mostro tokenMap ( Token , Studenti)
                
                from(teams).forEach( (t: Team) => {
                  this.studentService.getMembersPerRequest(this.course_name,this.studentID,t.id).subscribe(
                    s => {
                      this.myRequestMap.set(t.name,s);
                    });

            });}},
            err => {
              console.log('nessun gruppo creato!');
            }
          );
          //fine check se ho creato gia un team
            


          }



        }
      )
      
      
     
      
    });
    
    

  }



//parte tabella per registrazione gruppo

selection = new SelectionModel<Student>(true, []);

freeStudents: Student[] = [];


/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.freeStudents.length;
  return numSelected == numRows;
}

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.freeStudents.forEach(row => this.selection.select(row));
}

studentColumns: string[] = ['select','id', 'serial', 'name', 'firstName' ];



sendTeamRequest() {     
  const val = this.form.value;
  if(!this.form.invalid) {
    let membersList: string[] = [];
    membersList.push(this.studentID);
    this.selection.selected.forEach(item => membersList.push(item.id));
    console.log(val.newGroupName);
    console.log(val.timeoutRequest);
    console.log(membersList);
    this.openDialog_loading("Invio della richiesta in corso...Rimani in attesa.");
    this.studentService.proposeTeamRequest(this.course_name, membersList, val.newGroupName, val.timeoutRequest).subscribe(
      res => {
      this.dialog.closeAll();
      this.openDialog_notification_confirm("La proposta per il team "+val.newGroupName+" è stata creata con successo! La durata è di "+val.timeoutRequest+" ore!");
      this.ngOnInit(); 
    },
      err => {
        this.dialog.closeAll();
        this.openDialog_notification_confirm("Si è verificato un errore !")
      })
  }
  this.selection = new SelectionModel<Student>(true, []);
  
}


accept(tok :string,teamId: string) {
  this.openDialog_loading("Rimani in attesa.");
  this.studentService.acceptRequest(tok).subscribe( 
    s=>
     {
       this.dialog.closeAll();
      this.openDialog_notification_confirm("La proposta per il team "+teamId+" è stata accettata!");
      //aggiornare il component
      this.ngOnInit();
     },
     err => {
       this.dialog.closeAll();
     this.openDialog_notification_confirm("Impossibile accettare la richiesta..."); }
     );
}

reject(tok :string,teamId: string) {
  this.openDialog_loading("Rimani in attesa.");
  this.studentService.rejectRequest(tok).subscribe(
     s=>
    {
      this.dialog.closeAll();
      this.openDialog_notification_confirm("La proposta per il team "+teamId+" è stata rifiutata!");
            //aggiornare il component
      this.ngOnInit();

     },
     err =>{
      this.dialog.closeAll();
      this.openDialog_notification_confirm("Si è verificato un errore..."); 
     }
     );
}




groupColumns: string[] = ['select','name', 'firstName'];



getMembers(teamId:number): void {
  this.studentService.getTeamMembers(teamId)
  .subscribe( s => {
    console.log('getMermbers()');
    console.log(s);
    this.group = s
  });
}




toArray(answers: object) {
  return Object.keys(answers).map(key => answers[key]);
}


inizializza_form(){
  this.form = this.fb.group({
    newGroupName: ['', Validators.required],
    timeoutRequest: ['', Validators.required]
  });
}

openDialog_notification_confirm(msg: string): void {
  const dialogRef = this.dialog.open(NotificationComponent, {
    width: '400px',
    height: '250px',
    data: {
      text: msg
    }
}); }


openDialog_loading(msg: string): void {
  const dialogRef = this.dialog.open(LoadingDialogComponent, {
    disableClose: true,
    width: '350px',
    height: '400px',
    data: {
      text: msg
    }
}); }


}
