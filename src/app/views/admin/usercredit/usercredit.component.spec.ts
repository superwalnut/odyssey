import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercreditComponent } from './usercredit.component';

describe('UsercreditComponent', () => {
  let component: UsercreditComponent;
  let fixture: ComponentFixture<UsercreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsercreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
