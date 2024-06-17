import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSelectModalComponent } from './store-select-modal.component';

describe('StoreSelectModalComponent', () => {
  let component: StoreSelectModalComponent;
  let fixture: ComponentFixture<StoreSelectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreSelectModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StoreSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
