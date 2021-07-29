import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-vm-dialog',
  templateUrl: './show-vm-dialog.component.html',
  styleUrls: ['./show-vm-dialog.component.css']
})
export class ShowVmDialogComponent implements OnInit {

  img: any;

  constructor(public dialogRef: MatDialogRef<ShowVmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.img = this.data.img;
  }

}
