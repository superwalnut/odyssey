import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancehistoryComponent } from './attendancehistory.component';

describe('AttendancehistoryComponent', () => {
  let component: AttendancehistoryComponent;
  let fixture: ComponentFixture<AttendancehistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendancehistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
