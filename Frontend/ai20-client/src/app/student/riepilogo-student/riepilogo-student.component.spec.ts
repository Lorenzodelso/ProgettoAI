import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiepilogoStudentComponent } from './riepilogo-student.component';

describe('RiepilogoStudentComponent', () => {
  let component: RiepilogoStudentComponent;
  let fixture: ComponentFixture<RiepilogoStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiepilogoStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiepilogoStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
