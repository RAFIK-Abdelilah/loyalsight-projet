import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">

      @if (chargement) {
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <span>Chargement...</span>
        </div>
      }

      @if (client) {

        <!-- Header -->
        <div class="detail-header">
          <button class="btn-back" (click)="retour()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Retour
          </button>
          <div class="client-identity">
            <div class="avatar-large" [style.background]="getAvatarColor(client.segment)">
              {{ client.prenom.charAt(0) }}{{ client.nom.charAt(0) }}
            </div>
            <div>
              <h1 class="page-title" style="margin-bottom:.25rem;">{{ client.prenom }} {{ client.nom }}</h1>
              <div class="header-badges">
                <span class="badge badge-{{ client.segment.toLowerCase() }}">{{ client.segment }}</span>
                <span [class]="client.actif ? 'actif-oui' : 'actif-non'">
                  {{ client.actif ? 'Actif' : 'Inactif' }}
                </span>
                @if (client.anonymise) {
                  <span class="badge-anon">Anonymisé</span>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Two columns: info + points -->
        <div class="detail-grid">

          <!-- Infos personnelles -->
          <div class="card">
            <h2 class="card-title">Informations personnelles</h2>
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value info-email">{{ client.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Téléphone</span>
                <span class="info-value">{{ client.telephone || '—' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date de naissance</span>
                <span class="info-value">{{ client.date_naissance || '—' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Inscrit le</span>
                <span class="info-value">{{ client.date_inscription }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">ID Client</span>
                <span class="info-value">#{{ client.id }}</span>
              </div>
            </div>
          </div>

          <!-- Points -->
          @if (points) {
            <div class="card">
              <h2 class="card-title">Solde de points</h2>
              <div class="points-grid">
                <div class="points-card">
                  <div class="points-val">{{ points.points_cumules | number }}</div>
                  <div class="points-label">Points cumulés</div>
                </div>
                <div class="points-card green">
                  <div class="points-val">{{ points.points_disponibles | number }}</div>
                  <div class="points-label">Points disponibles</div>
                </div>
                <div class="points-card">
                  <div class="points-val" style="color: #8B8FA8;">{{ points.points_utilises | number }}</div>
                  <div class="points-label">Points utilisés</div>
                </div>
              </div>
              @if (points.derniere_mise_a_jour) {
                <p style="margin-top:1rem; font-size:.75rem; color:#8B8FA8;">
                  Dernière mise à jour : {{ points.derniere_mise_a_jour }}
                </p>
              }
            </div>
          }

        </div>

        <!-- Transactions -->
        <div class="card" style="padding: 0; overflow: hidden;">
          <div class="table-header">
            <h2 class="card-title" style="margin-bottom:0;">Historique des transactions</h2>
            <span class="table-count">{{ transactions.length }} transaction(s)</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Points</th>
                <th>Montant</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              @for (t of transactions; track t.id) {
                <tr>
                  <td class="td-muted">{{ t.date_transaction }}</td>
                  <td>
                    <span class="badge-type type-{{ t.type.toLowerCase() }}">{{ t.type }}</span>
                  </td>
                  <td [class]="t.points >= 0 ? 'positive' : 'negative'">
                    {{ t.points >= 0 ? '+' : '' }}{{ t.points }}
                  </td>
                  <td class="td-muted">{{ t.montant != null ? (t.montant + ' €') : '—' }}</td>
                  <td class="td-muted">{{ t.description }}</td>
                </tr>
              }
              @empty {
                <tr><td colspan="5" class="empty">Aucune transaction enregistrée</td></tr>
              }
            </tbody>
          </table>
        </div>

      }
    </div>
  `,
  styles: [`
    .loading-state {
      display: flex;
      align-items: center;
      gap: .75rem;
      color: #8B8FA8;
      padding: 3rem 0;
    }
    .loading-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid #2A2D3E;
      border-top-color: #6C63FF;
      border-radius: 50%;
      animation: spin .7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .client-identity {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .avatar-large {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: .95rem;
      font-weight: 700;
      color: rgba(255,255,255,.9);
      flex-shrink: 0;
    }
    .header-badges {
      display: flex;
      align-items: center;
      gap: .5rem;
      margin-top: .35rem;
    }
    .badge-anon {
      display: inline-flex;
      padding: .2rem .55rem;
      border-radius: 6px;
      font-size: .7rem;
      font-weight: 600;
      background: rgba(255,71,87,.1);
      color: #FF4757;
      border: 1px solid rgba(255,71,87,.2);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 900px) {
      .detail-grid { grid-template-columns: 1fr; }
    }

    .info-email { color: #6C63FF; }
    .info-value { font-size: .875rem; color: #fff; }
    .td-muted { color: #8B8FA8; font-size: .82rem; }

    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem .75rem;
    }
    .table-count {
      font-size: .78rem;
      color: #8B8FA8;
    }
  `],
})
export class ClientDetailComponent implements OnInit {
  client: any        = null;
  points: any        = null;
  transactions: any[] = [];
  chargement         = true;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.api.getClient(id).subscribe({
      next: (res: any) => { this.client = res.data; this.chargement = false; },
      error: () => { this.chargement = false; },
    });

    this.api.getPoints(id).subscribe((res: any) => {
      this.points = res.data;
    });

    this.api.getTransactions(id).subscribe((res: any) => {
      this.transactions = res.data;
    });
  }

  retour(): void {
    this.router.navigate(['/clients']);
  }

  getAvatarColor(segment: string): string {
    const map: Record<string, string> = {
      STANDARD: '#4A5568',
      SILVER:   '#6B7280',
      GOLD:     '#92400E',
      PLATINUM: '#5B21B6',
    };
    return map[segment] || '#4A5568';
  }
}
