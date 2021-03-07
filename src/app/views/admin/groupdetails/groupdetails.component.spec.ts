import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupdetailsComponent } from './groupdetails.component';

describe('GroupdetailsComponent', () => {
  let component: GroupdetailsComponent;
  let fixture: ComponentFixture<GroupdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
