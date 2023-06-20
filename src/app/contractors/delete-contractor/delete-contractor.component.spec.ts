import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteContractorComponent } from './delete-contractor.component';

describe('DeleteContractorComponent', () => {
  let component: DeleteContractorComponent;
  let fixture: ComponentFixture<DeleteContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteContractorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
