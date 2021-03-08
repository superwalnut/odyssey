import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupexpenseComponent } from './groupexpense.component';

describe('GroupexpenseComponent', () => {
  let component: GroupexpenseComponent;
  let fixture: ComponentFixture<GroupexpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupexpenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupexpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
