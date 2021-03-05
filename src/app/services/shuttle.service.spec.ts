import { TestBed } from '@angular/core/testing';

import { ShuttleService } from './shuttle.service';

describe('ShuttleService', () => {
  let service: ShuttleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShuttleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
