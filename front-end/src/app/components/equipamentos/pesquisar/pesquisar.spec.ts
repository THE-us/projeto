import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pesquisar } from './pesquisar';

describe('Pesquisar', () => {
  let component: Pesquisar;
  let fixture: ComponentFixture<Pesquisar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pesquisar],
    }).compileComponents();

    fixture = TestBed.createComponent(Pesquisar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
