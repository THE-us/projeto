import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PesquisarFluxo } from './pesquisar-fluxo';

describe('PesquisarFluxo', () => {
  let component: PesquisarFluxo;
  let fixture: ComponentFixture<PesquisarFluxo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PesquisarFluxo],
    }).compileComponents();

    fixture = TestBed.createComponent(PesquisarFluxo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
