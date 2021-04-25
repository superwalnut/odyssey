import { TestBed } from '@angular/core/testing';

import { CreditBalanceService } from './credit-balance.service';

describe('CreditBalanceService', () => {
  let service: CreditBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
