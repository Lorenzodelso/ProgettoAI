import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsContComponent } from './groups-cont.component';

describe('GroupsContComponent', () => {
  let component: GroupsContComponent;
  let fixture: ComponentFixture<GroupsContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
