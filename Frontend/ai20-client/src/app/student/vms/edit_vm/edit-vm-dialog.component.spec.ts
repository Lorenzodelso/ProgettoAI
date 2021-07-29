import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVmDialogComponent } from './edit-vm-dialog.component';

describe('EditVmDialogComponent', () => {
  let component: EditVmDialogComponent;
  let fixture: ComponentFixture<EditVmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
