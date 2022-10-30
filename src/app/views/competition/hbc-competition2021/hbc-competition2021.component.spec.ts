import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HbcCompetition2021Component } from './hbc-competition2021.component';

describe('HbcCompetition2021Component', () => {
  let component: HbcCompetition2021Component;
  let fixture: ComponentFixture<HbcCompetition2021Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HbcCompetition2021Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HbcCompetition2021Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
