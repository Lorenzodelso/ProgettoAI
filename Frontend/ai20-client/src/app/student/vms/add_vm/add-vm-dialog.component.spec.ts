import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVmDialogComponent } from './add-vm-dialog.component';

describe('AddVmDialogComponent', () => {
  let component: AddVmDialogComponent;
  let fixture: ComponentFixture<AddVmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
