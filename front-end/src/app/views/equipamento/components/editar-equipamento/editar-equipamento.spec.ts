import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarEquipamento } from './editar-equipamento';

describe('EditarEquipamento', () => {
  let component: EditarEquipamento;
  let fixture: ComponentFixture<EditarEquipamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarEquipamento],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarEquipamento);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
