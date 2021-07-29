import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTask2Component } from './new-task2.component';

describe('NewTask2Component', () => {
  let component: NewTask2Component;
  let fixture: ComponentFixture<NewTask2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTask2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTask2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
