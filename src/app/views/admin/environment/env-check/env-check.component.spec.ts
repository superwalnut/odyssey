import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvCheckComponent } from './env-check.component';

describe('EnvCheckComponent', () => {
  let component: EnvCheckComponent;
  let fixture: ComponentFixture<EnvCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
