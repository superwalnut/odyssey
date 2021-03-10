import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFamilyComponent } from './manage-family.component';

describe('ManageFamilyComponent', () => {
  let component: ManageFamilyComponent;
  let fixture: ComponentFixture<ManageFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFamilyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
