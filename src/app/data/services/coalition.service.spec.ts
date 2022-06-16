import { TestBed } from '@angular/core/testing';

import { CoalitionService } from './coalition.service';

describe('CoalitionService', () => {
  let service: CoalitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoalitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
