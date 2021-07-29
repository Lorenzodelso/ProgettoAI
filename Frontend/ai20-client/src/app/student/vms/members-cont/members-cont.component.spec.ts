import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersContComponent } from './members-cont.component';

describe('MembersContComponent', () => {
  let component: MembersContComponent;
  let fixture: ComponentFixture<MembersContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
