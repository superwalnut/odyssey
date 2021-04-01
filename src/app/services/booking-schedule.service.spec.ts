import { TestBed } from '@angular/core/testing';

import { BookingScheduleService } from './booking-schedule.service';

describe('BookingScheduleService', () => {
  let service: BookingScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
