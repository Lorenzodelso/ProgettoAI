import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.css']
})
export class LoadingDialogComponent implements OnInit {
  data: string = this.data_r.text;

  constructor(@Inject(MAT_DIALOG_DATA) public data_r: any) { }

  ngOnInit(): void {
  }

}
