import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignDashboardComponent } from './design-dashboard.component';

describe('DesignDashboardComponent', () => {
  let component: DesignDashboardComponent;
  let fixture: ComponentFixture<DesignDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
