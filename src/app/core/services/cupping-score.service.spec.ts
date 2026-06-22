import { TestBed } from '@angular/core/testing';

import { CuppingScoreService } from './cupping-score.service';

describe('CuppingScoreService', () => {
  let service: CuppingScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuppingScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
