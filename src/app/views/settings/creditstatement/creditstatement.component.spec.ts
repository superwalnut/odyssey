import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditstatementComponent } from './creditstatement.component';

describe('CreditstatementComponent', () => {
  let component: CreditstatementComponent;
  let fixture: ComponentFixture<CreditstatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditstatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
