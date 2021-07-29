import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiepilogoTeacherComponent } from './riepilogo-teacher.component';

describe('RiepilogoTeacherComponent', () => {
  let component: RiepilogoTeacherComponent;
  let fixture: ComponentFixture<RiepilogoTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiepilogoTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiepilogoTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
