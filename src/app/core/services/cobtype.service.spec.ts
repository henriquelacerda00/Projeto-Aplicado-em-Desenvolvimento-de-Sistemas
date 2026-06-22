import { TestBed } from '@angular/core/testing';

import { CobtypeService } from './cobtype.service';

describe('CobtypeService', () => {
  let service: CobtypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CobtypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
