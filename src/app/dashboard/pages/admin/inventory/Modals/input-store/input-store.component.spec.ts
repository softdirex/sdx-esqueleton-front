import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputStoreComponent } from './input-store.component';

describe('InputStoreComponent', () => {
  let component: InputStoreComponent;
  let fixture: ComponentFixture<InputStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputStoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
