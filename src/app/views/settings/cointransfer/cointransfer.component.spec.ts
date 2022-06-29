import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CointransferComponent } from './cointransfer.component';

describe('CointransferComponent', () => {
  let component: CointransferComponent;
  let fixture: ComponentFixture<CointransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CointransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CointransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
