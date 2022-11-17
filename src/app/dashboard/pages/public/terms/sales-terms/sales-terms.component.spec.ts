import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTermsComponent } from './sales-terms.component';

describe('SalesTermsComponent', () => {
  let component: SalesTermsComponent;
  let fixture: ComponentFixture<SalesTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
