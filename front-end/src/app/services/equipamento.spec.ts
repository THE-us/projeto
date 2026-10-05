import { TestBed } from '@angular/core/testing';
import { EquipamentoTs } from './equipamento.js';

describe('EquipamentoTs', () => {
  let service: EquipamentoTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipamentoTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
