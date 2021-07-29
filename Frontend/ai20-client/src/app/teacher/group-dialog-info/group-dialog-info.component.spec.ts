import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDialogInfoComponent } from './group-dialog-info.component';

describe('GroupDialogInfoComponent', () => {
  let component: GroupDialogInfoComponent;
  let fixture: ComponentFixture<GroupDialogInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDialogInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDialogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
