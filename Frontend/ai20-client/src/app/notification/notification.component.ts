import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
data: string = this.data_r.text;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data_r: any
 ) { }

  ngOnInit(): void {
  }

}
