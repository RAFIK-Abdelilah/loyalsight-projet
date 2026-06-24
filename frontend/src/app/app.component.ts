import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <span class="brand">LoyalSight</span>
      <ul class="nav-links">
        <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
        <li><a routerLink="/clients"   routerLinkActive="active">Clients</a></li>
        <li><a routerLink="/rgpd"      routerLinkActive="active">RGPD</a></li>
        <li><a routerLink="/sdk"       routerLinkActive="active">SDK</a></li>
        <li><a routerLink="/agent"     routerLinkActive="active">Agent IA</a></li>
      </ul>
    </nav>
    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #1a1a2e;
      padding: 0 2rem;
      height: 58px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand {
      color: white;
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 2rem;
    }
    .nav-links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: .9rem;
      padding-bottom: 2px;
      border-bottom: 2px solid transparent;
      transition: color .2s, border-color .2s;
    }
    .nav-links a:hover,
    .nav-links a.active {
      color: white;
      border-bottom-color: #4a90d9;
    }
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
  `],
})
export class AppComponent {}
