import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HbcOpenCompetition2022DrawComponent } from './hbc-open-competition2022-draw.component';

describe('HbcOpenCompetition2022DrawComponent', () => {
  let component: HbcOpenCompetition2022DrawComponent;
  let fixture: ComponentFixture<HbcOpenCompetition2022DrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HbcOpenCompetition2022DrawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HbcOpenCompetition2022DrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
