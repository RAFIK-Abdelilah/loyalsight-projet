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
        <p style="color: #868e96;">Chargement...</p>
      }

      @if (client) {
        <!-- En-tête -->
        <div class="page-header">
          <button class="btn-back" (click)="retour()">← Retour</button>
          <h1 class="page-title" style="margin-bottom:0">
            {{ client.prenom }} {{ client.nom }}
          </h1>
          <span class="badge badge-{{ client.segment.toLowerCase() }}">{{ client.segment }}</span>
          <span [class]="client.actif ? 'actif-oui' : 'actif-non'" style="margin-left:auto">
            {{ client.actif ? 'Actif' : 'Inactif' }}
          </span>
        </div>

        <!-- Infos personnelles -->
        <div class="card">
          <h2>Informations personnelles</h2>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Email</span>
              <span>{{ client.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Téléphone</span>
              <span>{{ client.telephone || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date de naissance</span>
              <span>{{ client.date_naissance || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Inscrit le</span>
              <span>{{ client.date_inscription }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Anonymisé</span>
              <span [class]="client.anonymise ? 'actif-non' : 'actif-oui'">
                {{ client.anonymise ? 'Oui' : 'Non' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Solde de points -->
        @if (points) {
          <div class="card">
            <h2>Solde de points</h2>
            <div class="points-grid">
              <div class="points-card">
                <div class="points-val">{{ points.points_cumules | number }}</div>
                <div class="points-label">Points cumulés</div>
              </div>
              <div class="points-card green">
                <div class="points-val">{{ points.points_disponibles | number }}</div>
                <div class="points-label">Points disponibles</div>
              </div>
              <div class="points-card grey">
                <div class="points-val">{{ points.points_utilises | number }}</div>
                <div class="points-label">Points utilisés</div>
              </div>
            </div>
            <p style="margin-top:.8rem; font-size:.78rem; color:#868e96;">
              Dernière mise à jour : {{ points.derniere_mise_a_jour }}
            </p>
          </div>
        }

        <!-- Historique transactions -->
        <div class="card">
          <h2>Historique des transactions</h2>
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
                  <td style="color:#868e96; font-size:.82rem;">{{ t.date_transaction }}</td>
                  <td>
                    <span class="badge-type type-{{ t.type.toLowerCase() }}">{{ t.type }}</span>
                  </td>
                  <td [class]="t.points >= 0 ? 'positive' : 'negative'">
                    {{ t.points >= 0 ? '+' : '' }}{{ t.points }}
                  </td>
                  <td>{{ t.montant != null ? (t.montant + ' €') : '—' }}</td>
                  <td>{{ t.description }}</td>
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
}
