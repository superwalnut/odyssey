import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptIncomeComponent } from './rpt-income.component';

describe('RptIncomeComponent', () => {
  let component: RptIncomeComponent;
  let fixture: ComponentFixture<RptIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
