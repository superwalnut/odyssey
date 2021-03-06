import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreditComponent } from './user-credit.component';

describe('UserCreditComponent', () => {
  let component: UserCreditComponent;
  let fixture: ComponentFixture<UserCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
