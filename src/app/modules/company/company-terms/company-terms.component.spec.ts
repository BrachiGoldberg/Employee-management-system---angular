import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTermsComponent } from './company-terms.component';

describe('CompanyTermsComponent', () => {
  let component: CompanyTermsComponent;
  let fixture: ComponentFixture<CompanyTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyTermsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
