import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionTypeLinkComponent } from './auction-type-link.component';

describe('AuctionTypeLinkComponent', () => {
  let component: AuctionTypeLinkComponent;
  let fixture: ComponentFixture<AuctionTypeLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionTypeLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuctionTypeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
