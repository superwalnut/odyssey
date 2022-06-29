import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptUnpaidComponent } from './rpt-unpaid.component';

describe('RptUnpaidComponent', () => {
  let component: RptUnpaidComponent;
  let fixture: ComponentFixture<RptUnpaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptUnpaidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptUnpaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
