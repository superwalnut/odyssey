import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HbcOpen2023DrawComponent } from './hbc-open2023-draw.component';

describe('HbcOpen2023DrawComponent', () => {
  let component: HbcOpen2023DrawComponent;
  let fixture: ComponentFixture<HbcOpen2023DrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HbcOpen2023DrawComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HbcOpen2023DrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
