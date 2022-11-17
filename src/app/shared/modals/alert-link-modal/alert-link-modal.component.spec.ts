import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertLinkModalComponent } from './alert-link-modal.component';

describe('AlertLinkModalComponent', () => {
  let component: AlertLinkModalComponent;
  let fixture: ComponentFixture<AlertLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertLinkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
