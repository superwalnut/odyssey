import { TestBed } from '@angular/core/testing';

import { GroupExpenseService } from './group-expense.service';

describe('GroupExpenseService', () => {
  let service: GroupExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
