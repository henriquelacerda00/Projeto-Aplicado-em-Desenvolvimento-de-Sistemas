import { TestBed } from '@angular/core/testing';

import { ExportFilesService } from './export-files.service';

describe('ExportFilesService', () => {
  let service: ExportFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
