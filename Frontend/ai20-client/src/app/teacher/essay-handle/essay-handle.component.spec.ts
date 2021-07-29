import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayHandleComponent } from './essay-handle.component';

describe('EssayHandleComponent', () => {
  let component: EssayHandleComponent;
  let fixture: ComponentFixture<EssayHandleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayHandleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
