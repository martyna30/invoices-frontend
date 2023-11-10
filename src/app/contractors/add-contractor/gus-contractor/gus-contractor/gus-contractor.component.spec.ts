import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GusContractorComponent } from './gus-contractor.component';

describe('GusContractorComponent', () => {
  let component: GusContractorComponent;
  let fixture: ComponentFixture<GusContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GusContractorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GusContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
