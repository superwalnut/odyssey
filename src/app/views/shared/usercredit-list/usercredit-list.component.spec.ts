import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreditListComponent } from './usercredit-list.component';

describe('TransactionListComponent', () => {
  let component: UserCreditListComponent;
  let fixture: ComponentFixture<UserCreditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCreditListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
