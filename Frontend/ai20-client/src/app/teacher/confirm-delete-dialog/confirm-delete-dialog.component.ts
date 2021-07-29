import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.css']
})
export class ConfirmDeleteDialogComponent implements OnInit {
  data: string = this.data_r.text;

  constructor(@Inject(MAT_DIALOG_DATA) public data_r: any,public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>) { }

  ngOnInit(): void {
  }

  confirm_delete() {
    this.dialogRef.close("delete");
  }

}
