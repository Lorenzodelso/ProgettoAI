import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVmDialogComponent } from './show-vm-dialog.component';

describe('ShowVmDialogComponent', () => {
  let component: ShowVmDialogComponent;
  let fixture: ComponentFixture<ShowVmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowVmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowVmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
