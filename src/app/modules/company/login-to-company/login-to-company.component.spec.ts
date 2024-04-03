import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginToCompanyComponent } from './login-to-company.component';

describe('LoginToCompanyComponent', () => {
  let component: LoginToCompanyComponent;
  let fixture: ComponentFixture<LoginToCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginToCompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginToCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
