import { TestBed } from '@angular/core/testing';

import { TokenCheckerService } from './token-checker.service';

describe('TokenCheckerService', () => {
  let service: TokenCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
