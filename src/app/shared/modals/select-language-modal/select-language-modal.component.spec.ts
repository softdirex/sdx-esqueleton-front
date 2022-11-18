import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLanguageModalComponent } from './select-language-modal.component';

describe('SelectLanguageModalComponent', () => {
  let component: SelectLanguageModalComponent;
  let fixture: ComponentFixture<SelectLanguageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLanguageModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLanguageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
