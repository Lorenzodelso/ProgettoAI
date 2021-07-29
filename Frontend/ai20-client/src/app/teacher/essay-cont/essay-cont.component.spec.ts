import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayContComponent } from './essay-cont.component';

describe('EssayContComponent', () => {
  let component: EssayContComponent;
  let fixture: ComponentFixture<EssayContComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayContComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayContComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
