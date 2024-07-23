import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingRedirectComponent } from './booking-redirect.component';

describe('BookingRedirectComponent', () => {
  let component: BookingRedirectComponent;
  let fixture: ComponentFixture<BookingRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
