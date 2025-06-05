import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractorDocumentComponent } from './add-contractor-document.component';

describe('AddContractorDocumentComponent', () => {
  let component: AddContractorDocumentComponent;
  let fixture: ComponentFixture<AddContractorDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContractorDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContractorDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
