import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNavbarComponent } from './mobile-navbar.component';

describe('MobileNavbarComponent', () => {
  let component: MobileNavbarComponent;
  let fixture: ComponentFixture<MobileNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
