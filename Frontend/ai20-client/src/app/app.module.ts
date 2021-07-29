import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list'; 
import {MatTabsModule, MatTabLink} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatInputModule} from '@angular/material/input'; 
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSortModule} from '@angular/material/sort'; 
import {MatPaginatorModule} from '@angular/material/paginator'; 
import { StudentsComponent } from './teacher/students/students.component';
import { StudentsContComponent } from './teacher/students/students-cont.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponentComponent } from './page-not-found-component.component';
import { VmsContComponentComponent } from './student/vms/vms-cont-component.component';
import { HttpClientModule }    from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/authInterceptor';
import { GroupsContComponent } from './student/groups/groups-cont.component';
import {MatExpansionModule,MatAccordion} from '@angular/material/expansion';
import { MenuTeacherComponent } from './teacher/menu-teacher/menu-teacher.component';
import { NewCourseComponent } from './teacher/new-course/new-course.component';
import { VmsComponent } from './teacher/vms/vms.component';
import { TeacherContComponent } from './teacher/teacher-cont/teacher-cont.component';
import {GetValuesPipe} from './teacher/vms/get-values.pipe';
import { GroupDialogInfoComponent } from './teacher/group-dialog-info/group-dialog-info.component';																   
import {MatCardModule} from '@angular/material/card';
import { AddVmDialogComponent } from './student/vms/add_vm/add-vm-dialog.component';
import { TaskContComponent } from './student/tasks/task-cont.component';
import { HomeComponent } from './home/home.component';
import { EditVmDialogComponent } from './student/vms/edit_vm/edit-vm-dialog.component';
import { ShowVmDialogComponent } from './student/vms/show_vm/show-vm-dialog.component';
import { TaskComponent } from './teacher/task/task.component';
import { UpdateCourseComponent } from './teacher/update-course/update-course.component';
import { NewTaskComponent } from './teacher/new-task/new-task.component';
import { NewTask2Component } from './teacher/new-task2/new-task2.component';
import { EssayContComponent } from './teacher/essay-cont/essay-cont.component';
import {MatSelectModule} from '@angular/material/select';
import { EssayHandleComponent } from './teacher/essay-handle/essay-handle.component';
import { ProfileComponent } from './profile/profile.component';
import { VmsLinkComponent } from './teacher/vms/vms-link/vms-link.component';
import {MatRadioModule} from '@angular/material/radio';
import { NotificationComponent } from './notification/notification.component';
import { RegistrationDialogComponent } from './auth/registration-dialog/registration-dialog.component';
import { MenuStudentComponent } from './student/menu-student/menu-student.component';
import { EditOwnersComponent } from './student/vms/edit-owners/edit-owners.component';
import { MembersContComponent } from './student/vms/members-cont/members-cont.component';
import {MatDatepickerModule,} from '@angular/material/datepicker';
import { LoadingDialogComponent } from './notification/loading-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ConfirmDeleteDialogComponent } from './teacher/confirm-delete-dialog/confirm-delete-dialog.component';
import { TeacherTaskComponent } from './teacher/teacher-task/teacher-task.component';
import { TeacherTaskManageComponent } from './teacher/teacher-task-manage/teacher-task-manage.component';
import { RiepilogoTeacherComponent } from './teacher/riepilogo-teacher/riepilogo-teacher.component';
import { RiepilogoStudentComponent } from './student/riepilogo-student/riepilogo-student.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentsContComponent,
    StudentsComponent,
    PageNotFoundComponentComponent,
    VmsContComponentComponent,
    LoginDialogComponent,
    GroupsContComponent,
    AddVmDialogComponent,
    TaskContComponent,
    HomeComponent,
    EditVmDialogComponent,
    ShowVmDialogComponent,
    RegistrationDialogComponent,
    MenuTeacherComponent,
    NewCourseComponent,
    VmsComponent,
    TeacherContComponent,
    GetValuesPipe,
    GroupDialogInfoComponent,
    TaskComponent,
    UpdateCourseComponent,
    NewTaskComponent,
    NewTask2Component,
    EssayContComponent,
    EssayHandleComponent,
    ProfileComponent,
    VmsLinkComponent,
    RegistrationDialogComponent,
    NotificationComponent,
    MenuStudentComponent,
    EditOwnersComponent,
    MembersContComponent,
    LoadingDialogComponent,
    ConfirmDeleteDialogComponent,
    TeacherTaskComponent,
    TeacherTaskManageComponent,
    RiepilogoTeacherComponent,
    RiepilogoStudentComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSortModule,
    MatPaginatorModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatExpansionModule,
    MatCardModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true} ],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginDialogComponent
  ]
})
export class AppModule { }

