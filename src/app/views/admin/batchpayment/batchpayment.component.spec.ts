import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchpaymentComponent } from './batchpayment.component';

describe('BatchpaymentComponent', () => {
  let component: BatchpaymentComponent;
  let fixture: ComponentFixture<BatchpaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchpaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchpaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
