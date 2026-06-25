import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7l9 5 9-5-9-5z" fill="#6C63FF"/>
            <path d="M3 12l9 5 9-5" stroke="#6C63FF" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path d="M3 17l9 5 9-5" stroke="#A78BFA" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>
          </svg>
          <span>LoyalSight</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
            <span>Dashboard</span>
          </a>

          <a routerLink="/clients" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Clients</span>
          </a>

          <a routerLink="/rgpd" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>RGPD</span>
          </a>

          <a routerLink="/sdk" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            <span>SDK</span>
          </a>

          <a routerLink="/agent" routerLinkActive="active" class="nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
              <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none"/>
              <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none"/>
              <path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5" stroke-linecap="round"/>
            </svg>
            <span>Agent IA</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <!-- Settings button -->
          <button
            class="settings-btn"
            [class.settings-btn--active]="settingsOpen"
            (click)="settingsOpen = !settingsOpen"
            title="Paramètres"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.spin-slow]="settingsOpen">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>Paramètres</span>
          </button>
          <div class="sidebar-version">v1.0.0</div>
        </div>
      </aside>

      <!-- Settings overlay -->
      @if (settingsOpen) {
        <div class="settings-overlay" (click)="settingsOpen = false"></div>

        <!-- Settings Panel -->
        <div class="settings-panel">
          <div class="sp-header">
            <span class="sp-title">Paramètres</span>
            <button class="sp-close" (click)="settingsOpen = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Section : Affichage -->
          <div class="sp-section">
            <div class="sp-section-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              Affichage
            </div>

            <div class="theme-cards">
              <!-- Dark -->
              <button
                class="theme-card"
                [class.theme-card--active]="theme === 'dark'"
                (click)="setTheme('dark')"
              >
                <div class="theme-preview theme-preview--dark">
                  <div class="tp-sidebar"></div>
                  <div class="tp-content">
                    <div class="tp-card"></div>
                    <div class="tp-card tp-card--sm"></div>
                  </div>
                </div>
                <div class="theme-card-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                  Sombre
                </div>
                @if (theme === 'dark') {
                  <div class="theme-card-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                }
              </button>

              <!-- Light -->
              <button
                class="theme-card"
                [class.theme-card--active]="theme === 'light'"
                (click)="setTheme('light')"
              >
                <div class="theme-preview theme-preview--light">
                  <div class="tp-sidebar"></div>
                  <div class="tp-content">
                    <div class="tp-card"></div>
                    <div class="tp-card tp-card--sm"></div>
                  </div>
                </div>
                <div class="theme-card-label">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                  Clair
                </div>
                @if (theme === 'light') {
                  <div class="theme-card-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                }
              </button>
            </div>
          </div>

          <!-- Divider pour futures sections -->
          <div class="sp-divider"></div>
          <p class="sp-future-hint">D'autres paramètres seront disponibles prochainement.</p>

        </div>
      }

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet />
      </main>

    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
    }

    /* ── Sidebar ───────────────────────────── */
    .sidebar {
      width: 240px;
      min-height: 100vh;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--sidebar-border);
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      z-index: 100;
      transition: background .25s, border-color .25s;
    }

    .sidebar-logo {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: 1.5rem 1.25rem 1.25rem;
      border-bottom: 1px solid var(--sidebar-border);
      margin-bottom: .5rem;
    }
    .sidebar-logo span {
      font-size: 1.1rem;
      font-weight: 700;
      color: #6C63FF;
      letter-spacing: -.01em;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: .25rem;
      padding: .5rem .75rem;
      flex: 1;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: .7rem .9rem;
      border-radius: 8px;
      color: var(--nav-text);
      text-decoration: none;
      font-size: .875rem;
      font-weight: 500;
      transition: background .15s, color .15s;
    }
    .nav-item:hover {
      background: var(--nav-hover-bg);
      color: var(--nav-text-hover);
    }
    .nav-item.active {
      background: rgba(108, 99, 255, .15);
      color: #6C63FF;
    }
    .nav-item.active svg { stroke: #6C63FF; }

    /* ── Sidebar Footer ── */
    .sidebar-footer {
      padding: .75rem;
      border-top: 1px solid var(--sidebar-border);
      display: flex;
      flex-direction: column;
      gap: .35rem;
    }

    .settings-btn {
      display: flex;
      align-items: center;
      gap: .75rem;
      width: 100%;
      padding: .65rem .9rem;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: var(--nav-text);
      font-size: .875rem;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      text-align: left;
      transition: background .15s, color .15s;
    }
    .settings-btn:hover {
      background: var(--nav-hover-bg);
      color: var(--nav-text-hover);
    }
    .settings-btn--active {
      background: rgba(108, 99, 255, .15);
      color: #6C63FF;
    }
    .settings-btn--active svg { stroke: #6C63FF; }

    .spin-slow {
      animation: spinGear 3s linear infinite;
    }
    @keyframes spinGear {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .sidebar-version {
      font-size: .68rem;
      color: #4A5568;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: .06em;
      padding: 0 .9rem;
    }

    /* ── Settings Overlay ── */
    .settings-overlay {
      position: fixed;
      inset: 0;
      z-index: 149;
      background: rgba(0, 0, 0, .45);
      backdrop-filter: blur(2px);
    }

    /* ── Settings Panel ── */
    .settings-panel {
      position: fixed;
      right: 0;
      top: 0;
      height: 100vh;
      width: 300px;
      background: var(--bg-card);
      border-left: 1px solid var(--border);
      z-index: 150;
      padding: 0;
      display: flex;
      flex-direction: column;
      animation: slideFromRight .22s cubic-bezier(.16,1,.3,1);
      box-shadow: -8px 0 32px rgba(0, 0, 0, .3);
    }
    @keyframes slideFromRight {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }

    .sp-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .sp-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text);
    }
    .sp-close {
      width: 30px;
      height: 30px;
      border-radius: 7px;
      background: var(--bg-card-2);
      border: 1px solid var(--border);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      transition: border-color .15s, color .15s;
    }
    .sp-close:hover { border-color: var(--danger); color: var(--danger); }

    .sp-section {
      padding: 1.25rem 1.5rem;
    }
    .sp-section-label {
      display: flex;
      align-items: center;
      gap: .45rem;
      font-size: .7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    /* ── Theme Cards ── */
    .theme-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: .75rem;
    }
    .theme-card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: .65rem;
      padding: .75rem;
      border-radius: 10px;
      border: 1.5px solid var(--border);
      background: var(--bg-card-2);
      cursor: pointer;
      transition: border-color .15s, transform .1s;
      font-family: 'Inter', sans-serif;
    }
    .theme-card:hover { border-color: #6C63FF; transform: scale(1.02); }
    .theme-card--active { border-color: #6C63FF; background: rgba(108,99,255,.06); }

    .theme-card-check {
      position: absolute;
      top: .5rem;
      right: .5rem;
      width: 18px;
      height: 18px;
      background: #6C63FF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    /* Mini Preview */
    .theme-preview {
      width: 100%;
      height: 64px;
      border-radius: 6px;
      display: flex;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .theme-preview--dark  { background: #0F1117; }
    .theme-preview--light { background: #ECEEF6; }

    .tp-sidebar {
      width: 28%;
      height: 100%;
      flex-shrink: 0;
    }
    .theme-preview--dark .tp-sidebar  { background: #0A0C14; border-right: 1px solid #2A2D3E; }
    .theme-preview--light .tp-sidebar { background: #FFFFFF; border-right: 1px solid #DEE0EC; }

    .tp-content {
      flex: 1;
      padding: 6px 5px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .tp-card {
      width: 100%;
      height: 18px;
      border-radius: 3px;
    }
    .tp-card--sm { height: 12px; width: 70%; }
    .theme-preview--dark .tp-card  { background: #1A1D27; }
    .theme-preview--dark .tp-card--sm { background: #212435; }
    .theme-preview--light .tp-card { background: #FFFFFF; }
    .theme-preview--light .tp-card--sm { background: #F2F4FA; }

    .theme-card-label {
      display: flex;
      align-items: center;
      gap: .4rem;
      font-size: .8rem;
      font-weight: 600;
      color: var(--text);
    }

    /* ── Divider + Hint ── */
    .sp-divider {
      height: 1px;
      background: var(--border);
      margin: 0 1.5rem;
    }
    .sp-future-hint {
      padding: 1rem 1.5rem;
      font-size: .78rem;
      color: var(--text-muted);
      font-style: italic;
    }

    /* ── Main Content ── */
    .main-content {
      flex: 1;
      margin-left: 240px;
      padding: 2rem 2.5rem;
      min-height: 100vh;
      transition: background .25s;
    }
  `],
})
export class AppComponent implements OnInit {
  settingsOpen = false;
  theme: 'dark' | 'light' = 'dark';

  ngOnInit(): void {
    const saved = localStorage.getItem('ls_theme') as 'dark' | 'light' | null;
    if (saved) this.applyTheme(saved);
  }

  setTheme(t: 'dark' | 'light'): void {
    this.applyTheme(t);
    localStorage.setItem('ls_theme', t);
  }

  private applyTheme(t: 'dark' | 'light'): void {
    this.theme = t;
    if (t === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }
}
