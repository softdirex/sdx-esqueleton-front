import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBarCodeComponent } from './print-bar-code.component';

describe('PrintBarCodeComponent', () => {
  let component: PrintBarCodeComponent;
  let fixture: ComponentFixture<PrintBarCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintBarCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintBarCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
