import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGradeComponent } from './user-grade.component';

describe('UserGradeComponent', () => {
  let component: UserGradeComponent;
  let fixture: ComponentFixture<UserGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGradeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
