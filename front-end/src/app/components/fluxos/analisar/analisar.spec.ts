import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Analisar } from './analisar';

describe('Analisar', () => {
  let component: Analisar;
  let fixture: ComponentFixture<Analisar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analisar],
    }).compileComponents();

    fixture = TestBed.createComponent(Analisar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
