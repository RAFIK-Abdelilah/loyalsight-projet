import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-rgpd',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">

      <!-- Page Header -->
      <div class="page-header" style="margin-bottom: 2rem;">
        <div>
          <h1 class="page-title">Module RGPD</h1>
          <p class="page-subtitle">Gestion des droits et conformité des données personnelles</p>
        </div>
      </div>

      <div class="rgpd-layout">

        <!-- Colonne gauche : formulaires -->
        <div class="rgpd-forms">

          <!-- Formulaire demande RGPD -->
          <div class="card">
            <div class="form-card-header">
              <div class="form-card-icon" style="background: rgba(108,99,255,.15); color: #6C63FF;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <h2 class="card-title" style="margin-bottom:0;">Nouvelle demande RGPD</h2>
            </div>

            @if (msgDemande) {
              <div class="alert" [class]="okDemande ? 'alert-success' : 'alert-error'" style="margin-bottom:1rem;">
                {{ msgDemande }}
              </div>
            }
            <div class="form-group">
              <label>ID Client</label>
              <input type="number" [(ngModel)]="demandeForm.client_id" placeholder="Ex : 3" min="1" />
            </div>
            <div class="form-group">
              <label>Type de demande</label>
              <select [(ngModel)]="demandeForm.type_demande">
                <option value="SUPPRESSION">Suppression (droit à l'oubli)</option>
                <option value="EXPORT">Export des données</option>
                <option value="RECTIFICATION">Rectification</option>
              </select>
            </div>
            <button class="btn btn-primary" (click)="soumettreDemande()" style="width:100%;">
              Soumettre la demande
            </button>
          </div>

          <!-- Anonymisation -->
          <div class="card">
            <div class="form-card-header">
              <div class="form-card-icon" style="background: rgba(255,71,87,.1); color: #FF4757;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                </svg>
              </div>
              <h2 class="card-title" style="margin-bottom:0;">Anonymiser un client</h2>
            </div>
            <p class="anon-warning">
              Cette action est <strong>irréversible</strong> : nom, prénom, email et données personnelles seront effacés définitivement.
            </p>

            @if (msgAnon) {
              <div class="alert" [class]="okAnon ? 'alert-success' : 'alert-error'" style="margin-bottom:1rem;">
                {{ msgAnon }}
              </div>
            }
            <div class="form-row">
              <div class="form-group" style="margin-bottom:0">
                <label>ID Client</label>
                <input type="number" [(ngModel)]="anonClientId" placeholder="Ex : 5" min="1" />
              </div>
              <div style="display:flex; align-items:flex-end;">
                <button class="btn btn-danger" (click)="anonymiser()" style="width:100%;">
                  Anonymiser
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Colonne droite : tableau des demandes -->
        <div class="rgpd-demandes">
          <div class="card" style="padding:0; overflow:hidden; margin-bottom:0;">
            <div class="table-header">
              <div>
                <h2 class="card-title" style="margin-bottom:.2rem;">Demandes RGPD</h2>
                <span class="table-count">{{ demandes.length }} demande(s)</span>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Type</th>
                  <th>Statut</th>
                  <th>Demandé le</th>
                  <th>Traité le</th>
                </tr>
              </thead>
              <tbody>
                @for (d of demandes; track d.id) {
                  <tr>
                    <td class="td-id">#{{ d.id }}</td>
                    <td><strong>{{ d.client_id }}</strong></td>
                    <td>
                      <span class="type-chip type-{{ d.type_demande.toLowerCase() }}">
                        {{ d.type_demande }}
                      </span>
                    </td>
                    <td>
                      <span class="statut statut-{{ d.statut.toLowerCase() }}">{{ d.statut }}</span>
                    </td>
                    <td class="td-date">{{ d.date_demande }}</td>
                    <td class="td-date">
                      @if (d.date_traitement) {
                        {{ d.date_traitement }}
                      } @else {
                        <em class="en-attente">En attente</em>
                      }
                    </td>
                  </tr>
                }
                @empty {
                  <tr><td colspan="6" class="empty">Aucune demande RGPD enregistrée</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .rgpd-layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 960px) {
      .rgpd-layout { grid-template-columns: 1fr; }
    }
    .rgpd-forms { display: flex; flex-direction: column; gap: 0; }

    .form-card-header {
      display: flex;
      align-items: center;
      gap: .75rem;
      margin-bottom: 1.25rem;
    }
    .form-card-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .anon-warning {
      font-size: .82rem;
      color: #8B8FA8;
      background: rgba(255,71,87,.06);
      border: 1px solid rgba(255,71,87,.15);
      border-radius: 8px;
      padding: .75rem;
      margin-bottom: 1.1rem;
      line-height: 1.5;
    }
    .anon-warning strong { color: #FF4757; }

    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem .75rem;
      border-bottom: 1px solid #2A2D3E;
    }
    .table-count { font-size: .78rem; color: #8B8FA8; }

    .td-id { color: #8B8FA8; font-size: .82rem; }
    .td-date { color: #8B8FA8; font-size: .78rem; white-space: nowrap; }
    .en-attente { color: #4A5568; font-style: italic; font-size: .78rem; }

    .type-chip {
      display: inline-block;
      padding: .2rem .55rem;
      border-radius: 6px;
      font-size: .68rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .04em;
      background: rgba(108,99,255,.12);
      color: #6C63FF;
    }
    .type-suppression { background: rgba(255,71,87,.1); color: #FF4757; }
    .type-export { background: rgba(0,212,170,.1); color: #00D4AA; }
    .type-rectification { background: rgba(255,165,2,.1); color: #FFA502; }
  `],
})
export class RgpdComponent implements OnInit {
  demandes: any[] = [];

  demandeForm = { client_id: null as number | null, type_demande: 'SUPPRESSION' };
  anonClientId: number | null = null;

  msgDemande = '';
  okDemande  = false;
  msgAnon    = '';
  okAnon     = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.chargerDemandes();
  }

  chargerDemandes(): void {
    this.api.getDemandes().subscribe((res: any) => {
      this.demandes = res.data;
    });
  }

  soumettreDemande(): void {
    if (!this.demandeForm.client_id) {
      this.msgDemande = 'Veuillez saisir un ID client.';
      this.okDemande = false;
      return;
    }
    this.msgDemande = '';
    this.api.anonymiserClient(this.demandeForm.client_id).subscribe({
      next: (res: any) => {
        this.okDemande = true;
        this.msgDemande = res.message;
        this.chargerDemandes();
      },
      error: (err) => {
        this.okDemande = false;
        this.msgDemande = err.error?.message || 'Erreur lors de la demande.';
      },
    });
  }

  anonymiser(): void {
    if (!this.anonClientId) {
      this.msgAnon = 'Veuillez saisir un ID client.';
      this.okAnon = false;
      return;
    }
    if (!confirm(`Confirmer l'anonymisation du client #${this.anonClientId} ?`)) return;

    this.msgAnon = '';
    this.api.anonymiserClient(this.anonClientId).subscribe({
      next: (res: any) => {
        this.okAnon = true;
        this.msgAnon = res.message;
        this.anonClientId = null;
        this.chargerDemandes();
      },
      error: (err) => {
        this.okAnon = false;
        this.msgAnon = err.error?.message || "Erreur lors de l'anonymisation.";
      },
    });
  }
}
