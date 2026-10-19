import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PesquisarEquipamento } from './pesquisar-equipamento';

describe('PesquisarEquipamento', () => {
  let component: PesquisarEquipamento;
  let fixture: ComponentFixture<PesquisarEquipamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PesquisarEquipamento],
    }).compileComponents();

    fixture = TestBed.createComponent(PesquisarEquipamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
