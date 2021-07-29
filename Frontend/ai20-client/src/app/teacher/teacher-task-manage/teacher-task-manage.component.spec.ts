import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTaskManageComponent } from './teacher-task-manage.component';

describe('TeacherTaskManageComponent', () => {
  let component: TeacherTaskManageComponent;
  let fixture: ComponentFixture<TeacherTaskManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherTaskManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherTaskManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
