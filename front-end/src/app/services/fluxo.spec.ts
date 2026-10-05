import { TestBed } from '@angular/core/testing';
import { Fluxo } from './fluxo';

describe('Fluxo', () => {
  let service: Fluxo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fluxo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
