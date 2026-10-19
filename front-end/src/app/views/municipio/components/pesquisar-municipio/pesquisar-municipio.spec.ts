import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PesquisarMunicipio } from './pesquisar-municipio';

describe('PesquisarMunicipio', () => {
  let component: PesquisarMunicipio;
  let fixture: ComponentFixture<PesquisarMunicipio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PesquisarMunicipio],
    }).compileComponents();

    fixture = TestBed.createComponent(PesquisarMunicipio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
