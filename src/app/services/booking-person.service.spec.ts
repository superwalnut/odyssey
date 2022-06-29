import { TestBed } from '@angular/core/testing';

import { BookingPersonService } from './booking-person.service';

describe('BookingPersonService', () => {
  let service: BookingPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
