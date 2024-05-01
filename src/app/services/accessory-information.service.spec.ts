import { TestBed } from '@angular/core/testing';

import { AccessoryInformationService } from './accessory-information.service';

describe('AccessoryInformationService', () => {
  let service: AccessoryInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessoryInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
