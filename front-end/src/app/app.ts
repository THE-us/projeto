import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
})
export class App {
  constructor(private authService: AuthService, private router: Router) {}

  estaLogado(): boolean {
    return this.authService.estaLogado();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
