import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptUserCreditsComponent } from './rpt-user-credits.component';

describe('RptUserCreditsComponent', () => {
  let component: RptUserCreditsComponent;
  let fixture: ComponentFixture<RptUserCreditsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptUserCreditsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptUserCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
