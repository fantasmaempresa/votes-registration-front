import { TestBed } from '@angular/core/testing';

import { BasePersonalService } from './base-personal.service';

describe('BasePersonalService', () => {
  let service: BasePersonalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasePersonalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
