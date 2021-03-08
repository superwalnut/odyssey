import { TestBed } from '@angular/core/testing';

import { GroupIncomeService } from './group-income.service';

describe('GroupIncomeService', () => {
  let service: GroupIncomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupIncomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
