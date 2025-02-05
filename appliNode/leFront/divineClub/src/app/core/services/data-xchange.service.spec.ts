import { TestBed } from '@angular/core/testing';

import { DataXchangeService } from './data-xchange.service';

describe('DataXchangeService', () => {
  let service: DataXchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataXchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
