import {Component, Inject, OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Team} from '../../team.model';
import { TeacherService } from 'src/app/service/teacher.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NotificationComponent } from 'src/app/notification/notification.component';

@Component({
  selector: 'app-group-dialog-info',
  templateUrl: './group-dialog-info.component.html',
  styleUrls: ['./group-dialog-info.component.css']
})
export class GroupDialogInfoComponent implements OnInit {

  team: Team = this.data.team_selected;
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialog: MatDialog,private fb: FormBuilder,public dialogRef: MatDialogRef<GroupDialogInfoComponent>,private teacherService:TeacherService) { 


    this.team = data.team_selected;
    let status: string;
    if(this.team.status==1) status="ATTIVO";
    else status="NON ATTIVO";



    this.form = this.fb.group({
      gbramtotali: [ this.team.gbramTot , Validators.min(1)],
      gbramusati: [  this.team.gbramUsati ],
      gbdiskusati: [ this.team.gbdiskUsati ],
      gbdisktotali: [ this.team.gbdiskTot , Validators.min(1)],
      vmaccese: [ this.team.vmAccese],
      maxvmaccese: [ this.team.maxVmAccese ],
      status: [ status],
      vcputotali: [ this.team.vcpuTot],
      vcpuusate: [ this.team.vcpuUsati]
    });
  }

  ngOnInit(): void {}

  onSubmit() {

    this.teacherService.changeLimitVmGroup(this.vcpuTot,this.gbDiskTot,this.gbRamTot,this.maxVmAccese,this.data.course,this.data.team_selected.id)
    .subscribe(s => {
      this.openDialog_notification_confirm("Limiti aggiornati.");
      this.dialogRef.close("refresh");
    },
               err => {
                 this.openDialog_notification_confirm("Impossibile completare l'operazione");
                 this.dialogRef.close("err");

                } ) 

  }

  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '250px',
      data: {
        text: msg
      }
  }); }


  get gbRamTot() { return this.form.get('gbramtotali').value; }
  get gbRamUsati() { return this.form.get('gbramusati').value; }
  get gbDiskTot() { return this.form.get('gbdisktotali').value; }
  get gbDiskUsati() { return this.form.get('gbdiskusati').value; }
  get vmAccese() { return this.form.get('vmaccese').value; }
  get maxVmAccese() { return this.form.get('maxvmaccese').value; }
  get status() { return this.form.get('status').value; }
  get vcpuTot() { return this.form.get('vcputotali').value; }
  get vcpuUsate() { return this.form.get('vcpuusate').value; }


}
