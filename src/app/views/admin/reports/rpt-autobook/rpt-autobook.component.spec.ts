import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptAutobookComponent } from './rpt-autobook.component';

describe('RptAutobookComponent', () => {
  let component: RptAutobookComponent;
  let fixture: ComponentFixture<RptAutobookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptAutobookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptAutobookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
