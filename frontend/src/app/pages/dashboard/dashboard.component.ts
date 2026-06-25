import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface Segment { nom: string; count: number; couleur: string; bg: string; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">

      <!-- Page Header -->
      <div class="dash-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Vue d'ensemble du programme de fidélité</p>
        </div>
        <div class="header-date">{{ today }}</div>
      </div>

      <!-- Metric Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(108,99,255,.15); color: #6C63FF;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="metric-value">{{ stats?.total_clients ?? '—' }}</div>
          <div class="metric-label">Total clients</div>
          <div class="metric-sub">Tous segments confondus</div>
        </div>

        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(0,212,170,.12); color: #00D4AA;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="metric-value" style="color: #00D4AA;">{{ stats?.clients_actifs ?? '—' }}</div>
          <div class="metric-label">Clients actifs</div>
          <div class="metric-sub">{{ tauxActifs }}% du total</div>
        </div>

        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(245,166,35,.12); color: #F5A623;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="metric-value" style="color: #F5A623;">{{ (stats?.total_points_cumules | number) ?? '—' }}</div>
          <div class="metric-label">Points distribués</div>
          <div class="metric-sub">Cumul total programme</div>
        </div>

        <div class="metric-card">
          <div class="metric-icon" style="background: rgba(167,139,250,.12); color: #A78BFA;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div class="metric-value" style="color: #A78BFA;">{{ tauxActifs }}%</div>
          <div class="metric-label">Taux d'activité</div>
          <div class="metric-sub">Clients actifs / total</div>
        </div>
      </div>

      <!-- Bottom Grid: Segments + Quality -->
      <div class="dash-bottom-grid">

        <!-- Segment Chart -->
        <div class="card" style="margin-bottom:0;">
          <h2 class="card-title">Répartition des segments</h2>
          <div class="segment-chart">
            @for (seg of segments; track seg.nom) {
              <div class="segment-row">
                <div class="seg-info">
                  <span class="seg-dot" [style.background]="seg.couleur"></span>
                  <span class="seg-label">{{ seg.nom }}</span>
                </div>
                <div class="bar-track">
                  <div
                    class="bar-fill"
                    [style.width]="getBarWidth(seg.count)"
                    [style.background]="seg.couleur"
                  ></div>
                </div>
                <div class="seg-stats">
                  <span class="seg-count">{{ seg.count }}</span>
                  <span class="seg-pct">{{ total > 0 ? ((seg.count / total) * 100 | number:'1.0-0') : 0 }}%</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Quality Data -->
        @if (qualite) {
          <div class="card" style="margin-bottom:0;">
            <h2 class="card-title">Qualité des données</h2>
            <div class="qualite-grid">
              <div class="qualite-card" [class.qualite-ok]="qualite.emails_manquants === 0" [class.qualite-danger]="qualite.emails_manquants > 0">
                <div class="q-val">{{ qualite.emails_manquants }}</div>
                <div class="q-label">Emails manquants</div>
              </div>
              <div class="qualite-card" [class.qualite-ok]="qualite.telephones_manquants <= 3" [class.qualite-warn]="qualite.telephones_manquants > 3">
                <div class="q-val">{{ qualite.telephones_manquants }}</div>
                <div class="q-label">Téléphones manquants</div>
              </div>
              <div class="qualite-card qualite-warn">
                <div class="q-val">{{ qualite.dates_naissance_manquantes }}</div>
                <div class="q-label">Dates naissance manquantes</div>
              </div>
              <div class="qualite-card" [class.qualite-ok]="qualite.clients_anonymises === 0" [class.qualite-warn]="qualite.clients_anonymises > 0">
                <div class="q-val">{{ qualite.clients_anonymises }}</div>
                <div class="q-label">Clients anonymisés</div>
              </div>
              <div class="qualite-card" [class.qualite-ok]="qualite.doublons_email === 0" [class.qualite-danger]="qualite.doublons_email > 0">
                <div class="q-val">{{ qualite.doublons_email }}</div>
                <div class="q-label">Doublons email</div>
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .dash-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 2rem;
      gap: 1rem;
    }
    .header-date {
      font-size: .8rem;
      color: #8B8FA8;
      background: #1A1D27;
      border: 1px solid #2A2D3E;
      border-radius: 8px;
      padding: .5rem .9rem;
      white-space: nowrap;
      margin-top: .2rem;
      font-weight: 500;
    }

    /* ── Metrics Grid ── */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 1100px) {
      .metrics-grid { grid-template-columns: repeat(2, 1fr); }
    }

    .metric-card {
      background: #1A1D27;
      border: 1px solid #2A2D3E;
      border-radius: 12px;
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      gap: .3rem;
      transition: border-color .2s;
    }
    .metric-card:hover { border-color: #6C63FF; }

    .metric-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: .5rem;
    }
    .metric-value {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      line-height: 1;
      letter-spacing: -.03em;
    }
    .metric-label {
      font-size: .8rem;
      font-weight: 600;
      color: #8B8FA8;
      text-transform: uppercase;
      letter-spacing: .06em;
      margin-top: .1rem;
    }
    .metric-sub {
      font-size: .75rem;
      color: #4A5568;
      margin-top: .1rem;
    }

    /* ── Bottom Grid ── */
    .dash-bottom-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 900px) {
      .dash-bottom-grid { grid-template-columns: 1fr; }
    }

    /* ── Segment Chart ── */
    .segment-chart {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .segment-row {
      display: flex;
      align-items: center;
      gap: .75rem;
    }
    .seg-info {
      display: flex;
      align-items: center;
      gap: .5rem;
      width: 110px;
      flex-shrink: 0;
    }
    .seg-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .seg-label {
      font-size: .75rem;
      font-weight: 600;
      color: #8B8FA8;
      text-transform: uppercase;
      letter-spacing: .05em;
    }
    .bar-track {
      flex: 1;
      height: 8px;
      background: #2A2D3E;
      border-radius: 4px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width .6s ease;
      min-width: 4px;
    }
    .seg-stats {
      display: flex;
      align-items: center;
      gap: .5rem;
      width: 70px;
      justify-content: flex-end;
    }
    .seg-count {
      font-size: .8rem;
      font-weight: 700;
      color: #fff;
    }
    .seg-pct {
      font-size: .72rem;
      color: #8B8FA8;
    }

    /* ── Qualité Grid ── */
    .qualite-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: .75rem;
    }
    .qualite-card {
      border-radius: 10px;
      padding: 1rem .75rem;
      text-align: center;
      border: 1px solid transparent;
    }
    .qualite-ok     { background: rgba(0,212,170,.08); border-color: rgba(0,212,170,.2); }
    .qualite-warn   { background: rgba(255,165,2,.08); border-color: rgba(255,165,2,.2); }
    .qualite-danger { background: rgba(255,71,87,.08); border-color: rgba(255,71,87,.2); }
    .q-val {
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1;
      margin-bottom: .35rem;
    }
    .qualite-ok .q-val     { color: #00D4AA; }
    .qualite-warn .q-val   { color: #FFA502; }
    .qualite-danger .q-val { color: #FF4757; }
    .q-label {
      font-size: .7rem;
      color: #8B8FA8;
      line-height: 1.3;
    }
  `],
})
export class DashboardComponent implements OnInit {
  stats: any    = null;
  qualite: any  = null;
  segments: Segment[] = [];
  tauxActifs    = 0;
  total         = 0;
  today         = '';

  constructor(private api: ApiService) {
    const d = new Date();
    this.today = d.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    this.today = this.today.charAt(0).toUpperCase() + this.today.slice(1);
  }

  ngOnInit(): void {
    this.api.getStats().subscribe((res: any) => {
      this.stats = res.data;
      this.total = this.stats.total_clients;
      this.tauxActifs = this.total > 0
        ? Math.round((this.stats.clients_actifs / this.total) * 100)
        : 0;
      this.segments = [
        { nom: 'STANDARD', count: this.stats.standard, couleur: '#4A5568', bg: 'rgba(74,85,104,.15)' },
        { nom: 'SILVER',   count: this.stats.silver,   couleur: '#8B8FA8', bg: 'rgba(139,143,168,.15)' },
        { nom: 'GOLD',     count: this.stats.gold,     couleur: '#F5A623', bg: 'rgba(245,166,35,.15)' },
        { nom: 'PLATINUM', count: this.stats.platinum, couleur: '#A78BFA', bg: 'rgba(167,139,250,.15)' },
      ];
    });
    this.api.getQualite().subscribe((res: any) => {
      this.qualite = res.data;
    });
  }

  getBarWidth(count: number): string {
    if (this.total === 0) return '0%';
    return Math.max((count / this.total) * 100, count > 0 ? 5 : 0) + '%';
  }
}
