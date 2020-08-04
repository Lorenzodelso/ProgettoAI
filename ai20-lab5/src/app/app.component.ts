import { Component, ViewChild, ElementRef, OnInit, Output, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SelectControlValueAccessor } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import {Student} from 'src/app/student.model'
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel, DataSource} from '@angular/cdk/collections';
import {FormControl} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { strict } from 'assert';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete'; 
import {MatTable} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LoginDialogComponent } from './auth/login-dialog.component';
import { AuthService } from './auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit, OnDestroy{
  
  title = 'ai20-lab05';
  routeQueryParams$: Subscription;

  @ViewChild('sidenav') sidenav: MatSidenav;

constructor(public dialog: MatDialog, public authService: AuthService, private router: Router, private route: ActivatedRoute) {
  this.routeQueryParams$ = route.queryParams.subscribe(params => {
    if (params['doLogin']) {
      this.openDialog();
    }
  });
}

  ngOnInit() {
    this.authService.logout();
  }

  toggleForMenuClick() {
    this.sidenav.toggle();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '250px'  
  });
    dialogRef.afterClosed().subscribe( end => {
      this.router.navigateByUrl('home');
    });
    
  }


  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/home');
  }

  ngOnDestroy() {
    this.routeQueryParams$.unsubscribe();
  }
}