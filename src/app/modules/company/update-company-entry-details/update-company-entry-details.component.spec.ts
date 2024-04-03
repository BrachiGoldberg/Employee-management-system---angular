import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompanyEntryDetailsComponent } from './update-company-entry-details.component';

describe('UpdateCompanyEntryDetailsComponent', () => {
  let component: UpdateCompanyEntryDetailsComponent;
  let fixture: ComponentFixture<UpdateCompanyEntryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCompanyEntryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateCompanyEntryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
