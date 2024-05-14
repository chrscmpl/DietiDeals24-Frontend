import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySelectionComponent } from './category-selection.component';

describe('CategorySelectionComponent', () => {
  let component: CategorySelectionComponent;
  let fixture: ComponentFixture<CategorySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
