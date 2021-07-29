import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTeacherComponent } from './menu-teacher.component';

describe('MenuTeacherComponent', () => {
  let component: MenuTeacherComponent;
  let fixture: ComponentFixture<MenuTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
