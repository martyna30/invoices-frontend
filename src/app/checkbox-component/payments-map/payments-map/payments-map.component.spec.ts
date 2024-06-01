import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsMapComponent } from './payments-map.component';

describe('PaymentsMapComponent', () => {
  let component: PaymentsMapComponent;
  let fixture: ComponentFixture<PaymentsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentsMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
