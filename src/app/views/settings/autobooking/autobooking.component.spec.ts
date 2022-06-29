import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutobookingComponent } from './autobooking.component';

describe('AutobookingComponent', () => {
  let component: AutobookingComponent;
  let fixture: ComponentFixture<AutobookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutobookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutobookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
