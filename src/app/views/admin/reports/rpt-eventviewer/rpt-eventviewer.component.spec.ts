import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptEventviewerComponent } from './rpt-eventviewer.component';

describe('RptEventviewerComponent', () => {
  let component: RptEventviewerComponent;
  let fixture: ComponentFixture<RptEventviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptEventviewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptEventviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
