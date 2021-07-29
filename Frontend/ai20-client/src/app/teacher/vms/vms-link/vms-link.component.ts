import { Component,Inject, OnInit } from '@angular/core';
import { Team } from '../../../team.model';
import { Vm } from '../../../vm.model';
import { TeacherService } from 'src/app/service/teacher.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-vms-link',
  templateUrl: './vms-link.component.html',
  styleUrls: ['./vms-link.component.css']
})
export class VmsLinkComponent implements OnInit {
  vm: Vm = this.data.vm;
  course_name: string = this.data.course_name;
  team: Team = this.data.team;


    constructor(private sanitizer: DomSanitizer,private teacherService: TeacherService,@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog) {}

    ngOnInit(): void {} 


  toArray(answers: object) {
    return Object.keys(answers).map(key => answers[key])
  }



      

    

}
