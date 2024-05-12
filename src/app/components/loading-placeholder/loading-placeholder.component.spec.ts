import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPlaceholderComponent } from './loading-placeholder.component';

describe('LoadingPlaceholderComponent', () => {
  let component: LoadingPlaceholderComponent;
  let fixture: ComponentFixture<LoadingPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingPlaceholderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadingPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
