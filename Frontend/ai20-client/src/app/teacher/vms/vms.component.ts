import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { Team } from '../../team.model';
import { Vm } from '../../vm.model';
import { TeacherService } from 'src/app/service/teacher.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GroupDialogInfoComponent } from '../group-dialog-info/group-dialog-info.component';
import { DomSanitizer } from '@angular/platform-browser';
import { VmsLinkComponent } from './vms-link/vms-link.component';



@Component({
  selector: 'app-vms',
  templateUrl: './vms.component.html',
  styleUrls: ['./vms.component.css']
})
export class VmsComponent implements OnInit {
  id_course:string;
  course_name: string;
  teams: Team[];
  vms_per_team  : Map<Team, Vm[]> = new Map<Team, Vm[]>();


    constructor(private sanitizer: DomSanitizer,private teacherService: TeacherService,private activatedRoute: ActivatedRoute,public dialog: MatDialog) {
     }
  
    ngOnInit(): void {
      this.activatedRoute.params.subscribe(p => {
        this.course_name = p['course_name'];
        } )
        this.getTeams();
  } 
  toArray(answers: object) {
    return Object.keys(answers).map(key => answers[key])
  }
  getTeams(): void {
    this.teacherService.getTeamsByCourse(this.course_name)
        .subscribe( s => {
          this.teams=[];
          this.teams = s;
          this.getVMSforEachGroup(); 
        });
  }

  getVMSforEachGroup(): void {
    //pulisco prima
    let vms: Vm[] = [];
    this.vms_per_team.clear(); 

    this.teams.forEach(team => { 
      this.teacherService.getVMS(this.course_name,team.id)
      .subscribe( s => {
        vms=s;
        //sanitize dello screenVm
        vms.forEach(vm=> {
          let objectURL = 'data:image/png;base64,' + vm.screenVm;
          vm.screenVm = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        })
        //fine sanitize
        this.vms_per_team.set(team,vms); 
      console.log(this.vms_per_team)} );
    
    } );


      } 
    
    openDialogGroup(team: Team): void {
        const dialogRef = this.dialog.open(GroupDialogInfoComponent, {
          width: '30%' ,
          height: '90%',
          data: { team_selected: team , course: this.course_name }
      });
        dialogRef.afterClosed().subscribe( end => {
          if(end=="ok") {
            //
          }
          if(end=="err") {
            //
          }
          if(end=="refresh") {
            this.getTeams(); //riprendo i team per caricare la nuova configurazione
          }
        });
        
      }

      openVm(vm: Vm,team: Team): void {
        const dialogRef = this.dialog.open(VmsLinkComponent, {
          width: '500px' ,
          data: { vm: vm , course: this.course_name,team: team }
      });
        dialogRef.afterClosed().subscribe( end => {
          if(end=="ok") console.log("ok")
          
        });
        
      }
    



}
  
