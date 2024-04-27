import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowBackButtonComponent } from './arrow-back-button.component';

describe('ArrowBackButtonComponent', () => {
  let component: ArrowBackButtonComponent;
  let fixture: ComponentFixture<ArrowBackButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowBackButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArrowBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
