import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface Segment { nom: string; count: number; couleur: string; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1 class="page-title">Dashboard</h1>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value">{{ stats?.total_clients ?? '—' }}</div>
          <div class="kpi-label">Total clients</div>
        </div>
        <div class="kpi-card success">
          <div class="kpi-value">{{ stats?.clients_actifs ?? '—' }}</div>
          <div class="kpi-label">Clients actifs</div>
        </div>
        <div class="kpi-card gold">
          <div class="kpi-value">{{ (stats?.total_points_cumules | number) ?? '—' }}</div>
          <div class="kpi-label">Points distribués</div>
        </div>
        <div class="kpi-card platinum">
          <div class="kpi-value">{{ tauxActifs }}%</div>
          <div class="kpi-label">Taux d'activité</div>
        </div>
      </div>

      <!-- Segment Chart -->
      <div class="card">
        <h2>Répartition des segments</h2>
        <div class="segment-chart">
          @for (seg of segments; track seg.nom) {
            <div class="segment-row">
              <span class="seg-label">{{ seg.nom }}</span>
              <div class="bar-bg">
                <div class="bar"
                     [style.width]="getBarWidth(seg.count)"
                     [style.background-color]="seg.couleur">
                  {{ seg.count }}
                </div>
              </div>
              <span class="seg-count">
                {{ total > 0 ? ((seg.count / total) * 100 | number:'1.0-0') : 0 }}%
              </span>
            </div>
          }
        </div>
      </div>

      <!-- Qualité des données -->
      @if (qualite) {
        <div class="card">
          <h2>Qualité des données</h2>
          <div class="qualite-grid">
            <div class="qualite-item">
              <span class="q-val" [class]="qualite.emails_manquants > 0 ? 'danger' : 'ok'">
                {{ qualite.emails_manquants }}
              </span>
              <span class="q-label">Emails manquants</span>
            </div>
            <div class="qualite-item">
              <span class="q-val" [class]="qualite.telephones_manquants > 3 ? 'warn' : 'ok'">
                {{ qualite.telephones_manquants }}
              </span>
              <span class="q-label">Téléphones manquants</span>
            </div>
            <div class="qualite-item">
              <span class="q-val warn">{{ qualite.dates_naissance_manquantes }}</span>
              <span class="q-label">Dates naissance manquantes</span>
            </div>
            <div class="qualite-item">
              <span class="q-val" [class]="qualite.clients_anonymises > 0 ? 'warn' : 'ok'">
                {{ qualite.clients_anonymises }}
              </span>
              <span class="q-label">Clients anonymisés</span>
            </div>
            <div class="qualite-item">
              <span class="q-val" [class]="qualite.doublons_email > 0 ? 'danger' : 'ok'">
                {{ qualite.doublons_email }}
              </span>
              <span class="q-label">Doublons email</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  stats: any    = null;
  qualite: any  = null;
  segments: Segment[] = [];
  tauxActifs    = 0;
  total         = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getStats().subscribe((res: any) => {
      this.stats = res.data;
      this.total = this.stats.total_clients;
      this.tauxActifs = this.total > 0
        ? Math.round((this.stats.clients_actifs / this.total) * 100)
        : 0;
      this.segments = [
        { nom: 'STANDARD', count: this.stats.standard, couleur: '#6c757d' },
        { nom: 'SILVER',   count: this.stats.silver,   couleur: '#868e96' },
        { nom: 'GOLD',     count: this.stats.gold,     couleur: '#f59f00' },
        { nom: 'PLATINUM', count: this.stats.platinum, couleur: '#7950f2' },
      ];
    });

    this.api.getQualite().subscribe((res: any) => {
      this.qualite = res.data;
    });
  }

  getBarWidth(count: number): string {
    if (this.total === 0) return '0%';
    return Math.max((count / this.total) * 100, count > 0 ? 8 : 0) + '%';
  }
}
