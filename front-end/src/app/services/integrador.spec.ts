import { TestBed } from '@angular/core/testing';
import { Integrador } from './integrador';

describe('Integrador', () => {
  let service: Integrador;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Integrador);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
