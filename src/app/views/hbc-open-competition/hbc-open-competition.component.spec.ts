import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HbcOpenCompetitionComponent } from './hbc-open-competition.component';

describe('HbcOpenCompetitionComponent', () => {
  let component: HbcOpenCompetitionComponent;
  let fixture: ComponentFixture<HbcOpenCompetitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HbcOpenCompetitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HbcOpenCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
