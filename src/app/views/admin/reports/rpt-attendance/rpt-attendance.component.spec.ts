import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptAttendanceComponent } from './rpt-attendance.component';

describe('RptAttendanceComponent', () => {
  let component: RptAttendanceComponent;
  let fixture: ComponentFixture<RptAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
