import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtagComponent } from './airtag.component';

describe('AirtagComponent', () => {
  let component: AirtagComponent;
  let fixture: ComponentFixture<AirtagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirtagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
