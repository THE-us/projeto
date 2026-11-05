import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icone',
  standalone: false,
  templateUrl: './icone.html',
  styleUrl: './icone.scss'
})
export class Icone {
  @Input() nome = '';
  @Input() tamanho = 20;
}
