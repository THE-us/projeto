import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  mostrarNavbar = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.verificarNavbar(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.verificarNavbar(event.urlAfterRedirects);
    });
  }

  verificarNavbar(url: string): void {
    this.mostrarNavbar = !url.includes('/login');
  }
}
