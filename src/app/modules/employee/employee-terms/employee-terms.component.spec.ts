import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTermsComponent } from './employee-terms.component';

describe('EmployeeTermsComponent', () => {
  let component: EmployeeTermsComponent;
  let fixture: ComponentFixture<EmployeeTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeTermsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
