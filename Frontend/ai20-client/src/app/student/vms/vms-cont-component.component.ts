import { Component, ViewChild, EventEmitter ,ElementRef, OnInit, Output, Input, AfterViewInit } from '@angular/core';
import {MatTable} from '@angular/material/table';
import {Student} from 'src/app/student.model'
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import { Vm } from '../../vm.model';
import {MatDialogModule,MatDialog} from '@angular/material/dialog'; 
import {AddVmDialogComponent} from './add_vm/add-vm-dialog.component';
import {EditVmDialogComponent} from './edit_vm/edit-vm-dialog.component';

import { AuthService } from 'src/app/auth/auth.service';
import { StudentService } from 'src/app/service/student.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ShowVmDialogComponent } from './show_vm/show-vm-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EditOwnersComponent } from './edit-owners/edit-owners.component';
import { NotificationComponent } from 'src/app/notification/notification.component';

@Component({
  selector: 'app-vms-cont-component',
  templateUrl: './vms-cont-component.component.html',
  styleUrls: ['./vms-cont-component.component.css']
})
export class VmsContComponentComponent implements OnInit {
  inAteamObs: Observable<any>;
  studentID: string;
  coursename: string;
  teamId: number;
  dataSource: Vm[] = [];

  constructor(public dialog: MatDialog, private activatedRoute: ActivatedRoute, private studentService: StudentService, private authService: AuthService,private sanitizer: DomSanitizer) {
      this.dataSource= [];
            
   }


  ngOnInit(): void {

     this.studentID = this.authService.getUserId();
      this.activatedRoute.params.subscribe( p => {
      this.coursename = p['course_name'];

      this.inAteamObs = this.studentService.studentHasTeam(this.studentID, this.coursename);

      this.studentService.getStudentTeamByCourse(this.studentID, p['course_name']).subscribe( t =>  {
         this.teamId = t.id;
         
         this.getTeamVms(this.studentID, this.teamId);
      });
    });
    
  }


  

    @Input()
    actualVm: Vm = { id: null, vcpu: null, gbdisk: null, gbram: null, status: null,idCreatore: null, screenVm: null, isOwner:null};
    
      

    //ADD
    openDialogAdd(): void {
      const dialogRef = this.dialog.open(AddVmDialogComponent, {
        width: '300px',
        data: { studId: this.studentID, coursename: this.coursename, teamId: this.teamId }
    });
      dialogRef.afterClosed().subscribe( end => {
        this.getTeamVms(this.studentID, this.teamId);
      });
      
    }



    //EDIT
    openDialogEdit(vmId: number): void {
      let vmtoedit:Vm[] = this.dataSource.filter(e => e.id === vmId);
      console.log(vmtoedit);
      const dialogRef = this.dialog.open(EditVmDialogComponent, {
        width: '300px',
        data: { studId: this.studentID, coursename: this.coursename, teamId: this.teamId, vm: vmtoedit[0], vmId: vmId }
    });
      dialogRef.afterClosed().subscribe( 
        res => {
        this.getTeamVms(this.studentID, this.teamId);
      }
      );
      
    }

       //EDIT owners
       openDialogOwners(vmId: number): void {

        const dialogRef = this.dialog.open(EditOwnersComponent, {
          width: '600px',
          data: { teamId: this.teamId,vmId: vmId,studId: this.studentID }
      });
        dialogRef.afterClosed().subscribe( 
          res => {
          //this.getTeamVms(this.studentID, this.teamId);
        }
        );
        
      }


      //dialog notifiche
      
  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '250px',
      data: {
        text: msg
      }
    }); 
  }





    getTeamVms(stud_id: string, teamId: number): void {
      this.studentService.getStudentVMsByCourse(stud_id,teamId).subscribe( vms => {
        vms.forEach( vm => {
          let objectURL = 'data:image/png;base64,' + vm.screenVm;
          vm.screenVm = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          //console.log(vm.screenVm);
          this.studentService.isOwner(this.studentID,vm.id,this.teamId).subscribe (
            s => { vm.isOwner=s }
          )
        });
        this.dataSource = vms;

      });

    }


    changeVMstatus(vmId: number): void {
      this.studentService.changeStatusToVM(this.studentID, this.teamId, vmId).subscribe( end => {
        this.getTeamVms(this.studentID, this.teamId);
      },
      err => {
        this.openDialog_notification_confirm("Impossibile cambiare lo stato. Verificare i parametri della Vm");
        
      });
    }

    
    deleteVM(vmId: number): void {
      this.studentService.deleteVM(this.studentID, this.teamId, vmId).subscribe( end => {
        this.getTeamVms(this.studentID, this.teamId);
      });
    }
   

    connect(img: any): void {
      const dialogRef = this.dialog.open(ShowVmDialogComponent, {
        width: '500px',
        height: '500px',
        data: { img: img }
    });
      dialogRef.afterClosed();
    }




}