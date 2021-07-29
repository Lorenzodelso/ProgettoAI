import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VmsLinkComponent } from './vms-link.component';

describe('VmsLinkComponent', () => {
  let component: VmsLinkComponent;
  let fixture: ComponentFixture<VmsLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VmsLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VmsLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
