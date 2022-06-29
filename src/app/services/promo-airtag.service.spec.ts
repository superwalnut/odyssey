import { TestBed } from '@angular/core/testing';

import { PromoAirtagService } from './promo-airtag.service';

describe('PromoAirtagService', () => {
  let service: PromoAirtagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromoAirtagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
