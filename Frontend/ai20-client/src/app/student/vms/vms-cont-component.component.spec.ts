import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmsContComponentComponent } from './vms-cont-component.component';

describe('VmsContComponentComponent', () => {
  let component: VmsContComponentComponent;
  let fixture: ComponentFixture<VmsContComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmsContComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmsContComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
