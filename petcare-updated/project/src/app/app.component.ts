import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    NavbarComponent
  ],
  template: `
    <app-navbar *ngIf="showNavbar"></app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #F5F5DC;
    }
  `]
})
export class AppComponent {
  showNavbar = true; 

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      // Hide global navbar for all full-layout pages using the sidebar.
      this.showNavbar = !(
          url.startsWith('/dashboard') || 
          url.startsWith('/shop') || 
          url.startsWith('/vaccines') || 
          url.startsWith('/vets') || 
          url.startsWith('/profile')
      );
    });
  }
}