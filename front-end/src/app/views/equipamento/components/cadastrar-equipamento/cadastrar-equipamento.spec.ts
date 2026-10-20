import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastrarEquipamento } from './cadastrar-equipamento';

describe('CadastrarEquipamento', () => {
  let component: CadastrarEquipamento;
  let fixture: ComponentFixture<CadastrarEquipamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastrarEquipamento],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarEquipamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
