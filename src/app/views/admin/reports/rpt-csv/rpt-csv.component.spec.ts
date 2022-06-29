import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptCsvComponent } from './rpt-csv.component';

describe('RptCsvComponent', () => {
  let component: RptCsvComponent;
  let fixture: ComponentFixture<RptCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptCsvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
