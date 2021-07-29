import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { StudentService } from 'src/app/service/student.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Vm } from 'src/app/vm.model';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationComponent } from 'src/app/notification/notification.component';

@Component({
  selector: 'app-edit-vm-dialog',
  templateUrl: './edit-vm-dialog.component.html',
  styleUrls: ['./edit-vm-dialog.component.css']
})
export class EditVmDialogComponent implements OnInit {

  form: FormGroup;
  vcpu = new FormControl();
  gbdisk = new FormControl();
  gbram = new FormControl();
  studId: string;
  coursename: string;
  teamId: number;
  vm: any;
  vmId: number;



  constructor(private fb: FormBuilder,private dialog: MatDialog, private studentService : StudentService, private authService: AuthService, 
    public dialogRef: MatDialogRef<EditVmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.studId = data.studId;
      this.coursename = data.coursename;
      this.teamId = data.teamId;
      this.vm = data.vm;
      this.vmId = data.vmId; 

      this.form = this.fb.group({
        vcpu: [ this.vm.vcpu , Validators.min(1)],
        gbdisk: [ this.vm.gbdisk ,  Validators.min(1)],
        gbram: [ this.vm.gbram ,  Validators.min(1)]
      });
      
     }



  ngOnInit(): void {
  }

  openDialog_notification_confirm(msg: string): void {
    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '400px',
      height: '250px',
      data: {
        text: msg
      }
  }); }



  getErrorvcpuMessage() {
    if(this.vcpu.hasError('required')){
      return 'vcpu value required';
    }
    if(this.vcpu.hasError('min')){
      return 'error';
    }
}

  getErrorgbdiskMessage(){
    if(this.gbdisk.hasError('required')){
      return 'gbdisk value required';
    }
    if(this.gbdisk.hasError('min')){
      return 'error';
    }
  }


  getErrorgbramMessage(){
    if(this.gbram.hasError('required')){
      return 'gbram value required';
    }
    if(this.gbram.hasError('min')){
      return 'error';
    }
  }



  modifyVM(): void {         
    const val = this.form.value;
        
    if(!this.form.invalid) {
      
      let vmtoAdd: Vm = val;
      
      this.studentService.changeVmParameters(this.studId, this.teamId, this.vmId, vmtoAdd).subscribe(
        ok => {
          this.openDialog_notification_confirm("Operazione eseguita con successo!");
          this.dialogRef.close();
        },
        err => {
          this.openDialog_notification_confirm("Si è verificato un errore...");

        }
      );
    }
  }




}
