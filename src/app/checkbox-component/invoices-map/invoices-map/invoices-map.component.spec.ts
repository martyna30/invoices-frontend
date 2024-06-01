import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesMapComponent } from './invoices-map.component';

describe('InvoicesMapComponent', () => {
  let component: InvoicesMapComponent;
  let fixture: ComponentFixture<InvoicesMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicesMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
