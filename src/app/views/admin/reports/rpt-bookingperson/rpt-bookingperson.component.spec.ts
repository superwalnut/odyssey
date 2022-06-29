import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptBookingpersonComponent } from './rpt-bookingperson.component';

describe('RptBookingpersonComponent', () => {
  let component: RptBookingpersonComponent;
  let fixture: ComponentFixture<RptBookingpersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptBookingpersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptBookingpersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
