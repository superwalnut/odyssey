import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingdetailsComponent } from './bookingdetails.component';

describe('BookingdetailsComponent', () => {
  let component: BookingdetailsComponent;
  let fixture: ComponentFixture<BookingdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
