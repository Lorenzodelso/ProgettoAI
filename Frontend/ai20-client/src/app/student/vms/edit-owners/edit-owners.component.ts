
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { StudentService } from 'src/app/service/student.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Vm } from 'src/app/vm.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from 'src/app/student.model';
import { NotificationComponent } from 'src/app/notification/notification.component';

@Component({
  selector: 'app-edit-owners',
  templateUrl: './edit-owners.component.html',
  styleUrls: ['./edit-owners.component.css']
})
export class EditOwnersComponent implements OnInit {


  teamId: number;
  vmId: number;
  members: any;
  studId: string;



  constructor(private fb: FormBuilder,private dialog: MatDialog, private studentService : StudentService, private authService: AuthService, 
    public dialogRef: MatDialogRef<EditOwnersComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
      

      this.teamId = data.teamId;
      this.vmId = data.vmId;
      this.studId = data.studId; 

      
     }



  ngOnInit(): void {
    this.getTeamMembers();
  }

  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '250px',
      data: {
        text: msg
      }
  }); }

getTeamMembers(): void {
  console.log(this.teamId);
  console.log(this.vmId);
  this.studentService.getTeamMembers(this.teamId).subscribe(
    s=> { this.members=s;
   console.log(this.members); } )
}


  edit_Owners(students: Student[]): void { 
    let ids: string[] = [];
    students.forEach ( stud => {
       if(stud.id!=this.studId)
        ids.push(stud.id); } )
    console.log(ids);
    this.studentService.addOwners(ids,this.studId,this.teamId,this.vmId).subscribe(
      s=> {
        this.openDialog_notification_confirm("Lista owners della VM aggiornata con successo!");
        this.dialogRef.close();
    }
        ,
       err =>
        console.log('errore edit_Owners')
    )


  } 




}
