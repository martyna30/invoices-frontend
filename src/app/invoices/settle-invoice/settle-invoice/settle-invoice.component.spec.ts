import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleInvoiceComponent } from './settle-invoice.component';

describe('SettleInvoiceComponent', () => {
  let component: SettleInvoiceComponent;
  let fixture: ComponentFixture<SettleInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettleInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettleInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
