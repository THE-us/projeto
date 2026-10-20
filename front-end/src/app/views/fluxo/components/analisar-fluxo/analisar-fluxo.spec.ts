import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalisarFluxo } from './analisar-fluxo';

describe('AnalisarFluxo', () => {
  let component: AnalisarFluxo;
  let fixture: ComponentFixture<AnalisarFluxo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalisarFluxo],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalisarFluxo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
