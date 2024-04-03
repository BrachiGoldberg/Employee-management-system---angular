import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompanyDetailsComponent } from './update-company-details.component';

describe('UpdateCompanyDetailsComponent', () => {
  let component: UpdateCompanyDetailsComponent;
  let fixture: ComponentFixture<UpdateCompanyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCompanyDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
